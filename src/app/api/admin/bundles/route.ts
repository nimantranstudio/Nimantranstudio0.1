import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        const bundles = await prisma.bundle.findMany({
            orderBy: { createdAt: 'asc' }
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

        // Basic seeding logic if data is empty and we just want default bundles
        if (data.seed) {
            const count = await prisma.bundle.count();
            if (count > 0) {
                return NextResponse.json({ message: 'Bundles already seeded' });
            }

            const defaultBundles = [
                {
                    name: "WhatsApp Essentials",
                    subtitle: "Perfect for digital sharing with friends & family",
                    price: "₹999 only",
                    features: JSON.stringify([
                        "Covers any 6 wedding events",
                        "Image invites (mobile-optimized)",
                        "Short video invites (WhatsApp ready)",
                        "RSVP link with live guest count",
                        "Share instantly with one click"
                    ]),
                    printables: JSON.stringify([]),
                    isPopular: false,
                    theme: "default"
                },
                {
                    name: "WhatsApp + Posters",
                    subtitle: "Digital invites + venue-ready welcome boards",
                    price: "₹1,999",
                    features: JSON.stringify([
                        "Everything in WhatsApp Essentials",
                        "Covers any 9 wedding events",
                        "Image + Video invitations",
                        "Printable welcome posters",
                        "Advanced RSVP & guest tracking"
                    ]),
                    printables: JSON.stringify([
                        "Welcome Board – A1 (24×36 in)",
                        "Haldi Welcome – A2",
                        "Mehndi Welcome – A2",
                        "Sangeet Welcome – A2"
                    ]),
                    isPopular: true,
                    theme: "gold"
                },
                {
                    name: "Complete Wedding Suite",
                    subtitle: "For families who want everything perfectly coordinated",
                    price: "₹3,499",
                    features: JSON.stringify([
                        "Everything from Essentials + Posters",
                        "Covers all 12 wedding events",
                        "Complete wedding stationery set",
                        "Priority support",
                        "Custom illustration / motif"
                    ]),
                    printables: JSON.stringify([
                        "Save the Date • RSVP Card",
                        "Main Invite • Thank You",
                        "Welcome Board • Menu Card",
                        "Table Nos • Program Schedule",
                        "Gift Table Sign"
                    ]),
                    isPopular: false,
                    theme: "default"
                }
            ];

            await prisma.bundle.createMany({
                data: defaultBundles
            });

            return NextResponse.json({ success: true, message: 'Default bundles seeded' });
        }

        // Standard Create Logic
        const { name, price, subtitle, features, printables, isPopular, theme } = data;
        const bundle = await prisma.bundle.create({
            data: {
                name,
                price,
                subtitle,
                features: typeof features === 'string' ? features : JSON.stringify(features),
                printables: typeof printables === 'string' ? printables : JSON.stringify(printables),
                isPopular: !!isPopular,
                theme: theme || 'default'
            }
        });

        return NextResponse.json({ success: true, bundle });

    } catch (error: any) {
        console.error('Error in /api/admin/bundles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
