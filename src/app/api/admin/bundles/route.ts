import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const bundles = await prisma.bundle.findMany({
            orderBy: { createdAt: 'desc' },
            include: { themeRef: true }
        });

        return NextResponse.json({ bundles });
    } catch (error: any) {
        console.error('Failed to fetch admin bundles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
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

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public/Image/bundle');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        // Process item-wise uploads
        const itemImages: { [key: string]: string } = {};
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

        const itemImagePaths = Object.values(itemImages);
        const bundle = await prisma.bundle.create({
            data: {
                name,
                whatsappPrice: parseInt(tierPrices['WhatsApp Essentials']) || 0,
                printablePrice: parseInt(tierPrices['WhatsApp + Posters']) || 0,
                completePrice: parseInt(tierPrices['Complete Wedding Suite']) || 0,
                description,
                isActive,
                isPopular,
                themeId: themeId || null,
                thumbnailUrl: itemImagePaths.length > 0 ? itemImagePaths[0] : null,
                itemImages: JSON.stringify(itemImages)
            }
        });

        return NextResponse.json({ success: true, bundle });
    } catch (error: any) {
        console.error('Error in /api/admin/bundles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
