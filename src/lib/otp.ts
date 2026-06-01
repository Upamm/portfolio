// ── In-Memory OTP Storage ──
// Stores pending registration data + OTP for verification

interface OTPEntry {
  otp: string;
  email: string;
  name: string;
  company: string;
  password: string;
  createdAt: number;
  attempts: number;
}

const _otpKey = '__otp_store__';
const _otpCleanupKey = '__otp_cleanup__';
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function getOTPStore(): Map<string, OTPEntry> {
  if (!(globalThis as Record<string, unknown>)[_otpKey]) {
    (globalThis as Record<string, unknown>)[_otpKey] = new Map<string, OTPEntry>();
  }
  return (globalThis as Record<string, unknown>)[_otpKey] as Map<string, OTPEntry>;
}

// Clean expired OTPs periodically
function cleanExpiredOTPs() {
  const store = getOTPStore();
  const now = Date.now();
  for (const [email, entry] of store.entries()) {
    if (now - entry.createdAt > OTP_EXPIRY || entry.attempts >= MAX_ATTEMPTS) {
      store.delete(email);
    }
  }
}

// Run cleanup every 2 minutes
if (!(globalThis as Record<string, unknown>)[_otpCleanupKey]) {
  (globalThis as Record<string, unknown>)[_otpCleanupKey] = true;
  setInterval(cleanExpiredOTPs, 2 * 60 * 1000);
}

export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}

export function storeOTP(email: string, name: string, company: string, password: string, otp: string) {
  cleanExpiredOTPs();
  getOTPStore().set(email, {
    otp,
    email,
    name,
    company,
    password,
    createdAt: Date.now(),
    attempts: 0,
  });
}

export function verifyOTP(email: string, code: string): OTPEntry | null {
  cleanExpiredOTPs();
  const store = getOTPStore();
  const entry = store.get(email);

  if (!entry) {
    return null; // No OTP found
  }

  // Check expiry
  if (Date.now() - entry.createdAt > OTP_EXPIRY) {
    store.delete(email);
    return null;
  }

  // Check attempts
  entry.attempts++;
  if (entry.attempts > MAX_ATTEMPTS) {
    store.delete(email);
    return null;
  }

  // Check code
  if (entry.otp !== code) {
    // Don't delete on wrong code, let them retry (up to MAX_ATTEMPTS)
    return null;
  }

  // Correct OTP — return and remove
  store.delete(email);
  return entry;
}

export function getRemainingAttempts(email: string): number {
  const store = getOTPStore();
  const entry = store.get(email);
  if (!entry) return 0;
  return Math.max(0, MAX_ATTEMPTS - entry.attempts);
}

export function getOTPEntry(email: string): OTPEntry | null {
  const store = getOTPStore();
  return store.get(email) || null;
}

export function removeOTP(email: string) {
  getOTPStore().delete(email);
}

export function resendOTP(email: string): string | null {
  const store = getOTPStore();
  const entry = store.get(email);
  if (!entry) return null;

  // Check if not expired and has attempts left
  if (Date.now() - entry.createdAt > OTP_EXPIRY) {
    store.delete(email);
    return null;
  }

  const newOTP = generateOTP();
  entry.otp = newOTP;
  entry.createdAt = Date.now(); // Reset timer
  entry.attempts = 0; // Reset attempts
  store.set(email, entry);
  return newOTP;
}
