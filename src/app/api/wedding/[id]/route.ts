import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

/**
 * A wedding the CALLER OWNS, by id/slug — or `latest` for their most recent one.
 *
 * Authenticated and ownership-scoped. This was previously fully open: any
 * anonymous request could read any wedding by id, and `latest` returned the
 * newest wedding in the entire database — so the public /preview page was
 * showing whichever real customer had signed up most recently (their names,
 * parents' names, venue and rsvpContact phone number) to every visitor.
 *
 * The guest-facing invitation is unaffected: /rsvp/[id] is a server component
 * that queries Prisma directly and deliberately exposes only what an invited
 * guest needs. This route serves the owner's own dashboard/preview, and an
 * unauthenticated preview visitor now simply falls back to the placeholder
 * slug that page already computes from its local form state.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { user, error } = await verifyAuth(req);
        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const where =
            id === 'latest'
                ? { ownerId: user.id }
                : { ownerId: user.id, OR: [{ id }, { slug: id }] };

        const wedding = await prisma.wedding.findFirst({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                events: {
                    include: { generatedCard: true },
                },
            },
        });

        if (!wedding) {
            // Deliberately 404, not 403 — don't confirm an id exists to a non-owner.
            return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, wedding });
    } catch (error: any) {
        console.error(`GET /api/wedding/${id} failed:`, error);
        return NextResponse.json({ error: error.message || 'Failed to fetch wedding' }, { status: 500 });
    }
}
