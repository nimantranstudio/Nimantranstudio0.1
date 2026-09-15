import { NextRequest, NextResponse } from 'next/server';

// Auth is enforced by middleware.ts (all /api/admin/* routes require an
// admin session) — matches the existing pattern in /api/admin/bundles/[id].
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        // Cascades to WeddingEvent, RSVP and GeneratedCard per schema.prisma.
        // Order rows are untouched (Order.weddingId is a plain field, not an
        // enforced relation) — deleting a wedding never erases billing history.
        await prisma.wedding.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting wedding:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
