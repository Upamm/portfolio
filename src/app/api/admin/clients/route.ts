import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const where: Record<string, unknown> = {};
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { company: { contains: search } }];
    const [clients, total] = await Promise.all([
      db.client.findMany({
        where,
        select: { id: true, name: true, email: true, company: true, role: true, avatar: true, phone: true, address: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true, _count: { select: { projects: true, invoices: true, messages: true, tickets: true, notifications: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.client.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: clients, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin clients list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
