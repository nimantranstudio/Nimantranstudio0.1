import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, MoveRight } from 'lucide-react';
import { getPrisma } from '@/lib/prisma';
import styles from './post.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const prisma = getPrisma();
    const post = await prisma.blog.findUnique({ where: { slug } });
    
    if (!post) return { title: 'Post Not Found | Nimantran Studio' };
    return {
        title: `${post.title} | Nimantran Studio Blog`,
        description: post.metaDescription,
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
            type: 'article',
            siteName: 'Nimantran Studio',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription,
            images: [post.image],
        },
    };
}

function renderContent(markdown: string) {
    const lines = markdown.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (!line) { i++; continue; }

        if (line.startsWith('## ')) {
            elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
        } else if (line.startsWith('### ')) {
            elements.push(<h3 key={key++}>{line.slice(4)}</h3>);
        } else if (line === '---') {
            elements.push(<hr key={key++} />);
        } else if (line.startsWith('| ')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i].trim());
                i++;
            }
            const [header, , ...rows] = tableLines;
            const headers = header.split('|').filter(Boolean).map(h => h.trim());
            elements.push(
                <div key={key++} className={styles.tableWrapper}>
                    <table>
                        <thead>
                            <tr>{headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {rows.map((row, j) => (
                                <tr key={j}>
                                    {row.split('|').filter(Boolean).map((cell, k) => <td key={k}>{cell.trim()}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            continue;
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            const items: string[] = [];
            while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
                items.push(lines[i].trim().slice(2));
                i++;
            }
            elements.push(
                <ul key={key++}>
                    {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />)}
                </ul>
            );
            continue;
        } else if (/^\d+\.\s/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
                i++;
            }
            elements.push(
                <ol key={key++}>
                    {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />)}
                </ol>
            );
            continue;
        } else {
            elements.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />);
        }

        i++;
    }

    return elements;
}

function inlineFormat(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const prisma = getPrisma();
    const post = await prisma.blog.findUnique({ where: { slug } });
    if (!post) notFound();

    const related = await prisma.blog.findMany({
        where: { published: true, slug: { not: slug } },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className={styles.page}>
            {/* Back nav */}
            <div className={styles.backBar}>
                <div className="container">
                    <Link href="/blogs" className={styles.backLink}>
                        <ArrowLeft size={16} /> All Articles
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <div className={styles.heroSection}>
                <div className={styles.heroInner}>
                    <div className={styles.postMeta}>
                        <span className={styles.category}>{post.category}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.metaItem}><Calendar size={13} />{post.date}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.metaItem}><Clock size={13} />{post.readTime}</span>
                    </div>
                    <h1 className={styles.postTitle}>{post.title}</h1>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.authorRow}>
                        <div className={styles.authorAvatar}>N</div>
                        <div>
                            <div className={styles.authorName}>Nimantran Studio</div>
                            <div className={styles.authorRole}>Wedding Planning Experts</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="container">
                <div className={styles.coverWrapper}>
                    <Image
                        src={post.image || '/logo.png'}
                        alt={post.title}
                        fill
                        className={styles.coverImage}
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </div>

                {/* Article Body */}
                <div className={styles.articleLayout}>
                    <article className={styles.articleBody}>
                        {renderContent(post.content)}
                    </article>

                    {/* Sidebar CTA */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <p className={styles.sidebarEyebrow}>Ready to start?</p>
                            <h3 className={styles.sidebarTitle}>Create your wedding invitation in minutes</h3>
                            <p className={styles.sidebarText}>
                                Beautiful designs, built-in RSVP, and WhatsApp-ready sharing — all from ₹999.
                            </p>
                            <Link href="https://nimantranstudio.com" className={styles.sidebarBtn}>
                                Start for Free →
                            </Link>
                        </div>

                        <div className={styles.sidebarLinks}>
                            <p className={styles.sidebarLinksTitle}>More articles</p>
                            {related.map(r => (
                                <Link key={r.slug} href={`/blogs/${r.slug}`} className={styles.sidebarLink}>
                                    <span>{r.title}</span>
                                    <MoveRight size={14} />
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>

                {/* Related Posts */}
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Keep Reading</h2>
                    <div className={styles.relatedGrid}>
                        {related.map(r => (
                            <Link key={r.slug} href={`/blogs/${r.slug}`} className={styles.relatedCard}>
                                <div className={styles.relatedImage}>
                                    <Image src={r.image} alt={r.title} fill className={styles.image} sizes="400px" />
                                </div>
                                <div className={styles.relatedBody}>
                                    <span className={styles.category}>{r.category}</span>
                                    <p className={styles.relatedPostTitle}>{r.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
