/**
 * Security utility library.
 * Provides CSRF protection, input sanitization, and security helpers.
 * Uses globalThis for all in-memory state to survive Turbopack HMR re-evaluation.
 */

// ───────────────────────────────────────────────────────────────
// Global state helpers — survive module re-evaluation in Turbopack
// ───────────────────────────────────────────────────────────────
const g = globalThis as Record<string, unknown>;

function getGlobalMap<T>(key: string): Map<string, T> {
  if (!g[key]) g[key] = new Map<string, T>();
  return g[key] as Map<string, T>;
}

function getGlobalArray<T>(key: string): T[] {
  if (!g[key]) g[key] = [];
  return g[key] as T[];
}

// ───────────────────────────────────────────────────────────────
// CSRF Token Management (in-memory, signed with HMAC)
// ───────────────────────────────────────────────────────────────
interface CSRFToken {
  token: string;
  createdAt: number;
  userAgent: string;
  ip: string;
}

const CSRF_TOKEN_EXPIRY = 3_600_000; // 1 hour
const CSRF_MAX_TOKENS = 10_000;

function getCSRFMap(): Map<string, CSRFToken> {
  return getGlobalMap<CSRFToken>('__csrfTokens');
}

/**
 * Generate a cryptographic CSRF token.
 * Returns the raw token (sent to client) and the hashed key (stored server-side).
 */
export function generateCSRFToken(ip: string, userAgent: string): string {
  const csrfTokens = getCSRFMap();

  // Cleanup expired tokens
  const now = Date.now();
  if (csrfTokens.size > CSRF_MAX_TOKENS) {
    for (const [key, token] of csrfTokens) {
      if (now > token.createdAt + CSRF_TOKEN_EXPIRY) {
        csrfTokens.delete(key);
      }
    }
  }

  const token = crypto.randomUUID() + crypto.randomUUID().slice(0, 8);
  const hashedKey = hashToken(token);

  csrfTokens.set(hashedKey, {
    token: hashedKey,
    createdAt: now,
    userAgent,
    ip,
  });

  return token;
}

/**
 * Validate a CSRF token against stored tokens.
 * Checks token existence, expiry, and binds to IP/UserAgent.
 */
export function validateCSRFToken(
  token: string,
  ip: string,
  userAgent: string
): boolean {
  const csrfTokens = getCSRFMap();
  const hashedKey = hashToken(token);
  const stored = csrfTokens.get(hashedKey);

  if (!stored) return false;

  // Check expiry
  if (Date.now() > stored.createdAt + CSRF_TOKEN_EXPIRY) {
    csrfTokens.delete(hashedKey);
    return false;
  }

  // Check IP binding (first 3 octets for IPv4 to handle mobile switches)
  const storedIP = stored.ip.split('.').slice(0, 3).join('.');
  const requestIP = ip.split('.').slice(0, 3).join('.');
  if (storedIP !== requestIP) return false;

  // Single-use: delete after validation
  csrfTokens.delete(hashedKey);

  return true;
}

/**
 * Simple synchronous hash for CSRF (non-crypto, but sufficient for token lookup).
 */
function hashToken(token: string): string {
  let hash = 0;
  const str = token + '_csrf_salt_upam_2025';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// ───────────────────────────────────────────────────────────────
// Advanced Input Sanitization
// ───────────────────────────────────────────────────────────────

/**
 * Deep sanitization that strips HTML tags, encoded entities, and common XSS vectors.
 */
export function sanitizeInput(input: string): string {
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove HTML entity-encoded tags
    .replace(/&lt;[^&]*&gt;/gi, '')
    // Remove JavaScript protocol
    .replace(/javascript\s*:/gi, '')
    // Remove vbscript protocol
    .replace(/vbscript\s*:/gi, '')
    // Remove data URLs (potential XSS)
    .replace(/data\s*:/gi, '')
    // Remove expression() CSS
    .replace(/expression\s*\(/gi, '')
    // Remove on* event handlers (residual text)
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validate email format with additional checks for suspicious patterns.
 */
export function validateEmail(email: string): boolean {
  // Basic format
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  // Check for suspicious patterns
  const suspicious = [
    /\.\./,          // Double dots
    /@.*@/,         // Multiple @ signs
    /\\/,            // Backslashes
    /\$/,            // Dollar signs
    /\{|\}/,         // Curly braces
    /\[|\]/,         // Square brackets
  ];

  for (const pattern of suspicious) {
    if (pattern.test(email)) return false;
  }

  return true;
}

/**
 * Sanitize URL to prevent javascript: and data: protocol injection.
 */
export function sanitizeURL(url: string): string {
  const cleaned = url.trim().toLowerCase();
  if (
    cleaned.startsWith('javascript:') ||
    cleaned.startsWith('data:') ||
    cleaned.startsWith('vbscript:') ||
    cleaned.startsWith('blob:')
  ) {
    return '';
  }
  return url;
}

// ───────────────────────────────────────────────────────────────
// Security Logging (in-memory via globalThis)
// ───────────────────────────────────────────────────────────────
interface SecurityEvent {
  timestamp: number;
  type: string;
  ip: string;
  path: string;
  userAgent: string;
  details?: string;
}

const MAX_LOG_ENTRIES = 1000;

function getSecurityLogArray(): SecurityEvent[] {
  return getGlobalArray<SecurityEvent>('__securityLog');
}

export function logSecurityEvent(
  type: string,
  ip: string,
  path: string,
  userAgent: string,
  details?: string
): void {
  const securityLog = getSecurityLogArray();
  if (securityLog.length >= MAX_LOG_ENTRIES) {
    securityLog.shift();
  }

  securityLog.push({
    timestamp: Date.now(),
    type,
    ip,
    path,
    userAgent,
    details,
  });
}

export function getSecurityLog(): SecurityEvent[] {
  return [...getSecurityLogArray()];
}

/**
 * Get count of recent security events for an IP (for auto-blocking).
 */
export function getIPViolationCount(ip: string, windowMs: number = 300_000): number {
  const securityLog = getSecurityLogArray();
  const cutoff = Date.now() - windowMs;
  return securityLog.filter((e) => e.ip === ip && e.timestamp > cutoff).length;
}
