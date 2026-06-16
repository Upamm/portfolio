import crypto from 'crypto';
import { db } from '@/lib/db';

// ── Token Secret (persists across Turbopack hot-reloads via globalThis) ──
const _secretKey = '__portal_token_secret__';

function getTokenSecret(): string {
  if (!(globalThis as Record<string, unknown>)[_secretKey]) {
    // Generate a stable secret: use a fixed seed so it survives restarts
    // In production, this would come from an env variable
    (globalThis as Record<string, unknown>)[_secretKey] =
      process.env.PORTAL_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
  }
  return (globalThis as Record<string, unknown>)[_secretKey] as string;
}

// ── Token Types ──
interface TokenPayload {
  cid: string; // client ID
  role: string;
  iat: number; // issued at (ms)
  exp: number; // expiry (ms)
}

interface SessionData {
  clientId: string;
  role: string;
  createdAt: number;
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// ── Token Helpers (stateless, self-verifying) ──
function base64urlEncode(data: string): string {
  return Buffer.from(data, 'utf-8').toString('base64url');
}

function base64urlDecode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8');
}

function signToken(payloadB64: string): string {
  return crypto
    .createHmac('sha256', getTokenSecret())
    .update(payloadB64)
    .digest('base64url');
}

export function createSession(clientId: string, role: string): string {
  const now = Date.now();
  const payload: TokenPayload = {
    cid: clientId,
    role,
    iat: now,
    exp: now + SESSION_DURATION,
  };
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const signature = signToken(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifySession(token: string): SessionData | null {
  if (!token) return null;

  // Token format: payload.signature
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex === 0 || dotIndex === token.length - 1) return null;

  const payloadB64 = token.substring(0, dotIndex);
  const signature = token.substring(dotIndex + 1);

  // Verify signature
  const expectedSig = signToken(payloadB64);
  if (signature !== expectedSig) return null;

  // Decode and validate payload
  try {
    const payload: TokenPayload = JSON.parse(base64urlDecode(payloadB64));
    if (!payload.cid || !payload.role) return null;
    if (Date.now() > payload.exp) return null; // expired
    return {
      clientId: payload.cid,
      role: payload.role,
      createdAt: payload.iat,
    };
  } catch {
    return null;
  }
}

export function destroySession(_token: string): void {
  // Stateless tokens — cannot be individually revoked.
  // For immediate logout, the frontend clears the cookie.
  // For server-side revocation, add a blocklist in DB if needed.
}

// ── Cookie Settings ──
export const SESSION_COOKIE = {
  name: 'portal_token',
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

// ── Auth Middleware ──
export async function requireAuth(request: Request) {
  // Try Bearer token from Authorization header first
  const authHeader = request.headers.get('Authorization');
  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Fall back to cookie
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)portal_token=([^;]*)/);
      if (match) token = match[1];
    }
  }

  if (!token) {
    throw new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = verifySession(token);
  if (!session) {
    throw new Response(JSON.stringify({ success: false, error: 'Session expired or invalid' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Fetch client from DB (exclude password)
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
    throw new Response(JSON.stringify({ success: false, error: 'Client not found' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!client.isActive) {
    throw new Response(JSON.stringify({ success: false, error: 'Account is deactivated' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return { client, token, session };
}

// ── Admin Check ──
export function requireAdmin(client: { role: string }) {
  if (client.role !== 'admin') {
    throw new Response(JSON.stringify({ success: false, error: 'Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
