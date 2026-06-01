import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/portal/tickets/[id] — Get ticket with replies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Clients can only see their own tickets
    if (client.role === 'client' && ticket.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Ticket get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// POST /api/portal/tickets/[id] — Add reply to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Reply content is required' },
        { status: 400 }
      );
    }

    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (client.role === 'client' && ticket.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const reply = await db.ticketReply.create({
      data: {
        content: content.trim(),
        senderId: client.id,
        senderRole: client.role,
        ticketId: id,
      },
    });

    // Update ticket timestamp
    await db.ticket.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Notify the client (if admin replied)
    if (client.role === 'admin') {
      await db.notification.create({
        data: {
          clientId: ticket.clientId,
          title: 'Ticket Reply Received',
          message: `A new reply has been added to ticket "${ticket.subject}".`,
          type: 'info',
          category: 'ticket',
          link: 'tickets',
        },
      });
    }

    return NextResponse.json(
      { success: true, data: reply, message: 'Reply added successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Ticket reply error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}

// PATCH /api/portal/tickets/[id] — Update ticket status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { status, priority, subject } = body;

    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    if (client.role === 'client' && ticket.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (subject !== undefined) updateData.subject = subject;

    const updated = await db.ticket.update({
      where: { id },
      data: updateData,
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Notify client on status change by admin
    if (status && status !== ticket.status && client.role === 'admin') {
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
    console.error('Ticket update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
