import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// POST /api/portal/messages/mark-read — Mark admin messages as read for this client
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);

    // Mark all admin-sent messages to this client as read
    const result = await db.message.updateMany({
      where: {
        clientId: client.id,
        senderRole: 'admin',
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { markedCount: result.count },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Mark-read error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
