import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const events = await prisma.event.findMany({
            orderBy: { eventName: 'asc' }
        });

        return NextResponse.json({ events });
    } catch (error: any) {
        console.error('Failed to fetch events:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
