'use client';

import { motion } from 'framer-motion';
import styles from '@/app/page.module.css';

const FEATURES = [
    {
        title: "One-Time Form",
        desc: "No repetitive typing. Fill once, generate all."
    },
    {
        title: "Consistent Design",
        desc: "Every card and video matches your theme perfectly."
    },
    {
        title: "WhatsApp First",
        desc: "Sized and optimized exactly for WhatsApp sharing."
    },
    {
        title: "Family Approved",
        desc: "Respectful, traditional, and easy for elders to read."
    }
];

export const FeaturesSection = () => {
    return (
        <section className={styles.featuresDark}>
            <div className="container">
                <div className={styles.featuresDarkHeader}>
                    <h2 className={styles.featuresDarkTitle}>
                        Designed for the Indian Wedding
                    </h2>
                </div>

                <div className={styles.featuresDarkGrid}>
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <h3 className={styles.featuresDarkItemTitle}>
                                {f.title}
                            </h3>
                            <p className={styles.featuresDarkItemDesc}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
