'use client';

import { motion } from 'framer-motion';
import { Check, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
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

export const PricingSection = () => {
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
                            One Price. Your Entire Wedding Invitation Suite.
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
                        style={{ gap: 0, padding: 0, overflow: 'hidden' }}
                    >
                        {/* Social proof bar */}
                        <div style={{
                            width: '100%',
                            background: '#111',
                            padding: '0.875rem 2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.625rem',
                        }}>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={13} fill="#D4AF37" color="#D4AF37" />
                                ))}
                            </div>
                            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.01em' }}>
                                Trusted by <strong style={{ color: '#D4AF37' }}>Indian couples</strong>
                            </span>
                        </div>

                        {/* Price section */}
                        <div style={{ padding: '2.5rem 2.5rem 2rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                                <span style={{ fontSize: '0.95rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 500 }}>₹2,500</span>
                                <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', padding: '4px 12px', borderRadius: '100px' }}>
                                    SAVE ₹1,501
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.875rem' }}>
                                <span style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '4.5rem',
                                    fontWeight: 700,
                                    color: '#111',
                                    lineHeight: 1,
                                }}>
                                    <span style={{ fontSize: '2rem', verticalAlign: 'super', fontWeight: 500 }}>₹</span>999
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    color: '#94A3B8',
                                    textTransform: 'uppercase',
                                    alignSelf: 'flex-end',
                                    paddingBottom: '0.625rem',
                                }}>one-time</span>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                                No subscription · No hidden fees · Yours forever
                            </p>
                        </div>

                        {/* Features — single column */}
                        <div style={{ padding: '2rem 2.5rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                {features.map((f, i) => (
                                    <motion.li
                                        key={i}
                                        suppressHydrationWarning
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#333', lineHeight: 1.4 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                                    >
                                        <Check size={15} strokeWidth={2.5} color="#D4AF37" style={{ flexShrink: 0 }} />
                                        <span>{f}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
                            <Link
                                href="/themes"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'center',
                                    background: 'linear-gradient(135deg, #ECC878 0%, #D4AF37 100%)',
                                    color: '#111',
                                    padding: '1.125rem',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    letterSpacing: '0.02em',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
                                }}
                            >
                                Create My Invitation — ₹999
                            </Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <ShieldCheck size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>
                                    Preview free · Satisfaction guarantee · Secure via Razorpay
                                </span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
