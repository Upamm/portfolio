import { NextRequest, NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE } from '@/lib/auth';

// DELETE /api/auth/logout — Logout (properly destroys session & clears cookie)
export async function DELETE(request: NextRequest) {
  try {
    // Extract token from cookie or Authorization header
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

    // Destroy the server-side session
    if (token) {
      destroySession(token);
    }

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the session cookie
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
