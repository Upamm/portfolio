import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/portal/profile — Get client profile
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);

    // Return profile with some stats
    const [projectCount, activeTickets, unreadMessages, unpaidInvoices] = await Promise.all([
      db.project.count({ where: { clientId: client.id } }),
      db.ticket.count({ where: { clientId: client.id, status: { in: ['open', 'in-progress'] } } }),
      db.message.count({ where: { clientId: client.id, isRead: false, senderRole: 'admin' } }),
      db.invoice.count({ where: { clientId: client.id, status: 'pending' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...client,
        stats: {
          projectCount,
          activeTickets,
          unreadMessages,
          unpaidInvoices,
        },
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Profile get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH /api/portal/profile — Update profile
export async function PATCH(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const body = await request.json();
    const { name, company, phone, address, avatar } = body;

    // Build update data (only include provided fields)
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updated = await db.client.update({
      where: { id: client.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { success: true, data: updated, message: 'Profile updated successfully' }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
