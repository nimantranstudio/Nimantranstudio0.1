/**
 * OTP security limits, in one place rather than scattered magic numbers
 * across the send/verify routes. Every value has a sane default and can be
 * tuned per-environment via env vars without a code change.
 */

function envInt(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** How long a generated OTP stays valid. */
export const OTP_EXPIRY_MINUTES = envInt('OTP_EXPIRY_MINUTES', 10);

/** Max incorrect verification attempts against a single OTP before it's rejected outright. */
export const OTP_MAX_VERIFY_ATTEMPTS = envInt('OTP_MAX_VERIFY_ATTEMPTS', 5);

/** Max OTP sends per phone number per hour. */
export const OTP_SEND_LIMIT_PER_HOUR = envInt('OTP_SEND_LIMIT_PER_HOUR', 3);

/** Max OTP sends per client IP per hour — catches one IP spamming many numbers. */
export const OTP_SEND_LIMIT_PER_IP_PER_HOUR = envInt('OTP_SEND_LIMIT_PER_IP_PER_HOUR', 15);

/** Minimum gap between consecutive sends to the same number, enforced server-side. */
export const OTP_RESEND_COOLDOWN_SECONDS = envInt('OTP_RESEND_COOLDOWN_SECONDS', 30);
