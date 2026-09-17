import { NextResponse } from 'next/server';
import { uploadCardImage } from '@/lib/firebase-storage';
import { rateLimit, clientKey } from '@/lib/rate-limit';

/**
 * Hosts a client-rendered invitation card so it can be used as the WhatsApp
 * welcome's hero image. Called at checkout — BEFORE the session cookie exists —
 * so it is intentionally unauthenticated; it only accepts a base64 image and
 * returns a hosted URL (size-capped in the storage helper). Fails soft: the
 * caller falls back to the bundle image if this errors.
 *
 * Because it is unauthenticated and writes to paid storage, it is rate limited:
 * a checkout captures a handful of cards at most, so a generous cap costs real
 * users nothing while stopping a script from filling the bucket.
 */
export async function POST(req: Request) {
    try {
        const limit = rateLimit(clientKey(req, 'card-upload'), { limit: 30, windowMs: 10 * 60 * 1000 });
        if (!limit.ok) {
            return NextResponse.json(
                { success: false, error: 'Too many uploads. Please try again shortly.' },
                { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
            );
        }

        const { dataUrl, name } = await req.json();

        if (!dataUrl || typeof dataUrl !== 'string') {
            return NextResponse.json(
                { success: false, error: 'dataUrl is required' },
                { status: 400 }
            );
        }

        const url = await uploadCardImage(dataUrl, typeof name === 'string' ? name : 'invitation');
        return NextResponse.json({ success: true, url });
    } catch (error: any) {
        console.error('Card image upload failed:', error?.message);
        return NextResponse.json(
            { success: false, error: error?.message || 'Upload failed' },
            { status: 500 }
        );
    }
}
