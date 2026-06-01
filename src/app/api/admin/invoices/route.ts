import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/admin/invoices — List all invoices (admin sees all)
export async function GET(request: NextRequest) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const invoices = await db.invoice.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin invoices list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/invoices/[id] — Update invoice status
// (handled in separate [id] route)
