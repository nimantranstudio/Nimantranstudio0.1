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
            <section className={styles.introOuter}>
                <div className="container">
                    <div className={styles.introGrid}>
                        <div className={styles.introContent}>
                            <motion.span 
                                className={styles.category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                RSVP MANAGER
                            </motion.span>
                            <motion.h1 
                                className={styles.introTitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Digital RSVPs <br /> made simple
                            </motion.h1>
                            <motion.p 
                                className={styles.introSub}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                Coordinate your guest list with ease. Send elegant digital invitations and track responses in real-time on your dashboard.
                            </motion.p>
                            <motion.div
                                className={styles.introOfferBox}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <div className={styles.offerCard}>
                                    <h2 className={styles.offerTitle}>
                                        <span className={styles.sparkleIcon}>✦</span>
                                        Free for your first 20 guest responses
                                    </h2>
                                    <p className={styles.offerSubtitle}>Perfect to try for your close family circle.</p>
                                    
                                    <button onClick={handleCreateRSVP} className={styles.greenBtn}>
                                        Create My Free RSVP
                                    </button>
                                    
                                    <p className={styles.offerFooter}>No payment required • Setup takes under 30 seconds</p>
                                </div>

                                <div className={styles.offerTrustLine}>
                                    <span>⭐ Used by 5000+ wedding couples</span>
                                    <span className={styles.separator}>✦</span>
                                    <span>Most couples start sharing within minutes</span>
                                </div>
                            </motion.div>
                        </div>
                        <div className={styles.introVisual}>
                            <motion.div 
                                className={styles.imageFloat}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <Image 
                                    src="/assets/rsvp-landing.jpg" 
                                    alt="RSVP Dashboard" 
                                    width={700}
                                    height={500}
                                    className={styles.introImg}
                                />
                            </motion.div>
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
                        RSVP for Indian Weddings
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

                    <motion.div
                        className={styles.ctaWrapper}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <button onClick={handleCreateRSVP} className="btn btn-primary">
                            CREATE RSVP EVENT
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
