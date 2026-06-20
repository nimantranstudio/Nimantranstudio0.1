import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        const { id } = await params;

        const blog = await prisma.blog.findUnique({
            where: { id }
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        const { id } = await params;
        const data = await request.json();

        // Check if slug is being updated and is unique
        if (data.slug) {
            const existing = await prisma.blog.findFirst({
                where: { slug: data.slug, NOT: { id } }
            });
            if (existing) {
                return NextResponse.json({ error: 'Slug is already in use' }, { status: 400 });
            }
        }

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                category: data.category,
                date: data.date,
                readTime: data.readTime,
                excerpt: data.excerpt,
                image: data.image,
                content: data.content,
                metaDescription: data.metaDescription,
                published: data.published
            }
        });

        return NextResponse.json(updatedBlog);
    } catch (error) {
        console.error('Failed to update blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        const { id } = await params;

        await prisma.blog.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
