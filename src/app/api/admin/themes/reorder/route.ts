import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-server';

export async function PUT(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderedIds } = body;

        if (!Array.isArray(orderedIds)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        // Perform updates in a transaction
        await prisma.$transaction(
            orderedIds.map((id: string, index: number) =>
                prisma.theme.update({
                    where: { id },
                    data: { sequence: index },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to reorder themes:', error);
        return NextResponse.json({
            error: 'Database Connection Failed',
            details: error.message
        }, { status: 500 });
    }
}
