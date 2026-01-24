import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ weddingId: string }> }
) {
    try {
        const { weddingId } = await params;
        const body = await req.json();

        const rsvp = await prisma.rSVP.create({
            data: {
                weddingId: weddingId,
                guestName: body.guestName,
                adultCount: parseInt(body.adultCount) || 1,
                childCount: parseInt(body.childCount) || 0,
                attending: body.status === 'attending',
                status: body.status || 'pending',
                phone: body.phone,
                dietary: body.dietary,
                message: body.message,
            },
        });

        return NextResponse.json({ success: true, rsvp });
    } catch (error: any) {
        console.error('Error submitting RSVP:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ weddingId: string }> }
) {
    try {
        const { weddingId } = await params;

        const rsvps = await prisma.rSVP.findMany({
            where: { weddingId: weddingId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, rsvps });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
