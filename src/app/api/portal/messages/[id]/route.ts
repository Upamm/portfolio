import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// PUT /api/portal/messages/[id] — Edit own message
export async function PUT(
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
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Find the message — must belong to this client and be sent by them
    const message = await db.message.findFirst({
      where: { id, clientId: client.id, senderId: client.id, deletedAt: null },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found or cannot be edited' },
        { status: 404 }
      );
    }

    const updated = await db.message.update({
      where: { id },
      data: {
        content: content.trim(),
        editedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        content: updated.content,
        editedAt: updated.editedAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Message edit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to edit message' },
      { status: 500 }
    );
  }
}

// DELETE /api/portal/messages/[id] — Soft-delete own message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    // Find the message — must belong to this client and be sent by them
    const message = await db.message.findFirst({
      where: { id, clientId: client.id, senderId: client.id, deletedAt: null },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found or cannot be deleted' },
        { status: 404 }
      );
    }

    await db.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Message delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
