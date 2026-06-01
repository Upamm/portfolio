import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/portal/projects — List projects for authenticated client
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (client.role === 'client') {
      where.clientId = client.id;
    }

    if (status) {
      where.status = status;
    }

    const projects = await db.project.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Projects list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/portal/projects — Admin creates a project for a client
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const body = await request.json();
    const {
      title,
      description,
      clientId,
      status,
      priority,
      category,
      budget,
      deadline,
      startDate,
      progress,
      notes,
    } = body;

    if (!title || !description || !clientId) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and clientId are required' },
        { status: 400 }
      );
    }

    // Verify the target client exists
    const targetClient = await db.client.findUnique({ where: { id: clientId } });
    if (!targetClient) {
      return NextResponse.json(
        { success: false, error: 'Target client not found' },
        { status: 404 }
      );
    }

    const project = await db.project.create({
      data: {
        title,
        description,
        clientId,
        status: status || 'pending',
        priority: priority || 'medium',
        category: category || 'WordPress',
        budget: budget ?? null,
        deadline: deadline ? new Date(deadline) : null,
        startDate: startDate ? new Date(startDate) : null,
        progress: progress ?? 0,
        notes: notes || '',
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        milestones: true,
      },
    });

    // Notify the client
    await db.notification.create({
      data: {
        clientId,
        title: 'New Project Created',
        message: `A new project "${title}" has been created for you.`,
        type: 'info',
      },
    });

    return NextResponse.json(
      { success: true, data: project, message: 'Project created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Project create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
