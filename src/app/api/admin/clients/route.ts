import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

// POST /api/admin/clients — Admin creates a new client account
export async function POST(request: NextRequest) {
  try {
    const { client: admin } = await requireAuth(request);
    requireAdmin(admin);

    const body = await request.json();
    const { name, email, password, company, phone, address } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existing = await db.client.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 12);

    const newClient = await db.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company: company || null,
        phone: phone || null,
        address: address || null,
      },
      select: {
        id: true, name: true, email: true, company: true, role: true, avatar: true,
        phone: true, address: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true,
      },
    });

    // Welcome notification
    await db.notification.create({
      data: {
        clientId: newClient.id,
        title: 'Welcome to the Client Portal!',
        message: 'Your account has been created by the admin. You can now log in and explore your dashboard.',
        type: 'success',
      },
    });

    return NextResponse.json(
      { success: true, data: newClient, message: 'Client account created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin create client error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    requireAdmin(client);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const where: Record<string, unknown> = {};
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { company: { contains: search } }];
    const [clients, total] = await Promise.all([
      db.client.findMany({
        where,
        select: { id: true, name: true, email: true, company: true, role: true, avatar: true, phone: true, address: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true, _count: { select: { projects: true, invoices: true, messages: true, tickets: true, notifications: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.client.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: clients, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Admin clients list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
