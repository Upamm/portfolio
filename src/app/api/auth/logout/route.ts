import { NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE } from '@/lib/auth';

// DELETE /api/auth/logout — Logout
export async function DELETE() {
  try {
    // The token is cleared client-side by document.cookie
    // This endpoint is for any server-side cleanup needed
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
