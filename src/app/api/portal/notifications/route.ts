import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/portal/notifications — List notifications for client
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: Record<string, unknown> = { clientId: client.id };
    if (unreadOnly) where.isRead = false;

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await db.notification.count({
      where: { clientId: client.id, isRead: false },
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: { unreadCount },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Notifications list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/portal/notifications — Mark all as read
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const body = await request.json();
    const { action } = body;

    if (action === 'mark-all-read') {
      const result = await db.notification.updateMany({
        where: { clientId: client.id, isRead: false },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        data: { updated: result.count },
        message: `${result.count} notification(s) marked as read`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "mark-all-read".' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Notifications action error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
