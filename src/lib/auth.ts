import crypto from 'crypto';
import { db } from '@/lib/db';

// ── In-Memory Session Storage ──
// Use globalThis to ensure a single shared Map instance across all Turbopack module copies
const _sessionsKey = '__portal_sessions__';
const _cleanupKey = '__portal_sessions_cleanup__';

interface SessionData {
  clientId: string;
  role: string;
  createdAt: number;
}

function getSessions(): Map<string, SessionData> {
  if (!(globalThis as Record<string, unknown>)[_sessionsKey]) {
    (globalThis as Record<string, unknown>)[_sessionsKey] = new Map<string, SessionData>();
  }
  return (globalThis as Record<string, unknown>)[_sessionsKey] as Map<string, SessionData>;
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Clean expired sessions periodically
function cleanExpiredSessions() {
  const sessions = getSessions();
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_DURATION) {
      sessions.delete(token);
    }
  }
}

// Run cleanup every 30 minutes (ensure only one interval)
if (!(globalThis as Record<string, unknown>)[_cleanupKey]) {
  (globalThis as Record<string, unknown>)[_cleanupKey] = true;
  setInterval(cleanExpiredSessions, 30 * 60 * 1000);
}

// ── Session Helpers ──
export function createSession(clientId: string, role: string): string {
  cleanExpiredSessions();
  const token = crypto.randomBytes(32).toString('hex');
  getSessions().set(token, { clientId, role, createdAt: Date.now() });
  return token;
}

export function verifySession(token: string) {
  if (!token) return null;
  const sessions = getSessions();
  const session = sessions.get(token);
  if (!session) return null;
  // Check expiry
  if (Date.now() - session.createdAt > SESSION_DURATION) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function destroySession(token: string) {
  getSessions().delete(token);
}

// ── Cookie Settings ──
export const SESSION_COOKIE = {
  name: 'portal_token',
  httpOnly: false, // frontend needs to read token from document.cookie
  secure: false, // dev environment
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
