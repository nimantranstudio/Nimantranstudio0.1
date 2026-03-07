import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            include: { bundles: true }
        });

        try {
            const formattedThemes = themes.map((theme: any) => ({
                id: theme.id,
                name: theme.name,
                description: theme.description || '',
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
