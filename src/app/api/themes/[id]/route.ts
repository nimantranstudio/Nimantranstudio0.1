import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const theme = await prisma.theme.findUnique({
            where: { id },
            include: { bundles: true }
        });

        console.log(`Fetching theme ${id}:`, theme ? `Found with ${theme.bundles.length} bundles` : 'Not found');
        if (theme?.bundles.length > 0) {
            console.log('First Bundle Name:', theme.bundles[0].name);
        }

        if (!theme) {
            return NextResponse.json(
                { error: 'Theme not found' },
                { status: 404 }
            );
        }

        const formattedTheme = {
            id: theme.id,
            name: theme.name,
            description: theme.description || '',
            thumbnail: theme.thumbnailUrl || '/placeholder-theme.jpg',
            previewImages: theme.previewImages ? JSON.parse(theme.previewImages as string) : [],
            bundleName: theme.bundles[0]?.name || 'Theme Invitation Bundle',
            tag: undefined
        };

        return NextResponse.json({ theme: formattedTheme });
    } catch (error: any) {
        console.error(`Failed to fetch theme:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch theme', message: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
