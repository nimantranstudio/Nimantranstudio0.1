import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Initializing theme cache for performance
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            orderBy: { createdAt: 'desc' },
            include: { 
                bundles: {
                    include: { 
                        bundleInvoices: true,
                        bundleItems: true
                    }
                } 
            }
        });

        try {
            const formattedThemes = themes.map((theme: any) => ({
                id: theme.id,
                name: theme.name,
                description: theme.description || '',
                thumbnail: theme.thumbnailUrl || '/placeholder-theme.jpg',
                previewImages: theme.previewImages ? JSON.parse(theme.previewImages as string) : [],
                bundleName: theme.bundles?.[0]?.BundleName || 'Theme Invitation Bundle',
                bundles: (theme.bundles || []).map((b: any) => ({
                    id: b.id,
                    name: b.BundleName,
                    whatsappPrice: b.whatsappPrice,
                    printablePrice: b.printablePrice,
                    completePrice: b.completePrice,
                    description: b.bundleDescription || '',
                    itemImages: b.itemImages,
                    bundleInvoices: (b as any).bundleInvoices,
                    bundleItems: b.bundleItems || []
                })),
                isBestSeller: theme.isBestSeller || false,
                isPopular: theme.isPopular || false,
                tag: undefined
            }));
            return NextResponse.json(
                { themes: formattedThemes },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
                    }
                }
            );
        } catch (mapError: any) {
            console.error('Failed processing themes map:', mapError);
            throw mapError;
        }
    } catch (error: any) {
        console.error('Failed to fetch themes total block:', error);
        return NextResponse.json(
            { error: 'Failed to fetch themes', details: error.message },
            { status: 500 }
        );
    }
}
