import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Workaround for missing columns in the actual local DB: use queryRaw to safely pull available columns
        const rawThemes = await prisma.$queryRaw`
            SELECT id, name, description, thumbnailUrl, previewImages, isBestSeller, isPopular
            FROM Theme 
            WHERE isActive = 1 
            ORDER BY createdAt DESC
        `;

        // Manual lookup for bundles since queryRaw doesn't do "includes"
        const rawBundles = await prisma.$queryRaw`SELECT * FROM Bundle`;

        const themes = (rawThemes as any[]).map(rt => {
            return {
                ...rt,
                bundles: (rawBundles as any[]).filter(b => b.themeId === rt.id)
            }
        });

        try {
            const formattedThemes = themes.map((theme: any) => ({
                id: theme.id,
                name: theme.name,
                description: theme.description || '',
                colors: theme.colors ? JSON.parse(theme.colors) : [],
                thumbnail: theme.thumbnailUrl || '/placeholder-theme.jpg',
                previewImages: theme.previewImages ? JSON.parse(theme.previewImages as string) : [],
                bundleName: theme.bundles?.[0]?.name || 'Theme Invitation Bundle',
                bundles: (theme.bundles || []).map((b: any) => ({
                    id: b.id,
                    name: b.name,
                    whatsappPrice: b.whatsappPrice,
                    printablePrice: b.printablePrice,
                    completePrice: b.completePrice,
                    description: b.description || '',
                    itemImages: b.itemImages
                })),
                isBestSeller: theme.isBestSeller || false,
                isPopular: theme.isPopular || false,
                tag: undefined
            }));
            return NextResponse.json({ themes: formattedThemes });
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
