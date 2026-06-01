import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/portal/tickets — List tickets for client
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = { clientId: client.id };
    if (status) where.status = status;
    if (category) where.category = category;

    const tickets = await db.ticket.findMany({
      where,
      include: {
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Tickets list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/portal/tickets — Create new ticket
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const body = await request.json();
    const { subject, description, priority, category } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { success: false, error: 'Subject and description are required' },
        { status: 400 }
      );
    }

    const ticket = await db.ticket.create({
      data: {
        subject: subject.trim(),
        description: description.trim(),
        priority: priority || 'medium',
        category: category || 'general',
        clientId: client.id,
      },
    });

    return NextResponse.json(
      { success: true, data: ticket, message: 'Ticket created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Ticket create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
