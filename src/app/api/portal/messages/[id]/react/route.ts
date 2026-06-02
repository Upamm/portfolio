import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// POST /api/portal/messages/[id]/react — Toggle emoji reaction on a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { emoji } = body;

    if (!emoji || typeof emoji !== 'string' || emoji.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Valid emoji is required' },
        { status: 400 }
      );
    }

    const message = await db.message.findFirst({
      where: { id, clientId: client.id, deletedAt: null },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    // Check if reaction already exists
    const existing = await db.messageReaction.findUnique({
      where: {
        messageId_senderId_emoji: {
          messageId: id,
          senderId: client.id,
          emoji,
        },
      },
    });

    if (existing) {
      // Remove reaction
      await db.messageReaction.delete({ where: { id: existing.id } });
      // Get updated reaction count
      const remaining = await db.messageReaction.findMany({
        where: { messageId: id, emoji },
        select: { senderId: true },
      });
      return NextResponse.json({
        success: true,
        data: {
          emoji,
          removed: true,
          count: remaining.length,
        },
      });
    } else {
      // Add reaction
      await db.messageReaction.create({
        data: {
          messageId: id,
          emoji,
          senderId: client.id,
          senderRole: client.role,
        },
      });
      const reactions = await db.messageReaction.findMany({
        where: { messageId: id, emoji },
        select: { senderId: true },
      });
      return NextResponse.json({
        success: true,
        data: {
          emoji,
          removed: false,
          count: reactions.length,
          isOwn: true,
        },
      });
    }
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Message reaction error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle reaction' },
      { status: 500 }
    );
  }
}
