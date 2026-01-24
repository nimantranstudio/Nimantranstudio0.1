"use client";

import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from "./blogs.module.css";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";

const BLOG_POSTS = [
    // ... (posts remain same, but I can't skip lines in replacement) 
    // Wait, replacing the whole top part is better.
    {
        id: 1,
        title: "The Ultimate Guide to WhatsApp Wedding Invitations",
        category: "SHARING TIPS",
        date: "OCT 24, 2024",
        excerpt: "How to share your joy with relatives and friends in a way that feels personal, respectful, and modern.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80\u0026w=1000\u0026auto=format\u0026fit=crop"
    },
    {
        id: 2,
        title: "How to Manage Guest Lists for Large Indian Weddings",
        category: "COORDINATION",
        date: "OCT 20, 2024",
        excerpt: "Streamlining your RSVP process using digital tools without losing the 'family-first' touch.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80\u0026w=1000\u0026auto=format\u0026fit=crop"
    },
    {
        id: 3,
        title: "Traditional vs. Modern: Finding the Perfect Theme",
        category: "DESIGN",
        date: "OCT 15, 2024",
        excerpt: "Why consistency in design across all your wedding functions creates a more memorable experience for your guests.",
        image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80\u0026w=1000\u0026auto=format\u0026fit=crop"
    }
];

export default function BlogsPage() {
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Blogs', active: true },
                        ]}
                    />
                </div>
            </header>

            <div className="container">
                <div className={styles.hero}>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Wedding Insights
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Thoughtful advice on wedding coordination, digital etiquette, and creating a celebration that stays in hearts forever.
                    </motion.p>
                </div>

                <section className={styles.grid}>
                    {BLOG_POSTS.map((post, index) => (
                        <motion.article
                            key={post.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className={styles.meta}>
                                <span className={styles.category}>{post.category}</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.date}>{post.date}</span>
                            </div>
                            <h2 className={styles.blogTitle}>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            <Link href={`/blogs/${post.id}`} className={styles.readMore}>
                                READ ARTICLE <MoveRight size={18} />
                            </Link>
                        </motion.article>
                    ))}
                </section>
            </div>
        </main>
    );
}
