import { BLOG_POSTS } from '../blogs/blogData';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

export async function GET() {
    const baseUrl = 'https://www.nimantranstudio.in';

    let themeRoutes: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];
    let dbBlogRoutes: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];

    // 1. Fetch dynamic active themes
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        themeRoutes = themes.map((theme) => ({
            url: `${baseUrl}/themes/${theme.id}`,
            lastmod: (theme.updatedAt || new Date()).toISOString(),
            changefreq: 'weekly',
            priority: '0.8',
        }));
    } catch (error) {
        console.error('Failed to fetch themes for sitemap:', error);
    }

    // 2. Fetch dynamic database published blogs
    try {
        const dbBlogs = await prisma.blog.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true, createdAt: true },
        });

        dbBlogRoutes = dbBlogs.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastmod: (blog.updatedAt || blog.createdAt || new Date()).toISOString(),
            changefreq: 'weekly',
            priority: '0.7',
        }));
    } catch (error) {
        console.error('Failed to fetch db blogs for sitemap:', error);
    }

    // 3. Fallback static blog posts
    const staticBlogRoutes = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
    }));

    // Deduplicate blog routes by URL
    const seenBlogUrls = new Set<string>();
    const uniqueBlogRoutes: typeof dbBlogRoutes = [];
    for (const route of [...dbBlogRoutes, ...staticBlogRoutes]) {
        if (!seenBlogUrls.has(route.url)) {
            seenBlogUrls.add(route.url);
            uniqueBlogRoutes.push(route);
        }
    }

    // 4. Core static pages
    const now = new Date().toISOString();
    const staticRoutes = [
        { url: `${baseUrl}`, lastmod: now, changefreq: 'daily', priority: '1.0' },
        { url: `${baseUrl}/themes`, lastmod: now, changefreq: 'daily', priority: '0.9' },
        { url: `${baseUrl}/pricing`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
        { url: `${baseUrl}/blogs`, lastmod: now, changefreq: 'daily', priority: '0.8' },
        { url: `${baseUrl}/about`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
        { url: `${baseUrl}/privacy`, lastmod: now, changefreq: 'monthly', priority: '0.3' },
        { url: `${baseUrl}/terms`, lastmod: now, changefreq: 'monthly', priority: '0.3' },
        { url: `${baseUrl}/refund-policy`, lastmod: now, changefreq: 'monthly', priority: '0.3' },
    ];

    const allRoutes = [...staticRoutes, ...themeRoutes, ...uniqueBlogRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
    .map(
        (r) => `  <url>
    <loc>${r.url}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

    return new Response(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
