import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

/**
 * Debug helper: dumps the Event catalogue. Admin-gated — this was previously
 * an open endpoint returning a full table to anonymous callers, which is both
 * unnecessary exposure of internal structure and a pattern worth not leaving
 * around for the next debug route someone adds.
 */
export async function GET(req: NextRequest) {
    try {
        const { user, error } = await verifyAuth(req);
        if (error || !user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const events = await prisma.event.findMany({
            orderBy: { createdDate: 'desc' }
        });
        return NextResponse.json({ success: true, count: events.length, events });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
