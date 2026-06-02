import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

const VALID_STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_CATEGORIES = ['general', 'bug', 'feature', 'billing', 'support'];

// GET /api/admin/tickets/[id] — Get single ticket with full thread
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);
    const { id } = await params;

    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            avatar: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin ticket detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/tickets/[id] — Update ticket (status, priority, subject, category)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);
    const { id } = await params;

    const body = await request.json();
    const { status, priority, subject, category } = body;

    // Validate provided fields
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        { success: false, error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      );
    }

    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    if (subject !== undefined && !subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject cannot be empty' },
        { status: 400 }
      );
    }

    // Confirm ticket exists
    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (subject !== undefined) updateData.subject = subject.trim();
    if (category !== undefined) updateData.category = category;

    const updated = await db.ticket.update({
      where: { id },
      data: updateData,
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            avatar: true,
          },
        },
      },
    });

    // Create in-app notification for client on status change
    if (status && status !== ticket.status) {
      await db.notification.create({
        data: {
          clientId: ticket.clientId,
          title: 'Ticket Status Updated',
          message: `Ticket "${ticket.subject}" status changed to "${status}".`,
          type: 'info',
          category: 'ticket',
          link: 'tickets',
        },
      });
    }

    return NextResponse.json(
      { success: true, data: updated, message: 'Ticket updated successfully' }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin ticket update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tickets/[id] — Delete a ticket (cascade deletes replies)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);
    const { id } = await params;

    // Confirm ticket exists
    const ticket = await db.ticket.findUnique({
      where: { id },
      select: { id: true, subject: true },
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Delete ticket — cascade will handle replies via onDelete: Cascade on TicketReply
    await db.ticket.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Ticket "${ticket.subject}" deleted successfully`,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin ticket delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
