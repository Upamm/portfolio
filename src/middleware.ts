import { NextRequest, NextResponse } from 'next/server';

// ───────────────────────────────────────────────────────────────
// Blocklist of known malicious / scanning user-agents
// ───────────────────────────────────────────────────────────────
const BLOCKED_UA_PATTERNS = [
  // SQL injection scanners
  /sqlmap/i,
  // XSS scanners
  /nikto/i,
  /acunetix/i,
  /nessus/i,
  /openvas/i,
  /nmap/i,
  // Botnet scanners
  /masscan/i,
  /zgrab/i,
  /go-http-client/i,
  // Known exploit tools
  /metasploit/i,
  /burpsuite/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /hydra/i,
  // Common malicious bots
  /mj12bot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /dotbot/i,
  /blexbot/i,
  // Shellshock / log4j scanners
  /\(\)\s*\{/i,
  /jndi/i,
  /\$\{.*\}/i,
  // Path traversal probes
  /\.\.\//i,
  // Generic bad patterns
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /libwww/i,
  /httpclient/i,
];

// ───────────────────────────────────────────────────────────────
// Blocked paths (admin panels, config files, common exploits)
// ───────────────────────────────────────────────────────────────
const BLOCKED_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/wp-config',
  '/xmlrpc.php',
  '/.env',
  '/.git',
  '/.svn',
  '/.htaccess',
  '/.htpasswd',
  '/wp-includes',
  '/wp-content',
  '/phpmyadmin',
  '/admin',
  '/config',
  '/backup',
  '/shell',
  '/eval-stdin',
  '/php-cgi',
  '/cgi-bin',
  '/.well-known/security.txt', // We handle this ourselves
  '/actuator',
  '/api/v1',
  '/graphql',
];

// ───────────────────────────────────────────────────────────────
// In-memory rate limiter for API routes
// ───────────────────────────────────────────────────────────────
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 60 seconds
let lastCleanup = Date.now();
function cleanupRateLimits() {
  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    lastCleanup = now;
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
  }
}

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute for API

function checkRateLimit(ip: string): boolean {
  cleanupRateLimits();
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// ───────────────────────────────────────────────────────────────
// Helper to get client IP from request
// ───────────────────────────────────────────────────────────────
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return '127.0.0.1';
}

// ───────────────────────────────────────────────────────────────
// Middleware
// ───────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  const ua = request.headers.get('user-agent') || '';
  const method = request.method;

  // 1. Block suspicious user-agents
  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (pattern.test(ua)) {
      return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
    }
  }

  // 2. Block dangerous paths (case-insensitive)
  const lowerPath = pathname.toLowerCase();
  for (const blockedPath of BLOCKED_PATHS) {
    if (lowerPath.startsWith(blockedPath) || lowerPath.includes(blockedPath)) {
      return new NextResponse(null, { status: 404, statusText: 'Not Found' });
    }
  }

  // 3. Block non-standard HTTP methods
  const allowedMethods = ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(method.toUpperCase())) {
    return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
  }

  // 4. Rate limit API routes
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // 5. Add security headers to response
  const response = NextResponse.next();

  // Remove server identification
  response.headers.delete('x-powered-by');

  // Add nonce for CSP (not used yet, but ready)
  response.headers.set('X-Request-ID', crypto.randomUUID().slice(0, 8));

  return response;
}

export const config = {
  matcher: [
    // Match all paths except _next/static, _next/image, and public files
    '/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|robots.txt|sitemap.xml).*)',
  ],
};
