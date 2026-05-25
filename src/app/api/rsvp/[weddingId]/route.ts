import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';
import sanitizeHtml from 'sanitize-html';

export const dynamic = 'force-dynamic';

function sanitize(str: any): string {
    if (!str) return '';
    return sanitizeHtml(String(str), { allowedTags: [], allowedAttributes: {} });
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ weddingId: string }> }
) {
    try {
        const { weddingId } = await params;
        const body = await req.json();

        const rsvp = await prisma.rSVP.create({
            data: {
                weddingId: weddingId,
                guestName: sanitize(body.guestName),
                adultCount: parseInt(body.adultCount) || 1,
                childCount: parseInt(body.childCount) || 0,
                attending: body.status === 'attending',
                status: sanitize(body.status) || 'pending',
                phone: sanitize(body.phone),
                dietary: sanitize(body.dietary),
                message: sanitize(body.message),
            },
        });

        return NextResponse.json({ success: true, rsvp });
    } catch (error: any) {
        console.error('Error submitting RSVP:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ weddingId: string }> }
) {
    try {
        const { user, error } = await verifyAuth(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { weddingId } = await params;

        const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });
        if (!wedding || wedding.ownerId !== user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const rsvps = await prisma.rSVP.findMany({
            where: { weddingId: weddingId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, rsvps });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
