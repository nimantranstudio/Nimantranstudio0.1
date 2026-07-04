/**
 * Signed admin session token (HMAC-SHA256).
 * Uses Web Crypto so it works in both Node API routes and Edge middleware.
 * The token is stored in an httpOnly cookie set on admin login, and verified
 * server-side on every admin route — the client cannot forge it.
 */

const SECRET = process.env.ADMIN_SESSION_SECRET || 'nimantran-admin-secret-change-me';
const encoder = new TextEncoder();

export const ADMIN_COOKIE = 'ns_admin';

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

export async function createAdminToken(mobile: string, days = 7): Promise<string> {
    const payload = JSON.stringify({ m: mobile, r: 'admin', exp: Date.now() + days * 86400000 });
    const payloadB64 = bytesToB64url(encoder.encode(payload));
    const key = await getKey();
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
    return `${payloadB64}.${bytesToB64url(new Uint8Array(sig))}`;
}

export async function verifyAdminToken(token?: string | null): Promise<boolean> {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, sigB64] = parts;
    try {
        const key = await getKey();
        const valid = await crypto.subtle.verify(
            'HMAC',
            key,
            b64urlToBytes(sigB64) as unknown as BufferSource,
            encoder.encode(payloadB64) as unknown as BufferSource
        );
        if (!valid) return false;
        const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
        return payload.r === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now();
    } catch {
        return false;
    }
}

export async function getAdminPayload(token?: string | null): Promise<{ m: string; r: string } | null> {
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
        const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
        if (payload.r === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now()) {
            return payload;
        }
        return null;
    } catch {
        return null;
    }
}

