
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, count: events.length, events });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
