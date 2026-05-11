import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const [themesCount, bundlesCount, weddingsCount, rsvpsCount] = await Promise.all([
            prisma.theme.count(),
            prisma.bundle.count(),
            prisma.wedding.count(),
            prisma.rSVP.count()
        ]);

        return NextResponse.json({
            themesCount,
            bundlesCount,
            weddingsCount,
            rsvpsCount,
            revenue: 1240 // Hardcoded for now until payment integration exists
        });
    } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
