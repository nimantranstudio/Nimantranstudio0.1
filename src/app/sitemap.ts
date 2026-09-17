import { MetadataRoute } from 'next';
import { BLOG_POSTS } from './blogs/blogData';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.nimantranstudio.in';

    let themeRoutes: MetadataRoute.Sitemap = [];
    let dbBlogRoutes: MetadataRoute.Sitemap = [];

    // 1. Fetch dynamic active themes
    try {
        const themes = await prisma.theme.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true }
        });

        themeRoutes = themes.map((theme) => ({
            url: `${baseUrl}/themes/${theme.id}`,
            lastModified: theme.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Failed to fetch themes for sitemap:', error);
    }

    // 2. Fetch dynamic database published blogs
    try {
        const dbBlogs = await prisma.blog.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true, createdAt: true }
        });

        dbBlogRoutes = dbBlogs.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastModified: blog.updatedAt || blog.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Failed to fetch db blogs for sitemap:', error);
    }

    // 3. Fallback static blog posts
    const staticBlogRoutes = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Deduplicate blog routes by URL
    const seenBlogUrls = new Set<string>();
    const uniqueBlogRoutes: MetadataRoute.Sitemap = [];
    for (const route of [...dbBlogRoutes, ...staticBlogRoutes]) {
        if (!seenBlogUrls.has(route.url)) {
            seenBlogUrls.add(route.url);
            uniqueBlogRoutes.push(route);
        }
    }

    // 4. Core static pages
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/themes`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
    ];

    return [...staticRoutes, ...themeRoutes, ...uniqueBlogRoutes];
}
