import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { buildTemplateFilename } from '@/lib/admin/template-filename';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        const bundleItemsDataToCreate = [];
        for (const meta of bundleItemsMeta) {
            let templateFileStr = meta.existingUrl;

            const file = formData.get(`newBundleItem_${meta.id}`);
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const eventName = meta.eventType || meta.templateName || meta.id || 'template';
                const filename = buildTemplateFilename(id, meta.eventId, eventName, path.extname(file.name));
                const filepath = path.join(uploadDir, filename);
                await writeFile(filepath, buffer);
                templateFileStr = `/Image/bundle/${filename}`;
            }

            bundleItemsDataToCreate.push({
                eventId: meta.eventId,
                templateName: meta.templateName,
                templatePath: templateFileStr || ''
            });
        }

        // Delete existing bundle items and re-create — wrapped in one transaction so a failure
        // in the update (e.g. a bad bundleItems/bundleInvoices payload) rolls back the delete
        // too, instead of leaving the bundle with its items wiped and nothing recreated.
        const itemImagePaths = Object.values(itemImages);
        const bundle = await prisma.$transaction(async (tx) => {
            await tx.bundleItem.deleteMany({ where: { bundleId: id } });

            return tx.bundle.update({
                where: { id },
                data: {
                    BundleName: name,
                    bundleDescription: description,
                    isActive,
                    isPopular,
                    themeId: themeId || null,
                    bundleInvoices: {
                        deleteMany: {},
                        create: parsedInvoices.map((inv: any) => ({
                            ...inv,
                            isDisplay: Boolean(packageDisplayOptions[inv.packageId] ?? true)
                        }))
                      },
                    thumbnailUrl: itemImagePaths.length > 0 ? (itemImagePaths[0] as string) : (bundleItemsDataToCreate.length > 0 ? bundleItemsDataToCreate[0].templatePath : null),
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
                    bundleInvoices: {
                        include: { package: true }
                    }
                }
            });
        }, {
            // DATABASE_URL is a remote (Railway-proxied) Postgres instance, so the delete +
            // nested-update round trip inside this transaction routinely exceeds Prisma's
            // default 5s interactive-transaction timeout under real network latency — this
            // was the actual cause of "Failed to save bundle details". 20s matches the real
            // cost of the operation instead of masking a timeout as a generic save failure.
            timeout: 20000,
            maxWait: 10000
        });

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/themes');
        revalidatePath('/');
        revalidatePath(`/themes/${themeId}`);

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
