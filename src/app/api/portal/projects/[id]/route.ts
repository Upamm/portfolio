import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/portal/projects/[id] — Get project details with milestones
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
        invoices: {
          select: { id: true, invoiceNumber: true, amount: true, status: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Clients can only see their own projects
    if (client.role === 'client' && project.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Project get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH /api/portal/projects/[id] — Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Clients can only update their own projects
    if (client.role === 'client' && existing.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, category, budget, deadline, startDate, progress, notes } = body;

    // Build update data (only include provided fields)
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category;
    if (budget !== undefined) updateData.budget = budget;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (progress !== undefined) updateData.progress = Math.min(100, Math.max(0, progress));
    if (notes !== undefined) updateData.notes = notes;

    const project = await db.project.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Notify client if status changed
    if (status && status !== existing.status) {
      await db.notification.create({
        data: {
          clientId: existing.clientId,
          title: 'Project Status Updated',
          message: `Project "${project.title}" status changed from "${existing.status}" to "${status}".`,
          type: 'info',
          category: 'project',
          link: 'projects',
        },
      });
    }

    return NextResponse.json(
      { success: true, data: project, message: 'Project updated successfully' }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Project update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/portal/projects/[id] — Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Only admin or project owner can delete
    if (client.role === 'client' && existing.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    await db.project.delete({ where: { id } });

    // Notify client
    await db.notification.create({
      data: {
        clientId: existing.clientId,
        title: 'Project Deleted',
        message: `Project "${existing.title}" has been deleted.`,
        type: 'warning',
        category: 'project',
        link: 'projects',
      },
    });

    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Project delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
