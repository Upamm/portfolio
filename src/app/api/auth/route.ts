import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession, destroySession, SESSION_COOKIE } from '@/lib/auth';

const SALT_ROUNDS = 12;

// POST /api/auth/register
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
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
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
      },
    });

    // Create session
    const token = createSession(client.id, client.role);

    const response = NextResponse.json(
      { success: true, data: client, message: 'Account created successfully' },
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

// GET /api/auth/me
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('Cookie');
    let token: string | null = null;
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)portal_token=([^;]*)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { verifySession } = await import('@/lib/auth');
    const session = verifySession(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    const client = await db.client.findUnique({
      where: { id: session.clientId },
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

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/auth — login or logout based on action field
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password are required' },
          { status: 400 }
        );
      }

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

      // Create session
      const token = createSession(client.id, client.role);

      const clientData = {
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        role: client.role,
        avatar: client.avatar,
        phone: client.phone,
        address: client.address,
        isActive: client.isActive,
        lastLogin: client.lastLogin,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };

      const response = NextResponse.json(
        { success: true, data: clientData, message: 'Login successful' },
        { status: 200 }
      );

      response.cookies.set(SESSION_COOKIE.name, token, SESSION_COOKIE);
      return response;
    }

    if (action === 'logout') {
      const cookieHeader = request.headers.get('Cookie');
      let token: string | null = null;
      if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|;\s*)portal_token=([^;]*)/);
        if (match) token = match[1];
      }

      if (token) {
        destroySession(token);
      }

      const response = NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
      );

      response.cookies.set(SESSION_COOKIE.name, '', {
        ...SESSION_COOKIE,
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "login" or "logout".' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth — Logout
export async function DELETE(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('Cookie');
    let token: string | null = null;
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)portal_token=([^;]*)/);
      if (match) token = match[1];
    }

    if (token) {
      destroySession(token);
    }

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE.name, '', {
      ...SESSION_COOKIE,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
