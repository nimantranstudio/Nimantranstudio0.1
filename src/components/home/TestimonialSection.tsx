import styles from './TestimonialSection.module.css';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function TestimonialSection() {
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

                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={styles.starIcon} fill="currentColor" />
                        ))}
                    </div>

                    <blockquote className={styles.quote}>
                        "We wanted simple but elegant invites, and Nimantran made the whole process so smooth. The invites looked amazing, sharing them on WhatsApp was super easy, and the guest tracking was a total lifesaver. 10/10 experience — highly recommend."
                    </blockquote>

                    <div className={styles.author}>
                        <strong>Rohan & Trisha</strong>
                        <span>Married March 2026 - Pune</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
