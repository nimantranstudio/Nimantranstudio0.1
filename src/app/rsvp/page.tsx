'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from './rsvp.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { ConnectingDots } from "@/components/ui/ConnectingDots";

export default function RSVPPage() {
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
                            { label: 'RSVP', active: true },
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
                        <div className={styles.featuresList}>
                            {[
                                "Automated WhatsApp reminders for pending RSVPs.",
                                "Dietary preferences and plus-one tracking.",
                                "Real-time guest list dashboard for parents and couples."
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.featureItem}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }} // Delayed after content
                                >
                                    <Check className={styles.checkIcon} size={20} />
                                    <p>{feature}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.process}>
                <div className="container">
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Why Families Love Nimantran
                    </motion.h2>
                    <div className={styles.processGrid}>
                        {/* Card 1 */}
                        <motion.div
                            className={styles.processCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0 }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src="/rsvp_create.png"
                                        alt="Create Invitation"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Create your online invitation link</h3>
                                <p className={styles.cardDesc}>
                                    Add your event name, location and date to generate a personalized invitation.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            className={styles.processCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src="/rsvp_share.png"
                                        alt="Share on WhatsApp"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Share on WhatsApp</h3>
                                <p className={styles.cardDesc}>
                                    Send your invitation link through WhatsApp or any other platform instantly.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            className={styles.processCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardImage}>
                                    <Image
                                        src="/rsvp_confirm.png"
                                        alt="Confirm Attendance"
                                        fill
                                        className={styles.image}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Confirm attendance at your event</h3>
                                <p className={styles.cardDesc}>
                                    Get RSVP responses easily with a simple attendee list ready to download.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
