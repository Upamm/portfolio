import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/admin/messages — Get all conversations (grouped by client)
export async function GET(request: NextRequest) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (clientId) {
      // Get all messages for a specific client conversation with sender info
      const messages = await db.message.findMany({
        where: { clientId },
        orderBy: { createdAt: 'asc' },
      });
      // Fetch admin info for sender names
      const adminClient = await db.client.findFirst({
        where: { role: 'admin' },
        select: { id: true, name: true },
      });
      const clientUser = await db.client.findUnique({
        where: { id: clientId },
        select: { id: true, name: true },
      });
      const enrichedMessages = messages.map(msg => ({
        ...msg,
        senderName: msg.senderRole === 'admin'
          ? (adminClient?.name || 'Admin')
          : (clientUser?.name || 'Client'),
      }));
      return NextResponse.json({ success: true, data: enrichedMessages });
    }

    // Get conversation list - only clients who have messages
    const clientsWithMessages = await db.client.findMany({
      where: {
        role: 'client',
        messages: { some: {} },
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        avatar: true,
        isActive: true,
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get last message and unread count for each client
    const conversations = await Promise.all(
      clientsWithMessages.map(async (c) => {
        const lastMessage = await db.message.findFirst({
          where: { clientId: c.id },
          orderBy: { createdAt: 'desc' },
          select: { content: true, senderRole: true, createdAt: true, isRead: true },
        });
        const unreadCount = await db.message.count({
          where: { clientId: c.id, isRead: false, senderRole: 'client' },
        });
        return {
          ...c,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by most recent message first, clients with messages on top
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      if (aTime === 0 && bTime === 0) return 0;
      if (aTime === 0) return 1;
      if (bTime === 0) return -1;
      return bTime - aTime;
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin messages error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/messages — Admin sends message to a client
export async function POST(request: NextRequest) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);

    const body = await request.json();
    const { content, clientId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const targetClient = await db.client.findUnique({ where: { id: clientId } });
    if (!targetClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const message = await db.message.create({
      data: {
        content: content.trim(),
        senderId: admin.id,
        senderRole: 'admin',
        clientId,
      },
    });

    // Notify client
    await db.notification.create({
      data: {
        clientId,
        title: 'New Message from Admin',
        message: `${admin.name}: ${content.trim().substring(0, 100)}${content.trim().length > 100 ? '...' : ''}`,
        type: 'info',
      },
    });

    return NextResponse.json(
      { success: true, data: message, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin send message error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
