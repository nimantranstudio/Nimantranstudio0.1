'use client';

import { motion } from 'framer-motion';

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
        <section style={{ padding: '8rem 0', backgroundColor: '#345244', color: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-serif)',
                        color: '#fff'
                    }}>
                        Designed for the Indian Wedding
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '4rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                        >
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                marginBottom: '1rem',
                                color: '#fff'
                            }}>
                                {f.title}
                            </h3>
                            <p style={{
                                fontSize: '1rem',
                                color: '#aaa',
                                lineHeight: '1.6',
                                maxWidth: '250px',
                                margin: '0 auto'
                            }}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
