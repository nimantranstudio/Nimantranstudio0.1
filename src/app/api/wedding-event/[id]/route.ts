import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';
import sanitizeHtml from 'sanitize-html';

export const dynamic = 'force-dynamic';

function sanitize(str: any): string {
    if (!str) return '';
    return sanitizeHtml(String(str), { allowedTags: [], allowedAttributes: {} });
}

/**
 * Updates a single WeddingEvent's editable fields — Name, Date, Time, Venue — the
 * only four fields the Dashboard "Edit" flow exposes. A real update against the
 * existing row, never a create: this is what keeps a Dashboard edit from adding a
 * duplicate event/card, and what makes the change visible immediately in
 * preview/download/share (they already read event.name/date/time/venue) and durable
 * across refreshes (unlike the client-only Zustand store this event also lives in).
 *
 * The template/design identity (BundleItem.eventId -> Event.id -> {bundleId}_
 * {eventId}_{eventName}.html) is never touched here — this only ever updates
 * WeddingEvent, the couple's own data for that ceremony, not which template it maps to.
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { user, error } = await verifyAuth(req);
        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existing = await prisma.weddingEvent.findUnique({
            where: { id },
            include: { wedding: { select: { ownerId: true } } },
        });
        if (!existing) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        if (existing.wedding.ownerId !== user.id) {
            // Deliberately 404, not 403 — don't confirm this id exists to a non-owner.
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const body = await req.json();
        const data: { name?: string; date?: string; time?: string; venue?: string } = {};
        if (body.name !== undefined) data.name = sanitize(body.name);
        if (body.date !== undefined) data.date = sanitize(body.date);
        if (body.time !== undefined) data.time = sanitize(body.time);
        if (body.venue !== undefined) data.venue = sanitize(body.venue);

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 });
        }

        const updated = await prisma.weddingEvent.update({ where: { id }, data });

        return NextResponse.json({ success: true, event: updated });
    } catch (error: any) {
        console.error('PATCH /api/wedding-event/[id] failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 500 });
    }
}
