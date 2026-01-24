'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
// import styles from '../rsvp/rsvp.module.css'; // Adjust import if needed or copy styles
// We'll just inline minimal styles for the test or point to existing module
import styles from '../rsvp/rsvp.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { ConnectingDots } from "@/components/ui/ConnectingDots";

export default function RSVPPageClone() {
    const router = useRouter();
    const { isAuthenticated } = useWeddingStore();

    const handleCreateRSVP = () => {
        if (isAuthenticated) {
            router.push('/dashboard/rsvp/create');
        } else {
            router.push('/login?redirect=/dashboard/rsvp/create');
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'RSVP Test', active: true },
                        ]}
                    />
                </div>
            </header>

            <section className={styles.hero}>
                <ConnectingDots color="#1B5E20" count={40} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <motion.h1
                                className={styles.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Elegant RSVPs for</span>
                                <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Indian Weddings</span>
                            </motion.h1>
                            <p style={{ marginBottom: '2rem' }}>DEBUG: This is the /rsvp-landing test page.</p>
                            <motion.p
                                className={styles.subtitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Coordinate your guest list with ease. Digital tracking
                                for the modern wedding coordinator.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <button onClick={handleCreateRSVP} className="btn btn-primary">
                                    CREATE RSVP EVENT
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
