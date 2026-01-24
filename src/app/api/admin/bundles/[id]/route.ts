import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const highlights = formData.get('highlights') as string;
        const checklist = formData.get('checklist') as string;

        // Force convert to boolean correctly
        const isActive = formData.get('isActive') === 'true';
        const isPopular = formData.get('isPopular') === 'true';

        console.log(`[ADMIN API] Updating Bundle: ${id}`, { name, isActive, isPopular });

        const themeId = formData.get('themeId') as string;
        const files = formData.getAll('images') as File[];

        const savedImagePaths: string[] = [];
        const uploadDir = path.join(process.cwd(), 'public/Image/bundle');

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        for (const file of files) {
            if (file && typeof file !== 'string') {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name);
                const filepath = path.join(uploadDir, filename);
                await writeFile(filepath, buffer);
                savedImagePaths.push(`/Image/bundle/${filename}`);
            }
        }

        const existingBundle = await prisma.bundle.findUnique({ where: { id } });
        let finalImages = existingBundle?.previewImages ? JSON.parse(existingBundle.previewImages) : [];
        if (savedImagePaths.length > 0) {
            finalImages = [...finalImages, ...savedImagePaths];
        }

        const bundle = await prisma.bundle.update({
            where: { id },
            data: {
                name,
                price: String(price),
                description,
                highlights,
                checklist,
                isActive,
                isPopular,
                themeId: themeId || null,
                thumbnailUrl: finalImages.length > 0 ? finalImages[0] : null,
                previewImages: JSON.stringify(finalImages),
            }
        });

        return NextResponse.json({ success: true, bundle });
    } catch (error: any) {
        console.error('Error updating bundle:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        await prisma.bundle.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting bundle:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
