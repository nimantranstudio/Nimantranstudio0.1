import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
    try {
        const { getAdminStorage } = await import('@/lib/firebase-admin');
        const storage = getAdminStorage();
        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!bucketName) {
            return NextResponse.json({ error: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET env var is not set' }, { status: 500 });
        }
        const bucket = storage.bucket(bucketName);

        await bucket.setMetadata({
            cors: [
                {
                    origin: ['*'],
                    method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
                    responseHeader: [
                        'Content-Type',
                        'Authorization',
                        'Content-Length',
                        'x-goog-resumable',
                        'x-firebase-storage-version',
                        'x-goog-upload-protocol',
                        'x-goog-upload-status',
                    ],
                    maxAgeSeconds: 3600,
                },
            ],
        });

        return NextResponse.json({ success: true, message: 'Firebase Storage CORS configured successfully.' });
    } catch (error: any) {
        console.error('[setup-storage-cors]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
