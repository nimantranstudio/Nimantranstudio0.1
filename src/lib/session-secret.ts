/**
 * Resolves the secret used to sign both the session cookie (session.ts) and
 * OTP hashes (otp.ts) — previously each file duplicated its own fallback
 * chain independently. Centralized here so there's exactly one place that
 * decides what happens when SESSION_SECRET isn't set.
 *
 * Deliberately does not throw when missing: this codebase's NODE_ENV can't be
 * verified from here to reliably reflect the real production deployment, and
 * a hard crash on a misconfigured secret would take down every session-
 * checking route (including this app's own kill switch) with no fallback.
 * Instead it fails loud — a wrong secret is a live incident either way, so the
 * priority is making sure it's impossible to miss in logs, not making the app
 * unreachable if it happens to slip through configuration in production.
 */
const FALLBACK_SECRET = 'nimantran-session-secret-change-me';

let warned = false;

export function resolveSessionSecret(): string {
    const secret = process.env.SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
    if (secret) return secret;

    if (!warned) {
        warned = true;
        // eslint-disable-next-line no-console
        console.error(
            '[SECURITY] SESSION_SECRET is not set — falling back to a publicly-known ' +
            'development default. Every session/OTP signature is forgeable with this ' +
            'secret. Set SESSION_SECRET (a long random string) before deploying to production.'
        );
    }
    return FALLBACK_SECRET;
}
