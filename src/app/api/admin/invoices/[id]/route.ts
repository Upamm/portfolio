import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// PATCH /api/admin/invoices/[id] — Update invoice (status, amount, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;

    const existing = await db.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status, amount, tax, discount, dueDate, notes, items } = body;

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'paid') updateData.paidAt = new Date();
    }
    if (amount !== undefined) updateData.amount = amount;
    if (tax !== undefined) updateData.tax = tax;
    if (discount !== undefined) updateData.discount = discount;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (notes !== undefined) updateData.notes = notes;
    if (items !== undefined) updateData.items = JSON.stringify(items);

    const invoice = await db.invoice.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        project: { select: { id: true, title: true } },
      },
    });

    // Notify client on status change
    if (status && status !== existing.status) {
      await db.notification.create({
        data: {
          clientId: existing.clientId,
          title: 'Invoice Updated',
          message: `Invoice ${existing.invoiceNumber} status changed to "${status}".`,
          type: status === 'paid' ? 'success' : 'info',
        },
      });
    }

    return NextResponse.json({ success: true, data: invoice, message: 'Invoice updated successfully' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin invoice update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/invoices/[id] — Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);
    const { id } = await params;

    const existing = await db.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    await db.invoice.delete({ where: { id } });

    await db.notification.create({
      data: {
        clientId: existing.clientId,
        title: 'Invoice Deleted',
        message: `Invoice ${existing.invoiceNumber} has been deleted.`,
        type: 'warning',
      },
    });

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin invoice delete error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
