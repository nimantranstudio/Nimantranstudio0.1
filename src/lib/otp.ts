import crypto from 'crypto';

/**
 * Server-owned OTP hashing. The plaintext code is never stored — only its HMAC.
 * A 6-digit code that is short-lived, rate-limited, and attempt-capped does not
 * need bcrypt; a keyed HMAC with the session secret is sufficient and adds no
 * dependency.
 */
const SECRET =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    'nimantran-session-secret-change-me';

export function hashOtp(code: string): string {
    return crypto.createHmac('sha256', SECRET).update(code).digest('hex');
}

export function verifyOtp(code: string, hash: string): boolean {
    const expected = hashOtp(code);
    // Constant-time compare to avoid leaking via timing.
    const a = Buffer.from(expected);
    const b = Buffer.from(hash);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function generateOtp(): string {
    return String(crypto.randomInt(100000, 1000000));
}
