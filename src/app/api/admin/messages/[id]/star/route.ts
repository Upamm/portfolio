import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// POST /api/admin/messages/[id]/star — Toggle star
export async function POST(
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
    console.error('Admin message star error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle star' },
      { status: 500 }
    );
  }
}
