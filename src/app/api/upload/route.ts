import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { verifyAuth } from '@/lib/auth-server';

/**
 * Admin-only media upload (blog images, video-template posters).
 *
 * Was previously unauthenticated with no type or size limit, which meant
 * anyone could host arbitrary files on this domain — an `.html` or `.svg`
 * upload becomes stored XSS served from nimantranstudio.in, and there was
 * nothing stopping unbounded writes.
 *
 * Note this writes to the local filesystem, which is read-only on Vercel, so
 * it only functions in local/self-hosted runs; Firebase Storage
 * (lib/firebase-storage.ts) is what persists uploads in production.
 */

/** Raster images only — never markup or scripts, which would execute on our origin. */
const ALLOWED = new Map<string, string>([
    ['image/png', '.png'],
    ['image/jpeg', '.jpg'],
    ['image/webp', '.webp'],
    ['image/gif', '.gif'],
]);

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB, matching the Firebase upload cap

export async function POST(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || !user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        // Trust the declared type only as far as the allowlist, and derive the
        // extension from it rather than from the (attacker-supplied) filename.
        const ext = ALLOWED.get(file.type);
        if (!ext) {
            return NextResponse.json(
                { success: false, error: 'Only PNG, JPEG, WebP or GIF images are allowed' },
                { status: 400 }
            );
        }

        if (file.size > MAX_BYTES) {
            return NextResponse.json({ success: false, error: 'File too large (max 8 MB)' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (buffer.length === 0) {
            return NextResponse.json({ success: false, error: 'Empty file' }, { status: 400 });
        }
        if (buffer.length > MAX_BYTES) {
            return NextResponse.json({ success: false, error: 'File too large (max 8 MB)' }, { status: 400 });
        }

        // Strip the caller's extension and re-apply the one the allowlist chose,
        // so the stored file can never be served as markup/script.
        const rawBase = file.name.slice(0, file.name.length - extname(file.name).length);
        const safeBase = rawBase.replace(/[^a-zA-Z0-9\-_]/g, '').slice(0, 40) || 'upload';
        const uniqueName = `${Date.now()}-${safeBase}${ext}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // Ignore error if directory already exists
        }

        await writeFile(join(uploadDir, uniqueName), buffer);

        return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
