
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const take = parseInt(searchParams.get('take') ?? '50');
        const skip = parseInt(searchParams.get('skip') ?? '0');

        const [total, events] = await Promise.all([
            prisma.event.count(),
            prisma.event.findMany({
                orderBy: { createdAt: 'desc' },
                take,
                skip
            })
        ]);

        return NextResponse.json({ success: true, count: events.length, total, events });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
