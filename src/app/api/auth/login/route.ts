import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
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

    // Find client by email
    const client = await db.client.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!client.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated. Contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const bcrypt = await import('bcryptjs');
    const isMatch = await bcrypt.default.compare(password, client.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await db.client.update({
      where: { id: client.id },
      data: { lastLogin: new Date() },
    });

    // Create session token
    const token = createSession(client.id, client.role);

    const userData = {
      id: client.id,
      name: client.name,
      email: client.email,
      company: client.company,
      role: client.role,
      avatar: client.avatar,
      phone: client.phone,
      address: client.address,
      isActive: client.isActive,
      lastLogin: new Date().toISOString(),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: userData,
        message: 'Login successful',
      },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE.name, token, SESSION_COOKIE);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
