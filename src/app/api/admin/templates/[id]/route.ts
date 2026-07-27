import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

async function requireAdmin(request: NextRequest) {
    const { user, error } = await verifyAuth(request);
    if (error || user?.role !== 'admin') return null;
    return user;
}

// Get one template with its full layout (for the editor).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(request)))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await params;
        const template = await prisma.template.findUnique({ where: { id } });
        if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ template });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update a template's layout / metadata.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(request)))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, eventType, themeId, layout, status } = body;
        const template = await prisma.template.update({
            where: { id },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(eventType !== undefined ? { eventType } : {}),
                ...(themeId !== undefined ? { themeId } : {}),
                ...(layout !== undefined ? { layout } : {}),
                ...(status !== undefined ? { status } : {}),
            },
        });
        return NextResponse.json({ template });
    } catch (error: any) {
        console.error('Update template failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(request)))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id } = await params;
        await prisma.template.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
