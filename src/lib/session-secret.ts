/**
 * Resolves the secret used to sign both the session cookie (session.ts) and
 * OTP hashes (otp.ts) — previously each file duplicated its own fallback
 * chain independently. Centralized here so there's exactly one place that
 * decides what happens when SESSION_SECRET isn't set.
 *
 * On any DEPLOYED environment this throws rather than falling back: the
 * fallback below is a publicly-known string living in the repo, so running
 * with it means every session cookie and OTP hash on the site is forgeable by
 * anyone who has read this file — a silent, total authentication bypass. An
 * app that refuses to boot is a visible, fixable incident; an app quietly
 * accepting forged admin sessions is not. Local development still gets the
 * fallback so nothing needs configuring just to run the dev server.
 */
const FALLBACK_SECRET = 'nimantran-session-secret-change-me';

/** True on Vercel runtime (any env) — anywhere real users reach. */
function isDeployedEnvironment(): boolean {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return false;
    }
    return Boolean(process.env.VERCEL_ENV);
}

let warned = false;

export function resolveSessionSecret(): string {
    const secret = process.env.SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
    if (secret) return secret;

    if (isDeployedEnvironment()) {
        throw new Error(
            '[SECURITY] SESSION_SECRET is not set in a deployed environment. Refusing to sign ' +
            'sessions with the publicly-known development fallback — every session and OTP ' +
            'signature would be forgeable. Set SESSION_SECRET (a long random string) in the ' +
            'environment configuration.'
        );
    }

    if (!warned) {
        warned = true;
        // eslint-disable-next-line no-console
        console.error(
            '[SECURITY] SESSION_SECRET is not set — falling back to a publicly-known ' +
            'development default. Allowed locally only; a deployed environment without ' +
            'SESSION_SECRET will refuse to start.'
        );
    }
    return FALLBACK_SECRET;
}

const ADMIN_FALLBACK_SECRET = 'nimantran-admin-secret-change-me';
let adminWarned = false;

/**
 * Same guarantee for the legacy admin cookie (admin-session.ts). Kept on
 * ADMIN_SESSION_SECRET rather than folded into the resolver above so that
 * already-issued admin cookies keep verifying — switching which secret signs
 * them would silently log every admin out.
 */
export function resolveAdminSessionSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET;
    if (secret) return secret;

    if (isDeployedEnvironment()) {
        throw new Error(
            '[SECURITY] ADMIN_SESSION_SECRET is not set in a deployed environment. Refusing to ' +
            'sign admin sessions with the publicly-known development fallback — anyone could ' +
            'forge an admin cookie. Set ADMIN_SESSION_SECRET in the environment configuration.'
        );
    }

    if (!adminWarned) {
        adminWarned = true;
        // eslint-disable-next-line no-console
        console.error(
            '[SECURITY] ADMIN_SESSION_SECRET is not set — using the publicly-known development ' +
            'default. Allowed locally only.'
        );
    }
    return ADMIN_FALLBACK_SECRET;
}
