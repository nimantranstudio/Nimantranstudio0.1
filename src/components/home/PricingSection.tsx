'use client';

import { motion } from 'framer-motion';
import { Check, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { GovtTrustBadge } from './GovtTrustBadge';
import styles from '@/app/page.module.css';

const features = [
    "Up to 7 wedding events covered",
    "Mobile-optimised image invites",
    "WhatsApp one-click sharing",
    "Live RSVP dashboard",
    "Unlimited guest responses",
    "Guest list CSV export",
    "Google Calendar & Maps links",
    "No watermark, ever",
];

interface PricingSectionProps {
    /** From getHeadlinePricing() — the admin-configured bundle price. */
    price: number;
    originalPrice: number;
    savings: number;
}

const inr = (n: number) => n.toLocaleString('en-IN');

export const PricingSection = ({ price, originalPrice, savings }: PricingSectionProps) => {
    return (
        <section className={styles.premiumConversionSection}>
            <div className="container">
                <div className={styles.premiumConversionContent}>

                    {/* Headline */}
                    <motion.div
                        className={styles.premiumHeroLayer}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className={styles.eyebrowText}>BEGIN YOUR CELEBRATION TODAY</span>
                        <h2 className={styles.premiumHeadline}>
                            One Price. Entire Wedding Suite.
                        </h2>
                        <p className={styles.premiumSubtext}>
                            Create and share on WhatsApp in under 5 minutes.
                        </p>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                        className={styles.integratedPricingBlock}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Social proof bar */}
                        <div className={styles.pricingSocialProof}>
                            <div className={styles.pricingSocialStars}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={13} fill="#D4AF37" color="#D4AF37" />
                                ))}
                            </div>
                            <span className={styles.pricingSocialText}>
                                Trusted by <strong style={{ color: '#D4AF37' }}>Indian couples</strong>
                            </span>
                        </div>

                        {/* Price section */}
                        <div className={styles.pricingPriceBlock}>
                            {/* Only claim a discount when one is actually configured. */}
                            {originalPrice > 0 && (
                                <div className={styles.pricingDiscountRow}>
                                    <span className={styles.pricingOriginalPrice}>₹{inr(originalPrice)}</span>
                                    <span className={styles.pricingSaveBadge}>
                                        SAVE ₹{inr(savings)}
                                    </span>
                                </div>
                            )}

                            <div className={styles.pricingMainPrice}>
                                <span className={styles.pricingNumber}>
                                    <span className={styles.pricingCurrencySymbol}>₹</span>{inr(price)}
                                </span>
                                <span className={styles.pricingTermLabel}>one-time</span>
                            </div>

                            <p className={styles.pricingSubtextInfo}>
                                No subscription · No hidden fees · Yours forever
                            </p>
                        </div>

                        {/* Features — balanced single column */}
                        <div className={styles.pricingFeaturesWrapper}>
                            <ul className={styles.pricingFeaturesList}>
                                {features.map((f, i) => (
                                    <motion.li
                                        key={i}
                                        suppressHydrationWarning
                                        className={styles.pricingFeatureItem}
                                        initial={{ opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.35, delay: 0.04 + i * 0.04 }}
                                    >
                                        <Check size={16} strokeWidth={2.5} className={styles.pricingFeatureCheck} />
                                        <span>{f}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className={styles.pricingCtaWrapper}>
                            <Link
                                href="/themes"
                                className={styles.pricingMainButton}
                            >
                                Create Nimantran — ₹{inr(price)}
                            </Link>

                            <div className={styles.pricingGuaranteeRow}>
                                <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                                <span>
                                    Preview free · Satisfaction guarantee · Secure via Razorpay
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Government MSME Trust Badge below the pricing card */}
                    <motion.div
                        className={styles.pricingTrustBadgeOuter}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                    >
                        <GovtTrustBadge theme="dark" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
