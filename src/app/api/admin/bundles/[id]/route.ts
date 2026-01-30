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
        const description = formData.get('description') as string;
        const isActive = formData.get('isActive') === 'true';
        const isPopular = formData.get('isPopular') === 'true';
        const themeId = formData.get('themeId') as string;

        const tierPricesRaw = formData.get('tierPrices') as string;
        const tierPrices = tierPricesRaw ? JSON.parse(tierPricesRaw) : {};

        console.log(`[ADMIN API] Updating Bundle: ${id}`, { name, isActive, isPopular });

        const uploadDir = path.join(process.cwd(), 'public/Image/bundle');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        // Process item-wise uploads
        const existingItemImages = JSON.parse(formData.get('existingItemImages') as string || '{}');
        const itemImages: { [key: string]: string } = { ...existingItemImages };

        await Promise.all(
            Array.from(formData.entries()).map(async ([key, value]) => {
                if (key.startsWith('itemFile_') && value instanceof File) {
                    const itemName = key.replace('itemFile_', '');
                    const bytes = await value.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const filename = `item-${itemName.replace(/\s+/g, '_')}-${uniqueSuffix}${path.extname(value.name)}`;
                    const filepath = path.join(uploadDir, filename);
                    await writeFile(filepath, buffer);
                    itemImages[itemName] = `/Image/bundle/${filename}`;
                }
            })
        );

        const itemImagePaths = Object.values(itemImages);
        const bundle = await prisma.bundle.update({
            where: { id },
            data: {
                name,
                whatsappPrice: parseInt(tierPrices['WhatsApp Essentials']) || 0,
                printablePrice: parseInt(tierPrices['WhatsApp + Posters']) || 0,
                completePrice: parseInt(tierPrices['Complete Wedding Suite']) || 0,
                description,
                isActive,
                isPopular,
                themeId: themeId || null,
                thumbnailUrl: itemImagePaths.length > 0 ? (itemImagePaths[0] as string) : null,
                itemImages: JSON.stringify(itemImages)
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
