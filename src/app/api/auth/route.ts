import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession, destroySession, SESSION_COOKIE } from '@/lib/auth';

// GET /api/auth/me — Get current authenticated user
export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('Cookie');
    let token: string | null = null;
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)portal_token=([^;]*)/);
      if (match) token = match[1];
    }

    // Also check Authorization header
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

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

    // Return in format expected by frontend: data.user?.name || data.name
    return NextResponse.json({
      success: true,
      user: client,
      data: client,
    });
  } catch (error) {
    console.error('Auth me error:', error);
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

    // Also check Authorization header
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
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
