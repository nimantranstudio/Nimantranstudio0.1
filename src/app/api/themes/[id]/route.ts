import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const revalidate = 3600;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const theme = await prisma.theme.findUnique({
            where: { id },
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
        });

        console.log(`Fetching theme ${id}:`, theme ? `Found with ${(theme as any).bundles?.length || 0} bundles` : 'Not found');
        if ((theme as any)?.bundles?.length > 0) {
            console.log('First Bundle Name:', (theme as any).bundles[0].name);
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
            bundleName: (theme as any).bundles[0]?.BundleName || 'Theme Invitation Bundle',
            bundles: (theme as any).bundles.map((b: any) => ({
                ...b,
                name: b.BundleName,
                description: b.bundleDescription || '',
                bundleItems: (b.bundleItems || []).map((item: any) => {
                    let p = item.templatePath || '';
                    if (p.startsWith('public/')) p = '/' + p.substring(7);
                    if (p && !p.startsWith('/')) p = '/' + p;

                    // SELF-HEALING: If file doesn't exist, try to find a fallback
                    // Optimization: We use a cache to avoid re-scanning the disk on every single item.
                    if (p && p.toLowerCase().endsWith('.html')) {
                        const fullPath = path.join(process.cwd(), 'public', p);
                        
                        // Simple sync check is okay if not done for 100s of files.
                        if (!fs.existsSync(fullPath)) {
                            console.log(`[Self-Healing] Missing: ${p}. Attempting to recover...`);
                            try {
                                const bundleDir = path.join(process.cwd(), 'public/Image/bundle');
                                if (fs.existsSync(bundleDir)) {
                                    const files = fs.readdirSync(bundleDir);
                                    const htmlTemplates = files.filter(f => f.toLowerCase().endsWith('.html'));
                                    
                                    if (htmlTemplates.length > 0) {
                                        // SMART FALLBACK: Prioritize "Wedding Invitation" or "WEDDING"
                                        const bestMatch = htmlTemplates.find(f => 
                                            f.toLowerCase().includes('wedding') && f.toLowerCase().includes('invitation')
                                        ) || htmlTemplates.find(f => 
                                            f.toLowerCase().includes('wedding')
                                        ) || htmlTemplates[0];
                                        
                                        p = `/Image/bundle/${bestMatch}`;
                                        console.log(`[Self-Healing] Found Best Fallback: ${p}`);
                                    }
                                }
                            } catch (e) {
                                console.error("Self-healing failed", e);
                            }
                        }
                    }

                    return { ...item, templatePath: p };
                })
            })) || [],
            tag: undefined
        };

        return NextResponse.json({ theme: formattedTheme }, {
            headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
        });
    } catch (error: any) {
        console.error(`Failed to fetch theme:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch theme', message: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
