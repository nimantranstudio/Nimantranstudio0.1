'use client';

import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Star } from 'lucide-react';
import React, { useState } from 'react';
import styles from '@/app/home.module.css';
import clsx from 'clsx';

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
        <section className={styles.pricingSection}>
            <div className="container">
                <div className={styles.pricingHeader}>
                    <h2 className={styles.pricingTitle}>
                        Choose what fits your celebration
                    </h2>
                    <p className={styles.pricingSubtitle}>
                        Transparent pricing. No hidden fees.
                    </p>
                </div>

                <div className={styles.pricingGrid}>
                    {PRICING_PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={clsx(styles.pricingCard, plan.isPopular && styles.pricingCardPopular)}
                        >
                            {plan.isPopular && (
                                <div className={styles.popularBadge}>
                                    <Star size={12} fill="currentColor" /> MOST POPULAR – BEST VALUE
                                </div>
                            )}

                            {/* Header */}
                            <div className={styles.pricingCardHeader}>
                                <h3 className={styles.pricingCardTitle}>
                                    {plan.title}
                                </h3>
                                <p className={styles.pricingCardDescription}>
                                    {plan.subtitle}
                                </p>
                            </div>

                            {/* Price */}
                            <div className={styles.pricingPriceBox}>
                                <div className={styles.pricingPrice}>
                                    {plan.price}
                                </div>
                                <div className={styles.pricingSubPrice}>
                                    {plan.subPrice}
                                </div>
                            </div>

                            {/* Features */}
                            <ul className={styles.pricingFeaturesList}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className={styles.pricingFeatureItem}>
                                        <div className={clsx(styles.checkIconWrapper, plan.theme === 'gold' ? styles.checkIconGold : styles.checkIconGreen)}>
                                            <Check size={18} strokeWidth={2.5} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Printables Box */}
                            {plan.printables && (
                                <div className={styles.pricingPrintables}>
                                    <h4 className={styles.pricingPrintablesTitle}>
                                        Included Printables:
                                    </h4>
                                    <ul className={styles.pricingPrintablesList}>
                                        {plan.printables.map((item, idx) => (
                                            <li key={idx} className={styles.pricingPrintableItem}>
                                                <span className={styles.pricingPrintableDot}></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Dropdown Link */}
                            <div
                                onClick={() => toggleDropdown(i)}
                                className={styles.pricingDropdownToggle}
                            >
                                What exactly you'll receive
                                {openDropdown === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>

                            {openDropdown === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className={styles.pricingDropdownContent}
                                >
                                    Detailed list of deliverables including file formats, resolutions, and delivery timelines for each item in this package.
                                </motion.div>
                            )}

                            {/* Button */}
                            <button className={clsx(styles.pricingButton, plan.theme === 'gold' ? styles.pricingButtonGold : styles.pricingButtonDark)}>
                                {plan.buttonText}
                            </button>

                            {/* Footer Text */}
                            <div className={styles.pricingFooterText}>
                                {plan.isPopular ? "Perfect balance of digital + venue decor" : i === 0 ? "Ideal if you don't need printed material" : "No last-minute print tension"}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
