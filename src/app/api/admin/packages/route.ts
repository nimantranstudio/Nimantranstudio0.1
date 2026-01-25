import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    console.log('[API] GET /api/admin/packages started');
    try {
        const { prisma } = await import('@/lib/prisma');
        const packages = await prisma.package.findMany({
            orderBy: { level: 'asc' }
        });
        console.log(`[API] Packages found in DB: ${packages.length}`, packages.map(p => p.name));
        return NextResponse.json({ packages });
    } catch (error: any) {
        console.error('[API] FATAL ERROR fetching packages:', error);
        return NextResponse.json({
            error: error.message,
            stack: error.stack,
            message: "Failed to connect to database"
        }, { status: 500 });
    }
}
