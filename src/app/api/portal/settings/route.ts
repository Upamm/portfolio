import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/portal/settings — Get client profile
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);

    return NextResponse.json({
      success: true,
      profile: {
        name: client.name,
        email: client.email,
        company: client.company || '',
        phone: client.phone || '',
        address: client.address || '',
        avatar: client.avatar || '',
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Settings get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/portal/settings — Update client profile
export async function PUT(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const body = await request.json();
    const { profile, notifications } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (profile) {
      if (profile.name !== undefined) updateData.name = profile.name;
      if (profile.company !== undefined) updateData.company = profile.company;
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.address !== undefined) updateData.address = profile.address;
      if (profile.avatar !== undefined) updateData.avatar = profile.avatar;
    }

    const updated = await db.client.update({
      where: { id: client.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        avatar: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json({
      success: true,
      profile: updated,
      notifications: notifications || null,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
