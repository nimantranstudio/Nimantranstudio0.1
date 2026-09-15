import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const [themesCount, bundlesCount, weddingsCount, rsvpsCount, revenueAgg] = await Promise.all([
            prisma.theme.count(),
            prisma.bundle.count(),
            prisma.wedding.count(),
            prisma.rSVP.count(),
            // Used to be a hardcoded placeholder (revenue: 1240). The full
            // day-wise breakdown and per-payment history live on their own
            // page (/admin/revenue, linked from this card) — this card only
            // needs the headline total.
            prisma.order.aggregate({ _sum: { totalAmount: true } })
        ]);

        return NextResponse.json({
            themesCount,
            bundlesCount,
            weddingsCount,
            rsvpsCount,
            revenue: revenueAgg._sum.totalAmount || 0
        });
    } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
