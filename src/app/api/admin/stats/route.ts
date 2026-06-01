import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const [
      totalClients, activeClients, totalProjects, activeProjects, completedProjects,
      totalInvoices, pendingInvoices, paidInvoices, totalRevenue,
      totalBudget,
      openTickets, resolvedTickets, totalMessages, unreadMessages,
    ] = await Promise.all([
      db.client.count({ where: { role: 'client' } }),
      db.client.count({ where: { role: 'client', isActive: true } }),
      db.project.count(),
      db.project.count({ where: { status: 'in-progress' } }),
      db.project.count({ where: { status: 'completed' } }),
      db.invoice.count(),
      db.invoice.count({ where: { status: 'pending' } }),
      db.invoice.count({ where: { status: 'paid' } }),
      db.invoice.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
      db.project.aggregate({ _sum: { budget: true } }),
      db.ticket.count({ where: { status: 'open' } }),
      db.ticket.count({ where: { status: 'resolved' } }),
      db.message.count(),
      db.message.count({ where: { isRead: false } }),
    ]);
    const recentClients = await db.client.findMany({
      where: { role: 'client' },
      select: {
        id: true, name: true, email: true, company: true, isActive: true, lastLogin: true, createdAt: true,
        _count: { select: { projects: true, invoices: true, messages: true, tickets: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    const recentTickets = await db.ticket.findMany({
      select: { id: true, subject: true, status: true, priority: true, category: true, createdAt: true, client: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return NextResponse.json({
      success: true,
      data: {
        overview: { totalClients, activeClients, totalProjects, activeProjects, completedProjects, totalInvoices, pendingInvoices, paidInvoices, totalRevenue: totalRevenue._sum.amount || 0, totalBudget: totalBudget._sum.budget || 0, openTickets, resolvedTickets, totalMessages, unreadMessages },
        recentClients,
        recentTickets,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
