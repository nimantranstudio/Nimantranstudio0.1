import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const bundles = await prisma.bundle.findMany({
            orderBy: { createdDate: 'desc' },
            include: { themeRef: true, bundleItems: { include: { event: true } }, bundleInvoices: true }
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

        const name = formData.get('BundleName') as string;
        const description = formData.get('bundleDescription') as string;
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

        // Process item-wise uploads (legacy compatibility just in case)
        const itemImages: { [key: string]: string } = {};
        await Promise.all(Array.from(formData.entries()).map(async ([key, value]) => {
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
        }));

        // Process new structured bundle items
        const bundleItemsMetaRaw = formData.get('bundleItemsMeta');
        let bundleItemsMeta: any[] = [];
        if (typeof bundleItemsMetaRaw === 'string') {
            bundleItemsMeta = JSON.parse(bundleItemsMetaRaw);
        }

        const bundleInvoicesRaw = formData.get('bundleInvoices');
        let parsedInvoices: any[] = [];
        if (typeof bundleInvoicesRaw === 'string') {
            try {
                const invoicesData = JSON.parse(bundleInvoicesRaw);
                parsedInvoices = Object.entries(invoicesData).map(([packageId, bi]: [string, any]) => ({
                    packageId,
                    invitationDesignSuite: parseFloat(bi.invitationDesignSuite) || 0,
                    rsvpManagementTracking: parseFloat(bi.rsvpManagementTracking) || 0,
                    guestDashboard: parseFloat(bi.guestDashboard) || 0,
                    totalWeddingSuiteValue: parseFloat(bi.totalWeddingSuiteValue) || 0,
                    discount: parseFloat(bi.discount) || 0,
                    discountedPrice: parseFloat(bi.discountedPrice) || 0,
                    finalSellingPrice: parseFloat(bi.finalSellingPrice) || 0
                }));
            } catch (e) {}
        }

        const packageDisplayOptionsRaw = formData.get('packageDisplayOptions') as string;
        let packageDisplayOptions: Record<string, boolean> = {};
        if (packageDisplayOptionsRaw) {
            try {
                packageDisplayOptions = JSON.parse(packageDisplayOptionsRaw);
            } catch (e) {
                console.error("Failed to parse packageDisplayOptions", e);
            }
        }

        const bundleItemsDataToCreate = await Promise.all(bundleItemsMeta.map(async (meta: any) => {
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

            return {
                eventId: meta.eventId,
                templateName: meta.templateName,
                templatePath: templateFileStr || ''
            };
        }));

        const itemImagePaths = Object.values(itemImages);
        const bundle = await prisma.bundle.create({
            data: {
                BundleName: name,
                bundleDescription: description,
                isActive,
                isPopular,
                themeId: themeId || null,
                bundleInvoices: {
                    create: parsedInvoices.map((inv: any) => ({
                        ...inv,
                        isDisplay: Boolean(packageDisplayOptions[inv.packageId] ?? true)
                    }))
                },
                thumbnailUrl: itemImagePaths.length > 0 ? itemImagePaths[0] : (bundleItemsDataToCreate.length > 0 ? bundleItemsDataToCreate[0].templatePath : null),
                itemImages: JSON.stringify(itemImages),
                bundleItems: {
                    create: bundleItemsDataToCreate.map((item: any) => ({
                        eventId: item.eventId,
                        templateName: item.templateName,
                        templatePath: item.templatePath
                    }))
                }
            },
            include: {
                bundleItems: {
                    include: { event: true }
                },
                bundleInvoices: true
            }
        });

        return NextResponse.json({ success: true, bundle });
    } catch (error: any) {
        console.error('Error in /api/admin/bundles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
