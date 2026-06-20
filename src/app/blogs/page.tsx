import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MoveRight, Clock, BookOpen } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getPrisma } from '@/lib/prisma';
import styles from './blogs.module.css';

export const metadata: Metadata = {
    title: 'Wedding Planning Blog & Insights | Nimantran Studio',
    description: 'Expert advice on digital wedding invitations, RSVP management, WhatsApp wedding cards, and wedding planning tips for Indian couples. Written by the Nimantran Studio team.',
    openGraph: {
        title: 'Wedding Planning Blog | Nimantran Studio',
        description: 'Expert advice for Indian couples on digital invitations, RSVP management, and wedding planning.',
        type: 'website',
    },
};

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
    const prisma = getPrisma();
    const allBlogs = await prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
    });

    const featured = allBlogs.length > 0 ? allBlogs[0] : null;
    const rest = allBlogs.length > 1 ? allBlogs.slice(1) : [];

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Blog', active: true },
                        ]}
                    />
                </div>
            </header>

            <div className="container">
                {/* Hero */}
                <div className={styles.hero}>
                    <span className={styles.heroEyebrow}>THE NIMANTRAN JOURNAL</span>
                    <h1 className={styles.title}>Wedding Insights</h1>
                    <p className={styles.subtitle}>
                        Expert advice on digital invitations, RSVP management, and creating a celebration your guests will remember.
                    </p>
                </div>

                {!featured ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#F9FAFB', borderRadius: '1rem', color: '#6B7280' }}>
                        No blogs published yet. Check back soon!
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        <Link href={`/blogs/${featured.slug}`} className={styles.featuredCard}>
                            <div className={styles.featuredImage}>
                                <Image
                                    src={featured.image || '/logo.png'}
                                    alt={featured.title}
                                    fill
                                    className={styles.image}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                />
                                <span className={styles.featuredBadge}>Featured</span>
                            </div>
                    <div className={styles.featuredContent}>
                        <div className={styles.meta}>
                            <span className={styles.category}>{featured.category}</span>
                            <span className={styles.separator}>·</span>
                            <span className={styles.date}>{featured.date}</span>
                            <span className={styles.separator}>·</span>
                            <span className={styles.readTime}><Clock size={13} /> {featured.readTime}</span>
                        </div>
                        <h2 className={styles.featuredTitle}>{featured.title}</h2>
                        <p className={styles.excerpt}>{featured.excerpt}</p>
                        <span className={styles.readMore}>
                            READ ARTICLE <MoveRight size={16} />
                        </span>
                    </div>
                </Link>

                {/* Post Grid */}
                <section className={styles.grid}>
                    {rest.map((post) => (
                        <Link key={post.slug} href={`/blogs/${post.slug}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={post.image || '/logo.png'}
                                    alt={post.title}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.meta}>
                                    <span className={styles.category}>{post.category}</span>
                                    <span className={styles.separator}>·</span>
                                    <span className={styles.date}>{post.date}</span>
                                </div>
                                <h2 className={styles.blogTitle}>{post.title}</h2>
                                <p className={styles.excerpt}>{post.excerpt}</p>
                                <span className={styles.readMore}>
                                    READ ARTICLE <MoveRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
                </>
                )}

                {/* Newsletter CTA */}
                <div className={styles.newsletter}>
                    <BookOpen size={32} className={styles.newsletterIcon} />
                    <h3 className={styles.newsletterTitle}>More wedding insights, straight to you</h3>
                    <p className={styles.newsletterText}>
                        Join thousands of Indian couples who read our weekly guide on planning a stress-free wedding.
                    </p>
                    <Link href="https://nimantranstudio.com" className={styles.newsletterBtn}>
                        Start Planning Your Wedding →
                    </Link>
                </div>
            </div>
        </main>
    );
}
