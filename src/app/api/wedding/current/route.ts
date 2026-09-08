import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

/**
 * The authenticated user's current invitation suite — the most recently created
 * Wedding row, with its events (including their real DB ids, which the client-side
 * Zustand store never carries — see the comment in wedding-store.ts's saveWedding).
 *
 * "Most recent" stands in for a proper single-suite-per-user model: /api/wedding's
 * POST handler creates a fresh Wedding + WeddingEvent set on every authenticated
 * save rather than updating in place (a pre-existing, documented tradeoff — see
 * that route's comments), so a user can technically accumulate multiple Wedding
 * rows. This is the same "most recent wins" resolution the client already uses
 * via lastSavedWeddingId; the dashboard just also needs it server-side now that
 * edits must persist to a specific, addressable row.
 */
export async function GET(req: NextRequest) {
    try {
        const { user, error } = await verifyAuth(req);
        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wedding = await prisma.wedding.findFirst({
            where: { ownerId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                events: {
                    include: { generatedCard: { select: { imageUrl: true, status: true } } },
                },
            },
        });

        if (!wedding) {
            return NextResponse.json({ wedding: null });
        }

        return NextResponse.json({ wedding });
    } catch (error: any) {
        console.error('GET /api/wedding/current failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to load wedding' }, { status: 500 });
    }
}
