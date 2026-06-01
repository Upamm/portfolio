import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, SESSION_COOKIE } from '@/lib/auth';
import { sendNewClientNotification } from '@/lib/email';

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingClient = await db.client.findUnique({ where: { email } });
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, SALT_ROUNDS);

    // Create client
    const client = await db.client.create({
      data: {
        name,
        email,
        company: company || null,
        password: hashedPassword,
      },
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

    // Create welcome notification
    await db.notification.create({
      data: {
        clientId: client.id,
        title: 'Welcome to the Client Portal!',
        message: 'Your account has been created successfully. Explore your dashboard to get started.',
        type: 'success',
        category: 'general',
        link: 'dashboard',
      },
    });

    // Create session token
    const token = createSession(client.id, client.role);

    // Send email notification to master admin (fire-and-forget)
    sendNewClientNotification({ name, email, company: company || null }).catch(() => {});

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: client,
        message: 'Account created successfully',
      },
      { status: 201 }
    );

    response.cookies.set(SESSION_COOKIE.name, token, SESSION_COOKIE);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
