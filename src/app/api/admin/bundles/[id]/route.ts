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

        for (const [key, value] of Array.from(formData.entries())) {
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
        }

        // Process structured bundle items
        const bundleItemsMetaRaw = formData.get('bundleItemsMeta');
        let bundleItemsMeta: any[] = [];
        if (typeof bundleItemsMetaRaw === 'string') {
            bundleItemsMeta = JSON.parse(bundleItemsMetaRaw);
        }

        const bundleItemsDataToCreate = [];
        for (const meta of bundleItemsMeta) {
            let templateFileStr = meta.existingUrl;

            const file = formData.get(`newBundleItem_${meta.id}`);
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = `template-${meta.eventType}-${uniqueSuffix}${path.extname(file.name)}`;
                const filepath = path.join(uploadDir, filename);
                await writeFile(filepath, buffer);
                templateFileStr = `/Image/bundle/${filename}`;
            }

            bundleItemsDataToCreate.push({
                eventType: meta.eventType,
                templateName: meta.templateName || meta.eventType.replace(/_/g, ' '),
                templateFile: templateFileStr || ''
            });
        }

        // Delete existing bundle items and re-create
        await prisma.bundleItem.deleteMany({ where: { bundleId: id } });

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
                thumbnailUrl: itemImagePaths.length > 0 ? (itemImagePaths[0] as string) : (bundleItemsDataToCreate.length > 0 ? bundleItemsDataToCreate[0].templateFile : null),
                itemImages: JSON.stringify(itemImages),
                bundleItems: {
                    create: bundleItemsDataToCreate
                }
            },
            include: {
                bundleItems: true
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
