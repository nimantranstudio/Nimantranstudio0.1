import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const isActive = formData.get('isActive') === 'true';
        const isBestSeller = formData.get('isBestSeller') === 'true';
        const isPopular = formData.get('isPopular') === 'true';
        const files = formData.getAll('images') as File[];

        if (!id) {
            return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
        }

        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        // Check if theme exists
        const existingTheme = await prisma.theme.findUnique({
            where: { id }
        });

        if (!existingTheme) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        let savedImagePaths: string[] = [];
        if (existingTheme.previewImages) {
            try {
                savedImagePaths = JSON.parse(existingTheme.previewImages);
            } catch (e) {
                console.error("Failed to parse existing images", e);
            }
        }

        // If new files are provided, upload them
        if (files.length > 0 && files[0].size > 0) {
            const uploadDir = path.join(process.cwd(), 'public/Image/theme');
            await mkdir(uploadDir, { recursive: true });

            const uploadPromises = files.map(async (file) => {
                if (file.size === 0) return null;
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name);
                const filepath = path.join(uploadDir, filename);

                await writeFile(filepath, buffer);
                return `/Image/theme/${filename}`;
            });

            const results = await Promise.all(uploadPromises);
            const newPaths = results.filter((path): path is string => path !== null);

            if (newPaths.length > 0) {
                savedImagePaths = [...savedImagePaths, ...newPaths];
            }
        }

        const updatedTheme = await prisma.theme.update({
            where: { id },
            data: {
                name,
                description,
                isActive,
                thumbnailUrl: savedImagePaths.length > 0 ? savedImagePaths[0] : existingTheme.thumbnailUrl,
                previewImages: JSON.stringify(savedImagePaths),
            }
        });

        return NextResponse.json({ success: true, theme: updatedTheme });

    } catch (error: any) {
        console.error('Error updating theme:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
        }

        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        // Get theme to find images to delete
        const theme = await prisma.theme.findUnique({
            where: { id }
        });

        if (!theme) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        // Delete from DB
        await prisma.theme.delete({
            where: { id }
        });

        // Delete files from disk
        if (theme.previewImages) {
            try {
                const images = JSON.parse(theme.previewImages) as string[];
                for (const imagePath of images) {
                    const fullPath = path.join(process.cwd(), 'public', imagePath);
                    try {
                        await unlink(fullPath);
                    } catch (e) {
                        console.error(`Failed to delete file: ${fullPath}`, e);
                    }
                }
            } catch (e) {
                console.error("Failed to parse/delete images", e);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error deleting theme:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
