import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/portal/invoices — List invoices for authenticated client
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

    const invoices = await db.invoice.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Invoices list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/portal/invoices — Create invoice (admin only)
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);

    const body = await request.json();
    const {
      clientId,
      projectId,
      amount,
      tax,
      discount,
      status,
      dueDate,
      items,
      notes,
    } = body;

    if (!clientId || !amount || !dueDate) {
      return NextResponse.json(
        { success: false, error: 'ClientId, amount, and dueDate are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const targetClient = await db.client.findUnique({ where: { id: clientId } });
    if (!targetClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Verify project exists if projectId provided
    if (projectId) {
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }
    }

    // Generate invoice number (INV-YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const invoiceNumber = `INV-${dateStr}-${random}`;

    // Ensure invoice number is unique
    let unique = false;
    let finalInvoiceNumber = invoiceNumber;
    while (!unique) {
      const exists = await db.invoice.findUnique({ where: { invoiceNumber: finalInvoiceNumber } });
      if (!exists) {
        unique = true;
      } else {
        const newRandom = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        finalInvoiceNumber = `INV-${dateStr}-${newRandom}`;
      }
    }

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber: finalInvoiceNumber,
        clientId,
        projectId: projectId || null,
        amount,
        tax: tax ?? 0,
        discount: discount ?? 0,
        status: status || 'pending',
        dueDate: new Date(dueDate),
        paidAt: status === 'paid' ? new Date() : null,
        items: items ? JSON.stringify(items) : '[]',
        notes: notes || '',
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    // Notify client
    await db.notification.create({
      data: {
        clientId,
        title: 'New Invoice',
        message: `Invoice ${finalInvoiceNumber} for $${amount} has been created. Due: ${new Date(dueDate).toLocaleDateString()}.`,
        type: 'info',
      },
    });

    return NextResponse.json(
      { success: true, data: invoice, message: 'Invoice created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Invoice create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
