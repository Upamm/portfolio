import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// POST /api/admin/messages/bulk-read — Mark all messages from a client as read
export async function POST(request: NextRequest) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);

    const body = await request.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    await db.message.updateMany({
      where: { clientId, senderRole: 'client', isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Bulk read error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
