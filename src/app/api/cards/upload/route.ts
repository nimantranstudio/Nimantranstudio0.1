import { NextResponse } from 'next/server';
import { uploadCardImage } from '@/lib/firebase-storage';

/**
 * Hosts a client-rendered invitation card so it can be used as the WhatsApp
 * welcome's hero image. Called at checkout — BEFORE the session cookie exists —
 * so it is intentionally unauthenticated; it only accepts a base64 image and
 * returns a hosted URL (size-capped in the storage helper). Fails soft: the
 * caller falls back to the bundle image if this errors.
 */
export async function POST(req: Request) {
    try {
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
