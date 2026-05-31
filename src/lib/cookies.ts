/**
 * Cookie utility for client-side and server-side cookie management.
 * Used for persisting user preferences (theme, last page, consent).
 */

const COOKIE_OPTIONS = {
  path: '/',
  // 1 year expiry for preferences
  maxAge: 365 * 24 * 60 * 60,
  sameSite: 'Lax' as const,
};

/**
 * Set a cookie value. Only works on the client side.
 */
export function setCookie(name: string, value: string, options?: Partial<typeof COOKIE_OPTIONS>): void {
  if (typeof document === 'undefined') return;

  const opts = { ...COOKIE_OPTIONS, ...options };
  const parts: string[] = [`${name}=${encodeURIComponent(value)}`, `path=${opts.path}`];

  if (opts.maxAge !== undefined) {
    parts.push(`max-age=${opts.maxAge}`);
  }
  if (opts.sameSite) {
    parts.push(`samesite=${opts.sameSite}`);
  }

  document.cookie = parts.join('; ');
}

/**
 * Get a cookie value. Works on both client and server.
 */
export function getCookie(name: string): string | undefined {
  if (typeof document !== 'undefined') {
    // Client-side
    const cookies = document.cookie.split('; ').reduce<Record<string, string>>((acc, c) => {
      const [key, ...rest] = c.split('=');
      acc[key] = rest.join('=');
      return acc;
    }, {});
    return cookies[name] ? decodeURIComponent(cookies[name]) : undefined;
  }
  return undefined;
}

/**
 * Delete a cookie by setting max-age to 0.
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

/**
 * Check if a cookie exists.
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== undefined;
}

// Cookie names used across the app
export const COOKIES = {
  THEME: 'upam_theme',
  LAST_PAGE: 'upam_last_page',
  COOKIE_CONSENT: 'upam_cookie_consent',
} as const;
