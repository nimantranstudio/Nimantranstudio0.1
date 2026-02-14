
import { prisma } from '@/lib/prisma';
import type { Theme } from '@/lib/constants/themes';

export async function getThemes(): Promise<Theme[]> {
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            include: { bundles: true },
            orderBy: { createdAt: 'desc' },
        });

        // Transform to match UI interface
        return themes.map(theme => ({
            id: theme.id,
            name: theme.name,
            description: theme.description || '',
            colors: ['#D4AF37', '#800000', '#F5E6BE'], // Placeholder colors
            thumbnail: theme.thumbnailUrl || '/placeholder-theme.jpg',
            previewImages: theme.previewImages ? JSON.parse(theme.previewImages as string) : [],
            bundleName: theme.bundles[0]?.name || 'Theme Invitation Bundle',
            bundles: theme.bundles.map(b => ({
                id: b.id,
                name: b.name,
                whatsappPrice: b.whatsappPrice,
                printablePrice: b.printablePrice,
                completePrice: b.completePrice,
                description: b.description || '',
                itemImages: b.itemImages
            })),
            isBestSeller: theme.isBestSeller,
            isPopular: theme.isPopular,
            tag: undefined
        }));
    } catch (error) {
        console.error('Failed to fetch themes:', error);
        // Return empty array or throw error depending on desired behavior.
        // Given existing API implementation returned 500 on error, we might want to throw or return empty.
        // For server components, throwing allows Error Boundary to catch it.
        // But to be safe and match `useState` initial value, let's return empty array but log error.
        return [];
    }
}
