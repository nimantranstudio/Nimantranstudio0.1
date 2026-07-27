import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

async function requireAdmin(request: NextRequest) {
    const { user, error } = await verifyAuth(request);
    if (error || user?.role !== 'admin') return null;
    return user;
}

// List templates (metadata only — layout omitted for a lighter list).
export async function GET(request: NextRequest) {
    if (!(await requireAdmin(request)))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const templates = await prisma.template.findMany({
            orderBy: { updatedAt: 'desc' },
            select: { id: true, name: true, eventType: true, themeId: true, status: true, updatedAt: true },
        });
        return NextResponse.json({ templates });
    } catch (error: any) {
        console.error('List templates failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Create a template from a CardDocument layout.
export async function POST(request: NextRequest) {
    if (!(await requireAdmin(request)))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await request.json();
        const { name, eventType, themeId, layout, status } = body;
        if (!name || !layout) {
            return NextResponse.json({ error: 'name and layout are required' }, { status: 400 });
        }
        const template = await prisma.template.create({
            data: {
                name,
                eventType: eventType ?? null,
                themeId: themeId ?? null,
                layout,
                status: status === 'ready' ? 'ready' : 'draft',
            },
        });
        return NextResponse.json({ template });
    } catch (error: any) {
        console.error('Create template failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
