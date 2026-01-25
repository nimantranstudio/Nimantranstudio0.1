import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            include: { bundles: true },
            orderBy: { createdAt: 'desc' },
        });

        // Transform to match UI interface
        const formattedThemes = themes.map(theme => ({
            id: theme.id,
            name: theme.name,
            description: theme.description || '',
            colors: ['#D4AF37', '#800000', '#F5E6BE'], // Placeholder colors
            thumbnail: theme.thumbnailUrl || '/placeholder-theme.jpg',
            previewImages: theme.previewImages ? JSON.parse(theme.previewImages as string) : [],
            bundleName: theme.bundles[0]?.name || 'Theme Invitation Bundle',
            isBestSeller: theme.isBestSeller,
            isPopular: theme.isPopular,
            tag: undefined
        }));

        return NextResponse.json({ themes: formattedThemes });
    } catch (error: any) {
        console.error('Failed to fetch themes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch themes' },
            { status: 500 }
        );
    }
}
