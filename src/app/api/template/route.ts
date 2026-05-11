import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import nodePath from 'path';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const templatePath = request.nextUrl.searchParams.get('path');

    if (!templatePath) {
        return new NextResponse('Missing path parameter', { status: 400 });
    }

    // Security: only allow paths under /Image/bundle/
    const normalised = templatePath.replace(/\\/g, '/');
    if (!normalised.startsWith('/Image/bundle/') || normalised.includes('..')) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        // Primary: serve from DB (works on Vercel where filesystem is read-only)
        const item = await prisma.bundleItem.findFirst({
            where: { templatePath },
            select: { templateContent: true }
        });

        if (item?.templateContent) {
            return new NextResponse(item.templateContent, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // Fallback: serve from local filesystem (dev env before DB migration)
        const fsPath = nodePath.join(process.cwd(), 'public', normalised);
        if (fs.existsSync(fsPath)) {
            const content = fs.readFileSync(fsPath, 'utf-8');
            return new NextResponse(content, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        return new NextResponse('Template not found', { status: 404 });
    } catch (error: any) {
        console.error('[template API] Error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
