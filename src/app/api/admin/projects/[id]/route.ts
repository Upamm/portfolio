import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// PATCH /api/admin/projects/[id] — Update project status, progress, etc.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, status, priority, category, budget, deadline, startDate, progress, notes } = body;

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
        client: { select: { id: true, name: true, email: true, company: true } },
        milestones: { orderBy: { order: 'asc' } },
      },
    });

    // Notify client on status/progress change
    if (status && status !== existing.status) {
      await db.notification.create({
        data: {
          clientId: existing.clientId,
          title: 'Project Status Updated',
          message: `Project "${project.title}" status changed to "${status}".`,
          type: 'info',
          category: 'project',
          link: 'projects',
        },
      });
    } else if (progress !== undefined && progress !== existing.progress) {
      await db.notification.create({
        data: {
          clientId: existing.clientId,
          title: 'Project Progress Updated',
          message: `Project "${project.title}" is now ${progress}% complete.`,
          type: 'info',
          category: 'project',
          link: 'projects',
        },
      });
    }

    return NextResponse.json({ success: true, data: project, message: 'Project updated successfully' });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin project update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
