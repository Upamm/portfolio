import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/portal/invoices/[id] — Get invoice details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true, phone: true, address: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Clients can only see their own invoices
    if (client.role === 'client' && invoice.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse items JSON
    const data = {
      ...invoice,
      items: JSON.parse(invoice.items),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Invoice get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PATCH /api/portal/invoices/[id] — Update invoice status (e.g., mark as paid)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const existing = await db.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Only admin can update invoices, or client can mark their own as paid
    const body = await request.json();
    const { status, notes } = body;

    if (client.role === 'client') {
      // Clients can only update status to 'paid'
      if (status && status !== 'paid') {
        return NextResponse.json(
          { success: false, error: 'You can only mark invoices as paid' },
          { status: 403 }
        );
      }
      if (existing.clientId !== client.id) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'paid') {
        updateData.paidAt = new Date();
      }
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const invoice = await db.invoice.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    // Notify client on status change
    if (status && status !== existing.status) {
      await db.notification.create({
        data: {
          clientId: existing.clientId,
          title: 'Invoice Status Updated',
          message: `Invoice ${existing.invoiceNumber} status changed to "${status}".`,
          type: status === 'paid' ? 'success' : 'info',
        },
      });
    }

    const data = {
      ...invoice,
      items: JSON.parse(invoice.items),
    };

    return NextResponse.json(
      { success: true, data, message: 'Invoice updated successfully' }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Invoice update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}
