import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const { id } = await params;
    const body = await request.json();
    const { resolved } = body;

    if (typeof resolved !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'resolved field is required (boolean)' },
        { status: 400 }
      );
    }

    const errorLog = await db.errorLog.update({
      where: { id },
      data: { resolved },
    });

    return NextResponse.json({ success: true, data: errorLog });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin error PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update error log' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const { id } = await params;
    await db.errorLog.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Error log deleted' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin error DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete error log' },
      { status: 500 }
    );
  }
}
