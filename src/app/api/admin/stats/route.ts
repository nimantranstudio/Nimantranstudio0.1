import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
