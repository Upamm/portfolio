import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// POST /api/portal/messages/[id]/star — Toggle star on a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const message = await db.message.findFirst({
      where: { id, clientId: client.id, deletedAt: null },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    const updated = await db.message.update({
      where: { id },
      data: { starred: !message.starred },
    });

    return NextResponse.json({
      success: true,
      data: { id: updated.id, starred: updated.starred },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Message star toggle error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle star' },
      { status: 500 }
    );
  }
}
