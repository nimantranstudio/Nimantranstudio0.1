'use client';

import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import React, { useState } from 'react';
import styles from '@/app/page.module.css';
import { clsx } from 'clsx';

export const PricingSection = () => {
    return (
        <section className={styles.premiumConversionSection}>
            <div className="container">
                <div className={styles.premiumConversionContent}>
                    {/* Hero Layer */}
                    <div className={styles.premiumHeroLayer}>
                        <span className={styles.eyebrowText}>BEGIN YOUR CELEBRATION TODAY</span>
                        <h2 className={styles.premiumHeadline}>
                            One Price. Your Entire Wedding Invitation Suite.
                        </h2>
                        <p className={styles.premiumSubtext}>
                            Create and share your wedding invitations <br />
                            on WhatsApp in under 5 minutes.
                        </p>
                    </div>

                    {/* Integrated Pricing Block */}
                    <div className={styles.integratedPricingBlock}>

                        <div className={styles.pricingDetails}>
                            <div className={styles.priceContainer}>
                                <span className={styles.priceAmount}>
                                    <span className={styles.currency}>₹</span>999
                                </span>
                                <span className={styles.priceTerm}>one-time</span>
                            </div>
                            <h3 className={styles.productTitle}>WhatsApp Essentials</h3>
                            <p className={styles.microText}>No subscription • No watermark</p>
                        </div>

                        <div className={styles.featuresAndCta}>
                            <ul className={styles.premiumFeaturesList}>
                                {[
                                    "Covers up to 6 wedding events",
                                    "Mobile-optimized image invites",
                                    "RSVP link with live guest count",
                                    "Guest management RSVP Dashboard",
                                    "One-click WhatsApp sharing"
                                ].map((feature, idx) => (
                                    <li key={idx} className={styles.premiumFeatureItem}>
                                        <Check size={16} strokeWidth={2} className={styles.goldCheck} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.ctaWrapper}>
                                <button className={styles.premiumCtaButton}>
                                    Create My Invitation
                                </button>
                                <span className={styles.trustBadgeText}>Designed for WhatsApp-first wedding invitations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
