'use client';

import { useState, useEffect } from 'react';
import styles from './TestimonialSection.module.css';
import { Star } from 'lucide-react';
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
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            className={styles.content}
                            initial={{ opacity: 0, x: 20, scale: 0.995 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 1.005 }}
                            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
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
                </div>
            </div>
        </section>
    );
}
