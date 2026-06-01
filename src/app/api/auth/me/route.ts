import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/auth/me — Get current authenticated user
export async function GET(request: NextRequest) {
  try {
    // Try Bearer token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fall back to cookie
    if (!token) {
      const cookieHeader = request.headers.get('Cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|;\s*)portal_token=([^;]*)/);
        if (match) token = match[1];
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
