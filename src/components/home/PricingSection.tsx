'use client';

import { motion } from 'framer-motion';
import { Check, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './PricingSection.module.css';

const features = [
    "Up to 7 wedding events covered",
    "Unlimited guest responses",
    "Mobile-optimised image invites",
    "Live RSVP dashboard",
    "WhatsApp 1-click sharing",
    "Guest list CSV export",
    "Google Calendar & Maps links",
    "Zero watermark, yours forever",
];

export const PricingSection = () => {
    return (
        <section className={styles.section} id="pricing">
            <div className={styles.contentWrapper}>

                {/* Headline & Eyebrow */}
                <motion.div
                    className={styles.headerBlock}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                >
                    <span className={styles.eyebrow}>BEGIN YOUR CELEBRATION TODAY</span>
                    <h2 className={styles.headline}>
                        One Price. Your Entire Wedding Invitation Suite.
                    </h2>
                    <p className={styles.subheadline}>
                        Create and share on WhatsApp in under 5 minutes.
                    </p>
                </motion.div>

                {/* Compact Apple-Style Pricing Card */}
                <motion.div
                    className={styles.pricingCard}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.55, delay: 0.1 }}
                >
                    {/* Top Social Proof Strip */}
                    <div className={styles.topProofStrip}>
                        <div className={styles.starsGroup}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={13} fill="#D4AF37" color="#D4AF37" />
                            ))}
                        </div>
                        <span className={styles.proofText}>
                            Trusted by <strong className={styles.proofHighlight}>Indian couples</strong>
                        </span>
                    </div>

                    <div className={styles.cardBody}>
                        {/* Price & Savings */}
                        <div className={styles.priceRow}>
                            <div className={styles.savingsPillWrapper}>
                                <span className={styles.originalPrice}>₹2,500</span>
                                <span className={styles.savingsBadge}>SAVE ₹1,501</span>
                            </div>

                            <div className={styles.mainPriceWrapper}>
                                <span className={styles.currencySign}>₹</span>
                                <span className={styles.priceNumber}>999</span>
                                <span className={styles.oneTimeLabel}>one-time</span>
                            </div>

                            <p className={styles.priceSubtext}>
                                No subscription · No hidden fees · Yours forever
                            </p>
                        </div>

                        {/* 2-Column Features Grid (4 x 2) */}
                        <ul className={styles.featuresGrid}>
                            {features.map((feature, i) => (
                                <motion.li
                                    key={i}
                                    className={styles.featureItem}
                                    initial={{ opacity: 0, y: 8 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.15 + i * 0.03 }}
                                >
                                    <div className={styles.checkBadge}>
                                        <Check size={11} strokeWidth={3} color="#C8A951" />
                                    </div>
                                    <span className={styles.featureText}>{feature}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA Button & Trust Footnote */}
                        <div className={styles.ctaFooter}>
                            <Link href="/themes" className={styles.ctaButton}>
                                <span>Create My Invitation — ₹999</span>
                                <ArrowRight size={17} strokeWidth={2.5} className={styles.ctaArrow} />
                            </Link>

                            <div className={styles.guaranteeRow}>
                                <ShieldCheck size={14} color="#C8A951" style={{ flexShrink: 0 }} />
                                <span>Preview free · Satisfaction guarantee · Secure via Razorpay</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
