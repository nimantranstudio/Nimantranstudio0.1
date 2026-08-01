import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ThemeDetailClient from './ThemeDetailClient';

export const revalidate = 3600;

export async function generateMetadata(
    { params }: { params: Promise<{ themeId: string }> }
): Promise<Metadata> {
    const { themeId } = await params;
    const theme = await prisma.theme.findUnique({
        where: { id: themeId },
        select: { name: true, description: true, thumbnailUrl: true }
    });

    if (!theme) return { title: 'Theme Not Found | Nimantran Studio' };

    const title = `${theme.name} Wedding Invitations | Nimantran Studio`;
    const description = theme.description ||
        'Beautiful Indian wedding invitation templates with built-in RSVP, guest management, and instant WhatsApp sharing.';
    const image = theme.thumbnailUrl || '/og-image.png';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image, width: 1200, height: 630, alt: theme.name }],
            type: 'website',
            siteName: 'Nimantran Studio',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default async function ThemeDetailPage({ params }: { params: Promise<{ themeId: string }> }) {
    const { themeId } = await params;

    // Fetch core data in parallel
    const [themeData, packages, allThemes] = await Promise.all([
        prisma.theme.findUnique({
            where: { id: themeId },
            include: { 
                bundles: {
                    include: { 
                        bundleInvoices: true,
                        bundleItems: {
                            include: { event: true }
                        }
                    }
                }
            }
        }),
        prisma.package.findMany({ where: { isActive: true } }),
        prisma.theme.findMany({ 
            where: { isActive: true }, 
            take: 20,
            orderBy: [
                { sequence: 'asc' },
                { createdAt: 'desc' }
            ]
        })
    ]);

    if (!themeData) {
        return (
            <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
                <h1>Theme not found</h1>
                <a href="/themes" style={{ marginTop: '2rem', display: 'inline-block', padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '8px' }}>
                    Back to Themes
                </a>
            </div>
        );
    }

    // Load the CardDocument layout for any designed (structured) bundle items in this theme,
    // so the customer preview can render them via CardRenderer instead of an HTML iframe.
    const structuredIds = new Set<string>();
    for (const b of (themeData as any).bundles || []) {
        for (const it of b.bundleItems || []) {
            const p: string = it.templatePath || '';
            if (p.startsWith('structured:')) structuredIds.add(p.slice('structured:'.length));
        }
    }
    const templateLayouts: Record<string, any> = {};
    if (structuredIds.size) {
        const tpls = await prisma.template.findMany({
            where: { id: { in: Array.from(structuredIds) } },
            select: { id: true, layout: true },
        });
        for (const t of tpls) templateLayouts[t.id] = t.layout;
    }

    // Format theme data for the client (Self-healing from API logic)
    const formattedTheme = {
        ...themeData,
        thumbnail: themeData.thumbnailUrl || '/placeholder-theme.jpg',
        previewImages: themeData.previewImages ? JSON.parse(themeData.previewImages as string) : [],
        bundleName: (themeData as any).bundles[0]?.BundleName || 'Theme Invitation Bundle',
        bundles: (themeData as any).bundles.map((b: any) => ({
            ...b,
            name: b.BundleName,
            description: b.bundleDescription || '',
            bundleItems: (b.bundleItems || [])
                .map((item: any) => {
                    const p0: string = item.templatePath || '';
                    // Designed template: attach its CardDocument layout so the client can render it.
                    if (p0.startsWith('structured:')) {
                        const layout = templateLayouts[p0.slice('structured:'.length)];
                        if (!layout) return null; // template was deleted — drop the orphaned item
                        return { ...item, templatePath: p0, kind: 'structured', layout };
                    }
                    // HTML template: normalise the path as before.
                    let p = p0;
                    if (p.startsWith('public/')) p = '/' + p.substring(7);
                    if (p && !p.startsWith('/')) p = '/' + p;
                    return { ...item, templatePath: p, kind: 'html' };
                })
                .filter(Boolean)
        }))
    };

    const recommendations = (allThemes || [])
        .filter((t: any) => t.id !== themeId)
        .slice(0, 4)
        .map((t: any) => ({
            ...t,
            thumbnail: t.thumbnailUrl || '/placeholder-theme.jpg'
        }));

    return (
        <ThemeDetailClient 
            themeId={themeId}
            initialTheme={formattedTheme}
            initialPackages={packages}
            initialRecommendations={recommendations}
        />
    );
}
