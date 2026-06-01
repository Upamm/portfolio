import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendNewMessageNotification } from '@/lib/email';

// GET /api/portal/messages — Get messages for client (with pagination)
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { clientId: client.id };

    const [messages, total] = await Promise.all([
      db.message.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      db.message.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Messages list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/portal/messages — Send a message
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        content: content.trim(),
        senderId: client.id,
        senderRole: client.role, // Always use authenticated user's role — no spoofing
        clientId: client.id,
      },
    });

    // Email notification to master admin when a client sends a message (fire-and-forget)
    if (client.role === 'client') {
      sendNewMessageNotification({
        senderName: client.name,
        senderRole: 'client',
        content: content.trim(),
      }).catch(() => {});
    }

    return NextResponse.json(
      { success: true, data: message, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Message send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
