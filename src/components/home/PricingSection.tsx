'use client';

import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import React, { useState } from 'react';
import styles from '@/app/page.module.css';

const PRICING_PLANS = [
    {
        title: "WhatsApp Essentials",
        subtitle: "Perfect for digital sharing with friends & family",
        price: "₹999 only",
        subPrice: "(No subscription • No watermark)",
        features: [
            "Covers any 6 wedding events",
            "Image invites (mobile-optimized)",
            "Short video invites (WhatsApp ready)",
            "RSVP link with live guest count",
            "Share instantly with one click"
        ],
        buttonText: "Start with WhatsApp Essentials",
        isPopular: false,
        theme: "default"
    },
    {
        title: "WhatsApp + Posters",
        subtitle: "Digital invites + venue-ready welcome boards",
        price: "₹1,999",
        subPrice: "(Most couples choose this for stress-free weddings)",
        features: [
            "Everything in WhatsApp Essentials",
            "Covers any 9 wedding events",
            "Image + Video invitations",
            "Printable welcome posters",
            "Advanced RSVP & guest tracking"
        ],
        printables: [
            "Welcome Board – A1 (24×36 in)",
            "Haldi Welcome – A2",
            "Mehndi Welcome – A2",
            "Sangeet Welcome – A2"
        ],
        buttonText: "Choose the Most Popular Bundle",
        isPopular: true,
        theme: "gold"
    },
    {
        title: "Complete Wedding Suite",
        subtitle: "For families who want everything perfectly coordinated",
        price: "₹3,499",
        subPrice: "One-time, all-inclusive",
        features: [
            "Everything from Essentials + Posters",
            "Covers all 12 wedding events",
            "Complete wedding stationery set",
            "Priority support",
            "Custom illustration / motif"
        ],
        printables: [
            "Save the Date • RSVP Card",
            "Main Invite • Thank You",
            "Welcome Board • Menu Card",
            "Table Nos • Program Schedule",
            "Gift Table Sign"
        ],
        buttonText: "Get the Complete Wedding Suite",
        isPopular: false,
        theme: "default"
    }
];

export const PricingSection = () => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <section style={{ padding: '8rem 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
                        Choose what fits your celebration
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: '#666' }}>
                        Transparent pricing. No hidden fees.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1280px',
                    margin: '0 auto',
                    alignItems: 'start'
                }}>
                    {PRICING_PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            style={{
                                position: 'relative',
                                border: plan.isPopular ? '2px solid #D4AF37' : '1px solid #e5e5e5', // Gold border for popular
                                borderRadius: '1.5rem',
                                padding: '2.5rem',
                                backgroundColor: '#fff',
                                boxShadow: plan.isPopular ? '0 20px 40px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.03)',
                                transform: plan.isPopular ? 'scale(1.02)' : 'scale(1)',
                                zIndex: plan.isPopular ? 2 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%' // Ensure full height
                            }}
                        >
                            {plan.isPopular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#D4AF37',
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    borderRadius: '100px',
                                    letterSpacing: '0.05em',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Star size={12} fill="currentColor" /> MOST POPULAR – BEST VALUE
                                </div>
                            )}

                            {/* Header */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a', fontFamily: 'var(--font-serif)' }}>
                                    {plan.title}
                                </h3>
                                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                    {plan.subtitle}
                                </p>
                            </div>

                            {/* Price */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
                                    {plan.price}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                                    {plan.subPrice}
                                </div>
                            </div>

                            {/* Features */}
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        marginBottom: '1rem',
                                        color: '#333',
                                        fontSize: '0.9rem', // Reduced from 1rem
                                        lineHeight: '1.5'
                                    }}>
                                        <div style={{
                                            marginTop: '2px',
                                            color: plan.theme === 'gold' ? '#D4AF37' : '#22C55E'
                                        }}>
                                            <Check size={18} strokeWidth={2.5} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Printables Box */}
                            {plan.printables && (
                                <div style={{
                                    backgroundColor: 'transparent',
                                    marginBottom: '2rem'
                                }}>
                                    <h4 style={{
                                        color: '#D4AF37',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '1rem'
                                    }}>
                                        Included Printables:
                                    </h4>
                                    <ul style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.75rem 1.5rem',
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0
                                    }}>
                                        {plan.printables.map((item, idx) => (
                                            <li key={idx} style={{
                                                fontSize: '0.8rem', // Reduced from 0.9rem
                                                color: '#555',
                                                position: 'relative',
                                                paddingLeft: '0.75rem'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: '0.4em',
                                                    width: '4px',
                                                    height: '4px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#D4AF37'
                                                }}></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Dropdown Link */}
                            <div
                                onClick={() => toggleDropdown(i)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: '1rem 0',
                                    borderTop: '1px solid #f0f0f0',
                                    marginBottom: '1.5rem',
                                    color: '#666',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    marginTop: 'auto' // Push to bottom
                                }}
                            >
                                What exactly you'll receive
                                {openDropdown === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            {openDropdown === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    style={{
                                        fontSize: '0.95rem',
                                        color: '#666',
                                        marginBottom: '2rem',
                                        overflow: 'hidden',
                                        lineHeight: '1.6'
                                    }}
                                >
                                    Detailed list of deliverables including file formats, resolutions, and delivery timelines for each item in this package.
                                </motion.div>
                            )}

                            {/* Button */}
                            <button style={{
                                width: '100%',
                                padding: '1.25rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                backgroundColor: plan.theme === 'gold' ? '#D4AF37' : '#111827',
                                color: '#fff',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: plan.theme === 'gold' ? '0 10px 20px rgba(212, 175, 55, 0.2)' : '0 10px 20px rgba(0,0,0,0.1)'
                            }}>
                                {plan.buttonText}
                            </button>

                            {/* Footer Text */}
                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
                                {plan.isPopular ? "Perfect balance of digital + venue decor" : i === 0 ? "Ideal if you don't need printed material" : "No last-minute print tension"}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
