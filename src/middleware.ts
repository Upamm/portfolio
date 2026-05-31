import { NextRequest, NextResponse } from 'next/server';
import { logSecurityEvent, getIPViolationCount } from '@/lib/security';

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
  // Known exploit tools
  /metasploit/i,
  /burpsuite/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /hydra/i,
  // Common malicious bots
  /mj12bot/i,
  /dotbot/i,
  // Shellshock / log4j scanners
  /\(\)\s*\{/i,
  /jndi/i,
  // Path traversal probes
  /\.\.\//i,
  // Generic bad patterns (keep these — they are almost always scanners)
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
  '/wp-includes',
  '/wp-content',
  '/xmlrpc.php',
  '/.env',
  '/.git',
  '/.svn',
  '/.htaccess',
  '/.htpasswd',
  '/phpmyadmin',
  '/admin',
  '/config',
  '/backup',
  '/shell',
  '/eval-stdin',
  '/php-cgi',
  '/cgi-bin',
  '/actuator',
  '/api/v1',
  '/graphql',
  '/console',
  '/debug',
  '/trace',
  '/server-status',
  '/server-info',
  '/elmah.axd',
  '/trace.axd',
  '/telemetry',
];

// ───────────────────────────────────────────────────────────────
// SQL Injection detection in query strings and paths
// ───────────────────────────────────────────────────────────────
const SQL_INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
  /((\%27)|(\'))union/i,
  /((\%27)|(\'))select/i,
  /((\%27)|(\'))insert/i,
  /((\%27)|(\'))update/i,
  /((\%27)|(\'))delete/i,
  /((\%27)|(\'))drop/i,
  /((\%27)|(\'))exec/i,
  /((\%27)|(\'))xp_/i,
  /;\s*(drop|alter|delete|update|insert|create|exec|execute)\s/i,
];

// ───────────────────────────────────────────────────────────────
// XSS detection in query strings
// ───────────────────────────────────────────────────────────────
const XSS_PATTERNS = [
  /<\s*script/i,
  /<\s*img[^>]+on\w+\s*=/i,
  /<\s*svg[^>]+on\w+\s*=/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /on(error|load|click|mouse\w+|focus|blur|submit|change|key\w+)\s*=/i,
  /<\s*iframe/i,
  /<\s*object/i,
  /<\s*embed/i,
  /expression\s*\(/i,
  /url\s*\(\s*javascript/i,
];

// ───────────────────────────────────────────────────────────────
// Path traversal detection
// ───────────────────────────────────────────────────────────────
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,
  /\.\.\\/,
  /\%2e\%2e[\/\\]/i,
  /\.\.%2f/i,
  /\%2e\./i,
  /\.\.%5c/i,
  /\%252e/i,
];

// ───────────────────────────────────────────────────────────────
// In-memory rate limiter for API routes (sliding window)
// ───────────────────────────────────────────────────────────────
interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 60 seconds
let lastCleanup = Date.now();
function cleanupRateLimits() {
  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    lastCleanup = now;
    for (const [key, entry] of rateLimitMap) {
      // Remove entries older than the window
      entry.timestamps = entry.timestamps.filter((t) => t > now - getRateLimitWindow());
      if (entry.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }
}

const API_RATE_LIMIT_WINDOW = 60_000; // 1 minute
const API_RATE_LIMIT_MAX = 30; // 30 requests per minute for API
const PAGE_RATE_LIMIT_WINDOW = 60_000; // 1 minute
const PAGE_RATE_LIMIT_MAX = 120; // 120 requests per minute for pages

function getRateLimitWindow(): number {
  return API_RATE_LIMIT_WINDOW;
}

function checkRateLimit(ip: string, isAPI: boolean): boolean {
  cleanupRateLimits();
  const now = Date.now();
  const window = isAPI ? API_RATE_LIMIT_WINDOW : PAGE_RATE_LIMIT_WINDOW;
  const max = isAPI ? API_RATE_LIMIT_MAX : PAGE_RATE_LIMIT_MAX;

  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(ip, entry);
  }

  // Sliding window: remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > now - window);

  if (entry.timestamps.length >= max) {
    return false;
  }

  entry.timestamps.push(now);
  return true;
}

// ───────────────────────────────────────────────────────────────
// IP auto-block list (accumulates from violations)
// ───────────────────────────────────────────────────────────────
const blockedIPs = new Map<string, { blockedAt: number; reason: string }>();
const IP_BLOCK_DURATION = 3_600_000; // 1 hour auto-block

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
// Helper to check if IP is auto-blocked
// ───────────────────────────────────────────────────────────────
function isIPBlocked(ip: string): boolean {
  const blocked = blockedIPs.get(ip);
  if (!blocked) return false;

  if (Date.now() > blocked.blockedAt + IP_BLOCK_DURATION) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
}

// ───────────────────────────────────────────────────────────────
// Helper to block an IP
// ───────────────────────────────────────────────────────────────
function blockIP(ip: string, reason: string): void {
  blockedIPs.set(ip, { blockedAt: Date.now(), reason });
  logSecurityEvent('IP_BLOCKED', ip, '*', '*', reason);
}

// ───────────────────────────────────────────────────────────────
// Middleware
// ───────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const ip = getClientIP(request);
  const ua = request.headers.get('user-agent') || '';
  const method = request.method;

  // 0. Check IP auto-block list
  if (isIPBlocked(ip)) {
    return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
  }

  // 1. Block suspicious user-agents
  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (pattern.test(ua)) {
      logSecurityEvent('BLOCKED_UA', ip, pathname, ua, `Pattern: ${pattern.source}`);
      return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
    }
  }

  // 2. Block dangerous paths (case-insensitive)
  const lowerPath = pathname.toLowerCase();
  for (const blockedPath of BLOCKED_PATHS) {
    if (lowerPath.startsWith(blockedPath) || lowerPath.includes(blockedPath)) {
      logSecurityEvent('BLOCKED_PATH', ip, pathname, ua, `Matched: ${blockedPath}`);
      return new NextResponse(null, { status: 404, statusText: 'Not Found' });
    }
  }

  // 3. Block non-standard HTTP methods
  const allowedMethods = ['GET', 'POST', 'HEAD', 'OPTIONS'];
  if (!allowedMethods.includes(method.toUpperCase())) {
    logSecurityEvent('BLOCKED_METHOD', ip, pathname, ua, `Method: ${method}`);
    return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
  }

  // 4. Check for SQL injection in path and query string
  const fullURL = pathname + search;
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(fullURL)) {
      logSecurityEvent('SQL_INJECTION', ip, pathname, ua, `Detected in URL`);
      const violations = getIPViolationCount(ip);
      if (violations > 5) {
        blockIP(ip, 'Excessive SQL injection attempts');
      }
      return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
    }
  }

  // 5. Check for XSS in query string
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(search)) {
      logSecurityEvent('XSS_ATTEMPT', ip, pathname, ua, `Detected in query: ${search.slice(0, 100)}`);
      const violations = getIPViolationCount(ip);
      if (violations > 5) {
        blockIP(ip, 'Excessive XSS attempts');
      }
      return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
    }
  }

  // 6. Check for path traversal
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(pathname)) {
      logSecurityEvent('PATH_TRAVERSAL', ip, pathname, ua, `Detected in path`);
      blockIP(ip, 'Path traversal attempt');
      return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
    }
  }

  // 7. Rate limit API routes
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip, true)) {
      logSecurityEvent('API_RATE_LIMITED', ip, pathname, ua);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  } else {
    // Rate limit page requests (more generous)
    if (!checkRateLimit(ip, false)) {
      logSecurityEvent('PAGE_RATE_LIMITED', ip, pathname, ua);
      return NextResponse.json(
        { error: 'Too many requests.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // 8. Block requests with suspicious headers
  // NOTE: x-forwarded-host is set by the gateway/proxy — do NOT block it
  const suspiciousHeaders = [
    'x-original-url',
    'x-rewrite-url',
  ];
  for (const header of suspiciousHeaders) {
    if (request.headers.get(header)) {
      logSecurityEvent('SUSPICIOUS_HEADER', ip, pathname, ua, `Header: ${header}`);
      return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
    }
  }

  // 9. Validate Content-Length for POST requests (prevent oversized payloads)
  if (method === 'POST') {
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const length = parseInt(contentLength, 10);
      // Max 1MB for API requests
      if (length > 1_048_576) {
        logSecurityEvent('OVERSIZED_PAYLOAD', ip, pathname, ua, `Size: ${length}`);
        return NextResponse.json(
          { error: 'Payload too large.' },
          { status: 413 }
        );
      }
    }
  }

  // 10. Add security headers to response
  const response = NextResponse.next();

  // Remove server identification
  response.headers.delete('x-powered-by');

  // Add unique request ID for debugging
  response.headers.set('X-Request-ID', crypto.randomUUID().slice(0, 12));

  // Add CORS headers (strict: same-origin only for API)
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Vary', 'Origin');

    // Handle preflight
    if (method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || '',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
  }

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking (allow embedding from same origin for preview)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    // Match all paths except _next/static, _next/image, and public files
    '/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|robots.txt|sitemap.xml).*)',
  ],
};
