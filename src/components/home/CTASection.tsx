'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export const CTASection = () => {
    return (
        <section className={styles.ctaSection}>
            <div className="container">
                <div className={styles.ctaContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className={styles.ctaLabel}>BEGIN YOUR CELEBRATION TODAY</span>
                        <h2 className={styles.ctaTitle}>
                            Ready to invite your guests <br />
                            with <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>elegance?</span>
                        </h2>
                        <p className={styles.ctaDescription}>
                            Create and download your digital invitation suite in less than
                            <br className="hidden md:block" /> 5 minutes. No designer needed.
                        </p>

                        <Link href="/themes" className={styles.ctaButton}>
                            GET STARTED NOW
                        </Link>

                        <p className={styles.ctaFooter}>
                            Designed for WhatsApp-first wedding invitations
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
