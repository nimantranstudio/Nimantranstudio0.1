'use client';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from './products.module.css';
import clsx from 'clsx';
import { Check } from 'lucide-react';

const PLANS = [
    {
        name: 'Regular',
        price: '999',
        features: ['3 Events', 'Standard Support', 'Digital Invite Only'],
        buttonText: 'GET STARTED',
    },
    {
        name: 'Silver',
        price: '1999',
        features: ['5 Events', 'Priority Support', 'Video Save the Date'],
        buttonText: 'GET STARTED',
    },
    {
        name: 'Gold',
        price: '3999',
        features: ['All 12+ Events', 'Video Invitations', 'Marathi/Hindi Support', 'Unlimited Edits'],
        buttonText: 'GET STARTED',
        recommended: true,
    },
    {
        name: 'Platinum',
        price: '6999',
        features: ['Custom Illustrations', 'RSVP Management', 'WhatsApp Group Setup', 'Concierge Service'],
        buttonText: 'GET STARTED',
    },
];

export default function ProductsPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Products', active: true },
                        ]}
                    />
                </div>
            </header>

            <main className="container">
                <div className={styles.hero}>
                    <h1 className={styles.title}>Honest, Clear Pricing</h1>
                    <p className={styles.subtitle}>
                        Choose a bundle that fits your family's needs. All plans include our premium master-form workflow and family-approved designs.
                    </p>
                </div>
                <div className={styles.pricingGrid}>
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={clsx(styles.card, plan.recommended && styles.recommendedCard)}
                        >
                            {plan.recommended && (
                                <div className={styles.badge}>
                                    RECOMMENDED FOR FAMILIES
                                </div>
                            )}
                            <div className={styles.cardHeader}>
                                <h2 className={styles.planName}>{plan.name}</h2>
                                <div className={styles.priceContainer}>
                                    <span className={styles.currency}>₹</span>
                                    <span className={styles.price}>{plan.price}</span>
                                </div>
                                <p className={styles.paymentType}>ONE-TIME PAYMENT</p>
                            </div>

                            <ul className={styles.featureList}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <Check size={16} className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={clsx(
                                "btn",
                                plan.recommended ? "btn-primary" : "btn-secondary",
                                styles.cardButton
                            )}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
