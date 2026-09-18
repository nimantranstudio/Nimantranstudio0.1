'use client';

import { useState, useEffect } from 'react';
import styles from './TestimonialSection.module.css';
import { Star, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        quote: "We were honestly stressed about managing guest confirmations, but Nimantran made everything incredibly simple. The invites felt elegant and modern, and tracking responses saved us so much time. It felt like having a wedding assistant in our pocket.",
        author: "Amit & Sneha",
        detail: "Married Feb 2026 · Mumbai"
    },
    {
        quote: "What we loved most was how fast everything worked. We created our invites in minutes, shared them instantly on WhatsApp, and started getting responses the same day. Clean design, smooth experience — exactly what modern weddings need.",
        author: "Karan & Meera",
        detail: "Married Nov 2025 · Bengaluru"
    },
    {
        quote: "Our families are not very tech-savvy, but even they found Nimantran easy to understand. The RSVP dashboard was a game changer, and the overall experience felt premium yet simple. We would definitely recommend it to every couple.",
        author: "Siddharth & Ananya",
        detail: "Married Jan 2026 · Hyderabad"
    },
    {
        quote: "We wanted simple but elegant invites, and Nimantran made the whole process so smooth. The invites looked amazing, sharing them on WhatsApp was super easy, and the guest tracking was a total lifesaver. 10/10 experience — highly recommend.",
        author: "Rohan & Trisha",
        detail: "Married March 2026"
    }
];

export function TestimonialSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 8500); // 8.5 seconds per testimonial for relaxed reading
        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.testimonialSection}>
            <div className="container">
                <div className={styles.header}>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Families who simplified their wedding communication
                    </motion.h2>
                </div>

                <div className={styles.carouselWrapper}>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={index}
                            className={styles.content}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={styles.starIcon} fill="currentColor" />
                                ))}
                            </div>

                            <blockquote className={styles.quote}>
                                "{testimonials[index].quote}"
                            </blockquote>

                            <div className={styles.author}>
                                <strong>{testimonials[index].author}</strong>
                                <span>{testimonials[index].detail}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className={styles.dots}>
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === index ? styles.activeDot : ''}`}
                                onClick={() => setIndex(i)}
                                aria-label={`View testimonial ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Google Reviews Button */}
                    <motion.div
                        className={styles.reviewWrapper}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <a
                            href="https://maps.app.goo.gl/LJwDf3RsQzzYS2s39"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.googleReviewBtn}
                        >
                            <svg className={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Google Reviews</span>
                            <ArrowUpRight size={16} className={styles.arrowIcon} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
