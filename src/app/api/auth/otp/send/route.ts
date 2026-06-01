import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateOTP, storeOTP, resendOTP, removeOTP } from '@/lib/otp';
import { sendOTPToUser } from '@/lib/email';

// POST /api/auth/otp/send — Send OTP to registering user's email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, company, password, resend } = body;

    // Validate required fields
    if (!email || !password || !name) {
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

    let otp: string;

    if (resend) {
      // Resend: generate a new OTP for existing entry
      otp = resendOTP(email);
      if (!otp) {
        return NextResponse.json(
          { success: false, error: 'No pending registration found. Please register again.' },
          { status: 404 }
        );
      }
    } else {
      // New OTP
      otp = generateOTP();
      storeOTP(email, name, company || '', password, otp);
    }

    // Send OTP email
    const emailResult = await sendOTPToUser(email, name, otp);
    if (!emailResult.success) {
      removeOTP(email);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: resend ? 'New verification code sent to your email' : 'Verification code sent to your email',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
