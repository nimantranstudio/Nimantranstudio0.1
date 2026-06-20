import { PrismaClient } from '../src/generated/client_new';
import { BLOG_POSTS } from '../src/app/blogs/blogData';

const prisma = new PrismaClient();

async function main() {
    console.log(`Starting migration of ${BLOG_POSTS.length} blogs...`);

    for (const post of BLOG_POSTS) {
        try {
            const existing = await prisma.blog.findUnique({
                where: { slug: post.slug }
            });

            if (!existing) {
                await prisma.blog.create({
                    data: {
                        slug: post.slug,
                        title: post.title,
                        category: post.category,
                        date: post.date,
                        readTime: post.readTime,
                        excerpt: post.excerpt,
                        image: post.image,
                        content: post.content,
                        metaDescription: post.metaDescription,
                        published: true, // Existing blogs should be published
                    }
                });
                console.log(`✅ Migrated: ${post.slug}`);
            } else {
                console.log(`⏭️  Skipped (already exists): ${post.slug}`);
            }
        } catch (error) {
            console.error(`❌ Error migrating ${post.slug}:`, error);
        }
    }

    console.log('Migration complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
