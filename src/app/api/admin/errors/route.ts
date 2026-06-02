import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level') || 'all';
    const source = searchParams.get('source') || 'all';
    const resolved = searchParams.get('resolved');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: Record<string, unknown> = {};
    if (level !== 'all') where.level = level;
    if (source !== 'all') where.source = source;
    if (resolved === 'true') where.resolved = true;
    else if (resolved === 'false') where.resolved = false;

    const errors = await db.errorLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const counts = await db.errorLog.groupBy({
      by: ['level'],
      _count: { id: true },
    });

    const totalCounts = await db.errorLog.groupBy({
      by: ['resolved'],
      _count: { id: true },
    });

    const unresolvedCount = totalCounts.find(c => !c.resolved)?._count.id || 0;

    return NextResponse.json({
      success: true,
      data: {
        errors,
        counts: counts.reduce((acc, c) => {
          acc[c.level] = c._count.id;
          return acc;
        }, {} as Record<string, number>),
        unresolvedCount,
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin errors GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch error logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const body = await request.json();
    const { level, source, message, stack, path, method, statusCode, clientId } = body;

    if (!message || !source) {
      return NextResponse.json(
        { success: false, error: 'Message and source are required' },
        { status: 400 }
      );
    }

    const errorLog = await db.errorLog.create({
      data: {
        level: level || 'error',
        source,
        message,
        stack: stack || '',
        path: path || '',
        method: method || '',
        statusCode: statusCode || 500,
        resolved: false,
        clientId: clientId || null,
      },
    });

    return NextResponse.json({ success: true, data: errorLog });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin errors POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create error log' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const { searchParams } = new URL(request.url);
    const resolvedOnly = searchParams.get('resolved') === 'true';

    if (resolvedOnly) {
      await db.errorLog.deleteMany({ where: { resolved: true } });
    } else {
      await db.errorLog.deleteMany();
    }

    return NextResponse.json({ success: true, message: 'Error logs cleared' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin errors DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear error logs' },
      { status: 500 }
    );
  }
}
