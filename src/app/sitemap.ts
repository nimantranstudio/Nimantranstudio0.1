import { MetadataRoute } from 'next';
import { BLOG_POSTS } from './blogs/blogData';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://nimantranstudio.com';

    // Fetch dynamic themes
    const themes = await prisma.theme.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true }
    });

    const themeRoutes = themes.map((theme) => ({
        url: `${baseUrl}/themes/${theme.id}`,
        lastModified: theme.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const blogRoutes = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(), // Using current date as blogData doesn't have a strict lastModified field
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/themes`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/rsvp`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ];

    return [...staticRoutes, ...themeRoutes, ...blogRoutes];
}
