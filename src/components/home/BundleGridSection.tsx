"use client";

import styles from '@/app/page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';

export const BundleGridSection = () => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    return (
        <section className={styles.bundleGridSection}>
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        className={styles.lightboxOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button className={styles.lightboxClose}>
                            <X size={24} />
                        </button>
                        <motion.div
                            className={styles.lightboxImageWrapper}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <img
                                src="/wedding-bundle-showcase.jpg"
                                alt="Complete digital wedding invitation suite"
                                className={styles.lightboxImage}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container">
                <div className={styles.bundleGridHeader}>
                    <h2 className={styles.bundleGridTitle}>
                        Create Invitations, Collect RSVPs, Manage Your Guest List — All in One Place
                    </h2>
                </div>
                <div className={styles.featureGrid}>
                    {/* Top Large Card */}
                    <motion.div
                        className={`${styles.featureCard} ${styles.featureCardLarge}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.featureCardContent}>
                            <h3>One Form. Complete Wedding Bundle.</h3>
                            <p>
                                Enter your wedding details once and instantly generate a full invitation suite for every event in your celebration.
                            </p>
                            <div className={styles.featureTags}>
                                <span>Save the Date</span>
                                <span>Haldi</span>
                                <span>Mehndi</span>
                                <span>Sangeet</span>
                                <span>Wedding</span>
                                <span>Reception</span>
                            </div>
                        </div>
                        <div
                            className={styles.featureCardImageWrapper}
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            <Image
                                src="/wedding-bundle-showcase.jpg"
                                alt="Complete digital wedding invitation suite for multiple events - Nimantran Studio"
                                width={1024}
                                height={657}
                                className={styles.featureImageFull}
                            />
                        </div>
                    </motion.div>

                    {/* Bottom Left Card */}
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className={styles.featureCardContent}>
                            <h3>Simple RSVP Dashboard</h3>
                            <p>
                                Track guest confirmations in real time with a clean dashboard. See who's attending, declined, or pending at a glance.
                            </p>
                        </div>
                        <div className={styles.featureCardGraphicWrapper}>
                            <div className={styles.mockRsvpContainer}>
                                <Image
                                    src="/rsvp-dashboard-showcase.png"
                                    alt="Simple RSVP Dashboard - Nimantran Studio"
                                    width={1024}
                                    height={634}
                                    className={styles.dashboardPreviewImage}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Right Card */}
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.featureCardContent}>
                            <h3>Wedding Website. A Connected Experience</h3>
                            <p>
                                Share every event, collect RSVPs, add events to calendars, get directions, and keep everyone updated.
                            </p>
                        </div>
                        <div className={styles.featureCardGraphicWrapper}>
                            <div className={styles.websiteShowcaseContainer}>
                                <Image
                                    src="/wedding-website-showcase.png"
                                    alt="Wedding Website. A Connected Experience - Nimantran Studio"
                                    width={1024}
                                    height={597}
                                    className={styles.websiteShowcaseImage}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
