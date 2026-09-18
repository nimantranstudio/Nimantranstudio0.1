import { prisma } from '@/lib/prisma';

/**
 * Creates a clean URL-friendly slug in the format `rahul-weds-priya`.
 */
export function formatWeddingSlugBase(groomName: string, brideName: string): string {
    const groomFirst = (groomName || '')
        .trim()
        .split(/\s+/)[0]
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, '') || '';

    const brideFirst = (brideName || '')
        .trim()
        .split(/\s+/)[0]
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, '') || '';

    if (groomFirst && brideFirst) {
        return `${groomFirst}-weds-${brideFirst}`;
    }

    const fullGroom = (groomName || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const fullBride = (brideName || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    if (fullGroom && fullBride) {
        return `${fullGroom}-weds-${fullBride}`;
    }
    if (fullGroom) {
        return `${fullGroom}-wedding`;
    }
    if (fullBride) {
        return `${fullBride}-wedding`;
    }

    return `wedding-${Date.now().toString(36)}`;
}

/**
 * Ensures the slug is uniquely available in the database, appending a numeric suffix if needed.
 */
export async function generateUniqueWeddingSlug(
    groomName: string,
    brideName: string,
    excludeWeddingId?: string
): Promise<string> {
    const baseSlug = formatWeddingSlugBase(groomName, brideName);
    let candidate = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.wedding.findFirst({
            where: {
                slug: candidate,
                ...(excludeWeddingId ? { NOT: { id: excludeWeddingId } } : {}),
            },
            select: { id: true },
        });

        if (!existing) {
            return candidate;
        }

        counter++;
        candidate = `${baseSlug}-${counter}`;
    }
}
