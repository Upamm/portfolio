import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;
    const c = await db.client.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, company: true, role: true, avatar: true, phone: true, address: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true,
        _count: { select: { projects: true, invoices: true, messages: true, tickets: true, notifications: true, uploads: true } },
        projects: { select: { id: true, title: true, status: true, priority: true, progress: true, createdAt: true, deadline: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        invoices: { select: { id: true, invoiceNumber: true, amount: true, tax: true, discount: true, status: true, dueDate: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        tickets: { select: { id: true, subject: true, status: true, priority: true, category: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!c) return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: c });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin client detail error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;
    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    const updated = await db.client.update({
      where: { id }, data: updateData,
      select: { id: true, name: true, email: true, company: true, role: true, avatar: true, phone: true, address: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ success: true, data: updated, message: 'Client updated successfully' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin client update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;
    const target = await db.client.findUnique({ where: { id }, select: { role: true } });
    if (!target) return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    if (target.role === 'admin') return NextResponse.json({ success: false, error: 'Cannot delete admin accounts' }, { status: 403 });
    await db.notification.deleteMany({ where: { clientId: id } });
    await db.message.deleteMany({ where: { clientId: id } });
    const tickets = await db.ticket.findMany({ where: { clientId: id }, select: { id: true } });
    for (const t of tickets) await db.ticketReply.deleteMany({ where: { ticketId: t.id } });
    await db.ticket.deleteMany({ where: { clientId: id } });
    await db.fileUpload.deleteMany({ where: { clientId: id } });
    const projects = await db.project.findMany({ where: { clientId: id }, select: { id: true } });
    for (const p of projects) await db.milestone.deleteMany({ where: { projectId: p.id } });
    await db.invoice.deleteMany({ where: { clientId: id } });
    await db.project.deleteMany({ where: { clientId: id } });
    await db.client.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Client and all associated data deleted successfully' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin client delete error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
