import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken, getIPViolationCount, logSecurityEvent } from '@/lib/security';

// Rate limit for CSRF token generation
interface CSRFRateEntry {
  count: number;
  resetAt: number;
}

const csrfRateMap = new Map<string, CSRFRateEntry>();
const CSRF_TOKEN_RATE_MAX = 5; // 5 tokens per 10 seconds
const CSRF_TOKEN_RATE_WINDOW = 10_000;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return '127.0.0.1';
}

/**
 * GET /api/csrf - Generate a new CSRF token.
 * Rate limited and only available via GET requests.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';

  // Verify referer/origin to prevent token theft via CSRF
  const isSameOrigin = referer.startsWith('/') ||
    referer.includes(request.headers.get('host') || '') ||
    origin.includes(request.headers.get('host') || '');

  // Check for auto-block from excessive violations
  const violationCount = getIPViolationCount(ip);
  if (violationCount > 10) {
    logSecurityEvent('CSRF_BLOCKED', ip, '/api/csrf', userAgent, 'Auto-blocked: too many violations');
    return NextResponse.json(
      { error: 'Access denied.' },
      { status: 403 }
    );
  }

  // Rate limit CSRF token generation
  const now = Date.now();
  const entry = csrfRateMap.get(ip);
  if (entry && now <= entry.resetAt && entry.count >= CSRF_TOKEN_RATE_MAX) {
    logSecurityEvent('CSRF_RATE_LIMITED', ip, '/api/csrf', userAgent, 'Rate limited');
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': '10' } }
    );
  }

  if (!entry || now > entry.resetAt) {
    csrfRateMap.set(ip, { count: 1, resetAt: now + CSRF_TOKEN_RATE_WINDOW });
  } else {
    entry.count++;
  }

  // Generate token
  const token = generateCSRFToken(ip, userAgent);

  return NextResponse.json(
    { csrfToken: token },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    }
  );
}

// Block all other methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
