import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const { name, price, description, highlights, checklist, isActive, themeId, isPopular } = data;

        const bundle = await prisma.bundle.update({
            where: { id },
            data: {
                name,
                price: String(price),
                description,
                highlights,
                checklist: typeof checklist === 'string' ? checklist : JSON.stringify(checklist),
                isActive: isActive !== undefined ? isActive : true,
                isPopular: !!isPopular,
                themeId: themeId || null,
            }
        });

        return NextResponse.json({ success: true, bundle });
    } catch (error: any) {
        console.error('Error updating bundle:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        await prisma.bundle.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting bundle:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
