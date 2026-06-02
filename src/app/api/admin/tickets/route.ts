import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

const VALID_STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_CATEGORIES = ['general', 'bug', 'feature', 'billing', 'support'];

// GET /api/admin/tickets — List ALL tickets across all clients (admin view)
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Build where clause with filters
    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}, all` },
          { status: 400 }
        );
      }
      where.status = status;
    }

    if (priority) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return NextResponse.json(
          { success: false, error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
          { status: 400 }
        );
      }
      where.priority = priority;
    }

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
          { status: 400 }
        );
      }
      where.category = category;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search } },
        { description: { contains: search } },
        { client: { name: { contains: search } } },
        { client: { email: { contains: search } } },
        { client: { company: { contains: search } } },
      ];
    }

    const [tickets, total] = await Promise.all([
      db.ticket.findMany({
        where,
        select: {
          id: true,
          subject: true,
          description: true,
          status: true,
          priority: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          clientId: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
              avatar: true,
            },
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: Math.min(limit, 100),
      }),
      db.ticket.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: tickets, total });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin tickets list error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
