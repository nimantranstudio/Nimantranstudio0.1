import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

import { verifyAuth } from '@/lib/auth-server';

// In production/real app, you'd want to handle GET by querying the DB
export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        const themes = await prisma.theme.findMany({
            orderBy: [
                { sequence: 'asc' },
                { createdAt: 'desc' }
            ]
        });
        return NextResponse.json({ themes });
    } catch (error: any) {
        console.error('Failed to fetch themes:', error);
        return NextResponse.json({
            error: 'Database Connection Failed',
            details: error.message
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string || '';
        const isActive = formData.get('isActive') === 'true';
        const isBestSeller = formData.get('isBestSeller') === 'true';
        const isPopular = formData.get('isPopular') === 'true';
        const thumbnailIndex = parseInt(formData.get('thumbnailIndex') as string) || 0;
        const files = formData.getAll('images') as File[];

        console.log('Creating theme:', name);

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Save images
        const uploadDir = path.join(process.cwd(), 'public/Image/theme');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if exists
        }

        const savedImagePaths = await Promise.all(files.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name);
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            return `/Image/theme/${filename}`;
        }));

        console.log('Images saved, connecting to DB...');

        // Connect to DB lazily using dynamic import
        let theme;
        try {
            const { getPrisma } = await import('@/lib/prisma');
            const prisma = getPrisma();
            const thumbUrl = savedImagePaths.length > thumbnailIndex ? savedImagePaths[thumbnailIndex] : (savedImagePaths.length > 0 ? savedImagePaths[0] : null);
            const previewImagesJson = JSON.stringify(savedImagePaths);

            theme = await prisma.theme.create({
                data: {
                    name,
                    description,
                    isActive,
                    isBestSeller,
                    isPopular,
                    thumbnailUrl: thumbUrl,
                    previewImages: previewImagesJson,
                },
            });
            console.log('Theme created in DB:', theme.id);
        } catch (dbError: any) {
            console.error("Database Error:", dbError);
            throw dbError; // Don't hide the error
        }

        return NextResponse.json({ success: true, theme });

    } catch (error: any) {
        console.error('CRITICAL Error in /api/admin/themes:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        }, { status: 500 });
    }
}
