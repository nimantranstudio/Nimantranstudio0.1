import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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
                    if (p && p.toLowerCase().endsWith('.html')) {
                        const fullPath = path.join(process.cwd(), 'public', p);
                        if (!fs.existsSync(fullPath)) {
                            console.log(`[Self-Healing] Template not found: ${fullPath}. Searching for fallback...`);
                            try {
                                const bundleDir = path.join(process.cwd(), 'public/Image/bundle');
                                if (fs.existsSync(bundleDir)) {
                                    const files = fs.readdirSync(bundleDir);
                                    // Find all html templates
                                    const htmlTemplates = files
                                        .filter(f => f.toLowerCase().endsWith('.html'))
                                        .map(f => ({
                                            name: f,
                                            time: fs.statSync(path.join(bundleDir, f)).mtime.getTime()
                                        }))
                                        .sort((a, b) => b.time - a.time);

                                    if (htmlTemplates.length > 0) {
                                        // Use the newest one
                                        const newest = htmlTemplates[0].name;
                                        console.log(`[Self-Healing] Found fallback: /Image/bundle/${newest}`);
                                        p = `/Image/bundle/${newest}`;
                                    }
                                }
                            } catch (e) {
                                console.error("[Self-Healing] Failed to find fallback:", e);
                            }
                        }
                    }

                    return { ...item, templatePath: p };
                })
            })) || [],
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
