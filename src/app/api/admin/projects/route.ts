import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/admin/projects — List all projects (admin sees all)
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

    const projects = await db.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        milestones: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin projects list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
