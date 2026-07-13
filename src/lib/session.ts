/**
 * Universal signed session token (HMAC-SHA256), for all authenticated users.
 *
 * Uses Web Crypto so the same code verifies in Node API routes and Edge
 * middleware. The token lives in an HttpOnly cookie set at payment success or
 * OTP verification, and is checked server-side on every protected request — the
 * client cannot forge it. This generalizes the older admin-only session; the
 * admin is just a session whose `role` claim is "admin".
 */

const SECRET =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    'nimantran-session-secret-change-me';

const encoder = new TextEncoder();

export const SESSION_COOKIE = 'ns_session';
const DEFAULT_DAYS = 30;

export interface SessionPayload {
    uid: string;
    mobile: string;
    role: string;
    exp: number;
}

function bytesToB64url(bytes: Uint8Array): string {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(s: string): Uint8Array {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

async function getKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        encoder.encode(SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

export async function createSessionToken(
    user: { id: string; mobileNumber: string; role: string },
    days = DEFAULT_DAYS
): Promise<string> {
    const payload: SessionPayload = {
        uid: user.id,
        mobile: user.mobileNumber,
        role: user.role,
        exp: Date.now() + days * 86400000,
    };
    const payloadB64 = bytesToB64url(encoder.encode(JSON.stringify(payload)));
    const key = await getKey();
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
    return `${payloadB64}.${bytesToB64url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(
    token?: string | null
): Promise<SessionPayload | null> {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;
    try {
        const key = await getKey();
        const valid = await crypto.subtle.verify(
            'HMAC',
            key,
            b64urlToBytes(sigB64) as unknown as BufferSource,
            encoder.encode(payloadB64) as unknown as BufferSource
        );
        if (!valid) return null;
        const payload = JSON.parse(
            new TextDecoder().decode(b64urlToBytes(payloadB64))
        ) as SessionPayload;
        if (
            typeof payload.uid === 'string' &&
            typeof payload.exp === 'number' &&
            payload.exp > Date.now()
        ) {
            return payload;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Cookie options for the session. HttpOnly so JS can't read it; Secure in
 * production; Lax so it rides top-level navigations back to the dashboard.
 */
export function sessionCookieOptions(days = DEFAULT_DAYS) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: days * 86400,
    };
}
