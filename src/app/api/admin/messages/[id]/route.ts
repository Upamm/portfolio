import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// PUT /api/admin/messages/[id] — Edit message (admin can edit any)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    const message = await db.message.findFirst({
      where: { id, deletedAt: null },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
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
      data: { id: updated.id, content: updated.content, editedAt: updated.editedAt },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin message edit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to edit message' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/messages/[id] — Soft-delete message (admin can delete any)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;

    const message = await db.message.findFirst({
      where: { id, deletedAt: null },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    await db.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin message delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
