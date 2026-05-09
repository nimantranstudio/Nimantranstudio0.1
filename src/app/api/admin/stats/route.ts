import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const getCachedStats = unstable_cache(
    async () => {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const [themesCount, bundlesCount, weddingsCount, rsvpsCount, revenueResult] = await Promise.all([
            prisma.theme.count(),
            prisma.bundle.count(),
            prisma.wedding.count(),
            prisma.rSVP.count(),
            prisma.order.aggregate({
                _sum: {
                    totalAmount: true
                },
                where: {
                    status: 'completed'
                }
            })
        ]);

        return {
            themesCount,
            bundlesCount,
            weddingsCount,
            rsvpsCount,
            revenue: revenueResult._sum.totalAmount || 0
        };
    },
    ['admin-stats'],
    { revalidate: 60, tags: ['admin-stats'] }
);

export async function GET() {
    try {
        const stats = await getCachedStats();
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
