import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

// ───────────────────────────────────────────────────────────────
// Zod Validation Schema
// ───────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name cannot exceed 100 characters.')
    .trim(),
  email: z
    .string()
    .email('Please provide a valid email address.')
    .max(200, 'Email cannot exceed 200 characters.')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters.')
    .max(200, 'Subject cannot exceed 200 characters.')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(5000, 'Message cannot exceed 5000 characters.')
    .trim(),
  // Honeypot field — must be empty (bots fill it in)
  website: z
    .string()
    .max(0, 'Bot detected.')
    .optional()
    .default(''),
});

type ContactInput = z.infer<typeof contactSchema>;

// ───────────────────────────────────────────────────────────────
// In-memory rate limiter for contact form specifically
// ───────────────────────────────────────────────────────────────
interface ContactRateEntry {
  count: number;
  resetAt: number;
}

const contactRateMap = new Map<string, ContactRateEntry>();

function cleanupEntries() {
  const now = Date.now();
  for (const [key, entry] of contactRateMap) {
    if (now > entry.resetAt) contactRateMap.delete(key);
  }
}

const CONTACT_WINDOW = 60_000; // 1 minute
const CONTACT_MAX = 3; // 3 submissions per minute per IP
const CONTACT_DAILY_MAX = 10; // 10 submissions per day per IP

const contactDailyMap = new Map<string, { count: number; resetAt: number }>();

function checkContactRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();

  // Cleanup old entries periodically
  if (Math.random() < 0.1) {
    cleanupEntries();
    for (const [key, entry] of contactDailyMap) {
      if (now > entry.resetAt) contactDailyMap.delete(key);
    }
  }

  // Check daily limit
  const daily = contactDailyMap.get(ip);
  if (daily && now <= daily.resetAt) {
    if (daily.count >= CONTACT_DAILY_MAX) {
      return { allowed: false, reason: 'Daily limit reached. Please try again tomorrow.' };
    }
  }

  // Check per-minute limit
  const entry = contactRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    contactRateMap.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW });
    // Initialize or continue daily counter
    if (!daily || now > daily.resetAt) {
      contactDailyMap.set(ip, { count: 1, resetAt: now + 86_400_000 });
    } else {
      daily.count++;
    }
    return { allowed: true };
  }

  if (entry.count >= CONTACT_MAX) {
    return { allowed: false, reason: 'Too many messages. Please wait a minute before trying again.' };
  }

  entry.count++;
  // Increment daily counter
  const existingDaily = contactDailyMap.get(ip);
  if (existingDaily && now <= existingDaily.resetAt) {
    existingDaily.count++;
  }

  return { allowed: true };
}

// ───────────────────────────────────────────────────────────────
// Helper to get client IP
// ───────────────────────────────────────────────────────────────
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return 'unknown';
}

// ───────────────────────────────────────────────────────────────
// Helper to sanitize input (strip HTML tags)
// ───────────────────────────────────────────────────────────────
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

// ───────────────────────────────────────────────────────────────
// POST handler
// ───────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Rate limiting
    const rateCheck = checkContactRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.reason || 'Rate limit exceeded.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    // Honeypot check — if "website" field has any value, it's a bot
    if (body.website && (body.website as string).length > 0) {
      // Silently accept (don't tell bots we caught them)
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully!',
      });
    }

    // Check Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Invalid content type.' },
        { status: 415 }
      );
    }

    // Validate with Zod
    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0];
      return NextResponse.json(
        { success: false, error: firstError?.message || 'Validation failed.' },
        { status: 400 }
      );
    }

    const data: ContactInput = parseResult.data;

    // Sanitize all text fields
    const sanitizedData = {
      name: sanitize(data.name),
      email: sanitize(data.email),
      subject: sanitize(data.subject),
      message: sanitize(data.message),
    };

    // Store message in database with IP
    await db.contactMessage.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    // Don't leak error details
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Only allow POST — reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  );
}
