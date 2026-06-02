import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/auth/me — Get current authenticated user
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);

    // Return in format expected by frontend: data.user?.name || data.name
    return NextResponse.json({
      success: true,
      user: client,
      data: client,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
