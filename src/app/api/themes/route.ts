import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getThemeSlug } from '@/lib/themeSlug';

export const dynamic = 'force-dynamic';

// Fallback static themes for database connection failure
const STATIC_THEMES = [
    {
        id: 'clv_traditional_gold',
        slug: 'traditional-gold',
        name: 'Traditional Gold',
        description: 'A timeless elegance with intricate gold leaf patterns.',
        thumbnail: '/assets/themes/gold-thumb.jpg',
        previewImages: ['/assets/themes/gold-1.jpg', '/assets/themes/gold-2.jpg'],
        bundleName: 'Gold Wedding Suite',
        isBestSeller: true,
        isPopular: true
    },
    {
        id: 'clv_minimalist_slate',
        slug: 'minimalist-slate',
        name: 'Minimalist Slate',
        description: 'Modern, clean typography for the contemporary couple.',
        thumbnail: '/assets/themes/slate-thumb.jpg',
        previewImages: ['/assets/themes/slate-1.jpg', '/assets/themes/slate-2.jpg'],
        bundleName: 'Slate Modern Suite',
        isBestSeller: false,
        isPopular: true
    }
];

export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            orderBy: [
                { sequence: 'asc' },
                { createdAt: 'desc' }
            ],
            include: { 
                bundles: {
                    include: { 
                        bundleInvoices: true,
                        bundleItems: true
                    }
                } 
            }
        });

        const formattedThemes = themes.map((theme: any) => ({
            id: theme.id,
            slug: getThemeSlug(theme),
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
                bundleItems: (b.bundleItems || [])
                    // Skip designed (image + zones) items until customer-side rendering ships (Phase 5).
                    .filter((item: any) => !String(item.templatePath || '').startsWith('structured:'))
                    .map((item: any) => {
                        let p = item.templatePath || '';
                        if (p.startsWith('public/')) p = '/' + p.substring(7);
                        if (p && !p.startsWith('/')) p = '/' + p;
                        return { ...item, templatePath: p };
                    })
            })),
            isBestSeller: theme.isBestSeller || false,
            isPopular: theme.isPopular || false,
            tag: undefined
        }));

        return NextResponse.json(
            { themes: formattedThemes },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                }
            }
        );
    } catch (error: any) {
        console.error('Database unreachable - falling back to STATIC_THEMES:', error.message);
        
        // Return 200 with Static Themes instead of 500 error
        return NextResponse.json(
            { themes: STATIC_THEMES, isFallback: true },
            { status: 200 }
        );
    }
}
