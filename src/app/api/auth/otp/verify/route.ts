import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyOTP, getRemainingAttempts } from '@/lib/otp';
import { createSession, SESSION_COOKIE } from '@/lib/auth';
import { sendNewClientNotification } from '@/lib/email';

const SALT_ROUNDS = 12;

// POST /api/auth/otp/verify — Verify OTP and create account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Validate OTP format (4 digits)
    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code format' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpEntry = verifyOTP(email, otp);
    if (!otpEntry) {
      const remaining = getRemainingAttempts(email);
      if (remaining <= 0) {
        return NextResponse.json(
          { success: false, error: 'Too many failed attempts. Please request a new code.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: `Invalid verification code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`,
        },
        { status: 401 }
      );
    }

    // Double-check email doesn't already exist (race condition protection)
    const existingClient = await db.client.findUnique({ where: { email } });
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(otpEntry.password, SALT_ROUNDS);

    // Create client
    const client = await db.client.create({
      data: {
        name: otpEntry.name,
        email: otpEntry.email,
        company: otpEntry.company || null,
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

    // Create session token
    const token = createSession(client.id, client.role);

    // Send email notification to master admin (fire-and-forget)
    sendNewClientNotification({
      name: otpEntry.name,
      email: otpEntry.email,
      company: otpEntry.company || null,
    }).catch(() => {});

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
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
