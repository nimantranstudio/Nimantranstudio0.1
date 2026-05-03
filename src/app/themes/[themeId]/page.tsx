import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ThemeDetailClient from './ThemeDetailClient';
import fs from 'fs';
import path from 'path';

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
        prisma.theme.findMany({ where: { isActive: true }, take: 20 })
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
            bundleItems: (b.bundleItems || []).map((item: any) => {
                let p = item.templatePath || '';
                if (p.startsWith('public/')) p = '/' + p.substring(7);
                if (p && !p.startsWith('/')) p = '/' + p;

                // Self-healing for missing templates
                if (p && p.toLowerCase().endsWith('.html')) {
                    const fullPath = path.join(process.cwd(), 'public', p);
                    if (!fs.existsSync(fullPath)) {
                        try {
                            const bundleDir = path.join(process.cwd(), 'public/Image/bundle');
                            if (fs.existsSync(bundleDir)) {
                                const files = fs.readdirSync(bundleDir);
                                const htmlTemplates = files.filter(f => f.toLowerCase().endsWith('.html'));
                                if (htmlTemplates.length > 0) {
                                    const bestMatch = htmlTemplates.find(f => f.toLowerCase().includes('wedding') && f.toLowerCase().includes('invitation')) || htmlTemplates[0];
                                    p = `/Image/bundle/${bestMatch}`;
                                }
                            }
                        } catch (e) {}
                    }
                }
                return { ...item, templatePath: p };
            })
        }))
    };

    const recommendations = (allThemes || []).filter((t: any) => t.id !== themeId).slice(0, 4);

    return (
        <ThemeDetailClient 
            themeId={themeId}
            initialTheme={formattedTheme}
            initialPackages={packages}
            initialRecommendations={recommendations}
        />
    );
}
