import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();

        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        
        const data = await request.json();

        // Ensure unique slug
        let slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let existing = await prisma.blog.findUnique({ where: { slug } });
        let counter = 1;
        while (existing) {
            slug = `${data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${counter}`;
            existing = await prisma.blog.findUnique({ where: { slug } });
            counter++;
        }

        const newBlog = await prisma.blog.create({
            data: {
                title: data.title,
                slug,
                category: data.category || 'Uncategorized',
                date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: data.readTime || '5 min read',
                excerpt: data.excerpt || '',
                image: data.image || '',
                content: data.content || '',
                metaDescription: data.metaDescription || '',
                published: data.published || false
            }
        });

        return NextResponse.json(newBlog);
    } catch (error) {
        console.error('Failed to create blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}
