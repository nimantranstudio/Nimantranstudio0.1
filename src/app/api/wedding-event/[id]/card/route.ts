import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';
import { uploadCardImage, deleteCardImage } from '@/lib/firebase-storage';
import { parseWeddingDate } from '@/lib/format-date';

export const dynamic = 'force-dynamic';

/** MAX(WeddingEvent.date) across the whole suite, +7 days — the whole suite's
 * cards expire together off the last ceremony, not each one individually. */
function computeExpiresAt(events: { date: string }[]): Date | null {
    let latest: Date | null = null;
    for (const e of events) {
        const d = parseWeddingDate(e.date);
        if (d && (!latest || d > latest)) latest = d;
    }
    if (!latest) return null;
    const expires = new Date(latest);
    expires.setDate(expires.getDate() + 7);
    return expires;
}

/**
 * Generates/regenerates the stored card image for one WeddingEvent. The
 * client already has the rendered card on screen (InvitationCard) and sends
 * up a captured PNG data URL; this just persists it — never re-renders
 * anything server-side.
 *
 * bundleItemId is accepted from the caller rather than re-derived here: the
 * dashboard already resolves which BundleItem/template this event maps to
 * (the same classifyEventType() matching used to build previewItems), so
 * re-doing that server-side would just duplicate logic the client already ran.
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { user, error } = await verifyAuth(req);
        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const event = await prisma.weddingEvent.findUnique({
            where: { id },
            include: {
                wedding: { select: { id: true, ownerId: true, events: { select: { date: true } } } },
                generatedCard: { select: { imageUrl: true } },
            },
        });
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        if (event.wedding.ownerId !== user.id) {
            // Deliberately 404, not 403 — don't confirm this id exists to a non-owner.
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const body = await req.json();
        const dataUrl = body?.dataUrl;
        const bundleItemId = typeof body?.bundleItemId === 'string' ? body.bundleItemId : undefined;
        if (!dataUrl || typeof dataUrl !== 'string') {
            return NextResponse.json({ error: 'dataUrl is required' }, { status: 400 });
        }

        // Replacing an existing card — drop the old file so storage doesn't
        // accumulate an orphaned image per edit.
        if (event.generatedCard?.imageUrl) {
            await deleteCardImage(event.generatedCard.imageUrl);
        }

        const imageUrl = await uploadCardImage(dataUrl, `${event.wedding.id}-${event.id}`);
        const expiresAt = computeExpiresAt(event.wedding.events);
        const now = new Date();

        const card = await prisma.generatedCard.upsert({
            where: { weddingEventId: event.id },
            create: {
                userId: user.id,
                weddingId: event.wedding.id,
                weddingEventId: event.id,
                bundleItemId,
                imageUrl,
                status: 'active',
                generatedAt: now,
                expiresAt,
            },
            update: {
                bundleItemId,
                imageUrl,
                status: 'active',
                generatedAt: now,
                expiresAt,
            },
        });

        return NextResponse.json({ success: true, card });
    } catch (error: any) {
        console.error('POST /api/wedding-event/[id]/card failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to save card' }, { status: 500 });
    }
}
