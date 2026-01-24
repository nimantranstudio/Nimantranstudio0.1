import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        const bundles = await prisma.bundle.findMany({
            include: { themeRef: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ bundles });
    } catch (error: any) {
        console.error('Failed to fetch bundles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const data = await request.json();

        // Seeding logic
        if (data.seed) {
            const count = await prisma.bundle.count();
            if (count > 0) return NextResponse.json({ message: 'Bundles already seeded' });

            const theme = await prisma.theme.findFirst();

            const defaultBundles = [
                {
                    name: "WhatsApp Essentials",
                    price: "999",
                    description: "Perfect for digital sharing with friends & family",
                    isActive: true,
                    themeId: theme?.id || null,
                    checklist: JSON.stringify(["Image Invitations", "Video Invitations", "RSVP Link"]),
                    highlights: "• Ready in 2-5 Minutes\n• Optimized for WhatsApp\n• No Watermark",
                    isPopular: false
                },
                {
                    name: "WhatsApp + Posters",
                    price: "1999",
                    description: "Digital invites + venue-ready welcome boards",
                    isActive: true,
                    themeId: theme?.id || null,
                    checklist: JSON.stringify(["Image Invitations", "Video Invitations", "RSVP Link", "Printable Posters"]),
                    highlights: "• Everything in Essentials\n• High-Res Print PDF\n• A3 & A4 Dimensions",
                    isPopular: true
                }
            ];

            await prisma.bundle.createMany({ data: defaultBundles });
            return NextResponse.json({ success: true, message: 'Default bundles seeded' });
        }

        // Standard Create Logic
        const { name, price, description, highlights, checklist, isActive, themeId, isPopular } = data;
        const bundle = await prisma.bundle.create({
            data: {
                name,
                price: String(price),
                description,
                highlights,
                checklist: typeof checklist === 'string' ? checklist : JSON.stringify(checklist),
                isActive: isActive !== undefined ? isActive : true,
                isPopular: !!isPopular,
                themeId: themeId || null,
            }
        });

        return NextResponse.json({ success: true, bundle });
    } catch (error: any) {
        console.error('Error in /api/admin/bundles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
