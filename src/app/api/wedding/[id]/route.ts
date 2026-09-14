import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        let wedding = null;
        if (id === 'latest') {
            wedding = await prisma.wedding.findFirst({
                orderBy: { createdAt: 'desc' },
                include: {
                    events: {
                        include: { generatedCard: true },
                    },
                },
            });
        } else {
            wedding = await prisma.wedding.findFirst({
                where: {
                    OR: [{ id }, { slug: id }],
                },
                include: {
                    events: {
                        include: { generatedCard: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        if (!wedding) {
            return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, wedding });
    } catch (error: any) {
        console.error(`GET /api/wedding/${id} failed:`, error);
        return NextResponse.json({ error: error.message || 'Failed to fetch wedding' }, { status: 500 });
    }
}
