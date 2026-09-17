/**
 * Small in-process rate limiter for the public, unauthenticated endpoints
 * (RSVP submissions, card uploads, order creation) that previously had no
 * abuse protection at all.
 *
 * Deliberately dependency-free and in-memory: it stops naive scripted abuse —
 * a bot looping on an endpoint — without adding Redis/Upstash infrastructure.
 * The tradeoff to know about: serverless runs multiple instances, each with
 * its own counters, so the effective ceiling is (limit × instances) rather
 * than a hard global cap. That is a meaningful bar against casual abuse, not a
 * defence against a distributed attacker; if this ever needs to be exact,
 * swap the store here for a shared one — callers won't change.
 *
 * Limits are set generously on purpose. Guests at one wedding often share a
 * home or venue network and therefore an IP, so a limit tight enough to be
 * "strict" would start rejecting real RSVPs.
 */

interface Bucket {
    count: number;
    resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Keeps the Map from growing without bound on a long-lived instance. */
function prune(now: number) {
    if (buckets.size < 5000) return;
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}

export interface RateLimitResult {
    ok: boolean;
    /** Seconds until the window resets — surfaced as Retry-After. */
    retryAfterSec: number;
}

export function rateLimit(
    key: string,
    opts: { limit: number; windowMs: number }
): RateLimitResult {
    const now = Date.now();
    prune(now);

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
        return { ok: true, retryAfterSec: 0 };
    }

    bucket.count += 1;
    if (bucket.count > opts.limit) {
        return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
    }
    return { ok: true, retryAfterSec: 0 };
}

/**
 * Best-effort client identity. Behind Vercel the left-most x-forwarded-for
 * entry is the real client; the header is spoofable in principle, which is
 * another reason these limits are a speed bump rather than a guarantee.
 */
export function clientKey(req: Request, scope: string): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    return `${scope}:${ip}`;
}
