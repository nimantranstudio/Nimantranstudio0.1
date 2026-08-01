import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public read of a designed template's CardDocument layout, so customer card
// surfaces can render a `structured:<id>` item directly, independent of what the
// (cached) theme payload or persisted store happens to carry. The layout is just
// the card's design (already visible on the rendered card) — nothing sensitive.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const template = await prisma.template.findUnique({
            where: { id },
            select: { id: true, name: true, layout: true },
        });
        if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(
            { template },
            { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
