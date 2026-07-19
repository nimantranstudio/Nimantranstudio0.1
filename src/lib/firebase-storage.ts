import 'server-only';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';
import { initAdmin } from '@/lib/firebase-admin';

/**
 * Uploads a rendered invitation card (PNG/JPEG/WebP data URL) to Firebase
 * Storage and returns a permanent, publicly-fetchable URL.
 *
 * Uses the `firebaseStorageDownloadTokens` metadata trick so the object is
 * reachable via a tokenized firebasestorage.googleapis.com URL WITHOUT making
 * the whole bucket public — the URL is unguessable and stable. This is what the
 * WhatsApp media header (and the dashboard) fetch. Works on Vercel (unlike the
 * local-filesystem /api/upload route, which can't write at runtime there).
 */

const BUCKET =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB cap

export async function uploadCardImage(
    dataUrl: string,
    baseName = 'card'
): Promise<string> {
    const match = /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i.exec(dataUrl);
    if (!match) throw new Error('Invalid image data URL');

    const contentType = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1];
    const ext = match[2].toLowerCase() === 'jpeg' || match[2].toLowerCase() === 'jpg' ? 'jpg' : match[2].toLowerCase();
    const buffer = Buffer.from(match[3], 'base64');
    if (buffer.length === 0) throw new Error('Empty image');
    if (buffer.length > MAX_BYTES) throw new Error('Image too large');

    if (!BUCKET) throw new Error('Firebase storage bucket not configured');

    initAdmin();
    const bucket = getStorage().bucket(BUCKET);

    const token = randomUUID();
    const safe = baseName.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40) || 'card';
    const objectPath = `cards/${Date.now()}-${safe}.${ext}`;
    const file = bucket.file(objectPath);

    await file.save(buffer, {
        contentType,
        resumable: false,
        metadata: {
            metadata: { firebaseStorageDownloadTokens: token },
            cacheControl: 'public, max-age=31536000, immutable',
        },
    });

    const encodedPath = encodeURIComponent(objectPath);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}
