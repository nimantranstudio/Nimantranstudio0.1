'use client';

import { useWeddingStore } from '@/store/wedding-store';
import { THEMES } from '@/lib/constants/themes';
import { InvitationCard } from '@/components/preview/InvitationCard';
import styles from '@/components/preview/Preview.module.css';
import { ChevronLeft, Headphones, Play } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useState } from 'react';

const ALL_ASSETS = [
    { id: 'poster', name: "Wedding poster", type: 'image' },
    { id: 'wedding', name: "Wedding", type: 'image' },
    { id: 'video', name: "Cinematic Video", type: 'video' },
    { id: 'sangeet', name: "Sangeet", type: 'image' },
    { id: 'mehendi', name: "Mehendi", type: 'image' },
    { id: 'haldi', name: "Haldi", type: 'image' },
    { id: 'sangeet_poster', name: "Sangeet Poster", type: 'image' },
    { id: 'mehendi_poster', name: "Mehendi Poster", type: 'image' },
    { id: 'haldi_poster', name: "Haldi Poster", type: 'image' },
    { id: 'save_the_date', name: "Save The Date", type: 'image' },
    { id: 'initials', name: "Initials", type: 'image' },
    { id: 'thank_you', name: "Thank you card", type: 'image' },
];

export default function PreviewPage() {
    const { formData, selectedThemeId } = useWeddingStore();
    const [isSecuring, setIsSecuring] = useState(false);
    const theme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

    const handleCheckout = () => {
        setIsSecuring(true);
        // Simulate potential redirect after some time
        // setTimeout(() => setIsSecuring(false), 5000);
    };

    if (isSecuring) {
        return (
            <div className={styles.securingOverlay}>
                <h2 className={styles.securingTitle}>Securing your bundle...</h2>
                <p className={styles.securingSubtitle}>Redirecting to checkout</p>

                <div className={styles.spinner}></div>

                <button
                    onClick={() => setIsSecuring(false)}
                    className={styles.cancelPayment}
                >
                    Cancel Payment
                </button>
            </div>
        );
    }

    return (
        <div className={styles.previewPage}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', href: '/themes' },
                            { label: theme.name, href: `/themes/${selectedThemeId || 'rajputana'}` },
                            { label: 'wedding details', href: '/details' },
                            { label: 'preview', active: true },
                        ]}
                    />
                </div>
            </header>

            <main className="container">
                <div className={styles.mainLayout}>
                    {/* Left Column: 12-Card Grid */}
                    <div className={styles.leftColumn}>
                        <div className={styles.grid}>
                            {ALL_ASSETS.map((asset) => {
                                const event = formData.events.find(e => e.name.toLowerCase() === asset.name.toLowerCase()) ||
                                    (asset.id === 'wedding' ? formData.events[0] : null);

                                return (
                                    <InvitationCard
                                        key={asset.id}
                                        event={event || { id: asset.id, name: asset.name, date: '', time: '', venue: '' }}
                                        theme={theme}
                                        groomName={formData.groomName}
                                        brideName={formData.brideName}
                                        isPlaceholder={!event}
                                        type={asset.type as 'image' | 'video'}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Title and Summary Card */}
                    <div className={styles.rightColumn}>
                        <div>
                            <h1 className={styles.previewHeaderTitle} style={{
                                fontSize: '2rem',
                                marginBottom: '0.5rem',
                                color: '#1a4d2e',
                                lineHeight: 1.2
                            }}>
                                Your Wedding Bundle is Ready!
                            </h1>
                            <p className={styles.previewHeaderSubtitle} style={{
                                fontSize: '0.9rem',
                                color: '#666',
                                marginBottom: '1.5rem'
                            }}>
                                Generated automatically from your details. Ready for high-res delivery.
                            </p>

                            <h2 className={styles.bundleTitle}>
                                {theme.name} theme invitation bundle complete pack of 12
                            </h2>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.summaryHeader}>
                                <h2>Bundle Summary</h2>
                            </div>

                            <div className={styles.detailsList}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Theme:</span>
                                    <span className={styles.detailValue}>Royal {theme.name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Invitation Items:</span>
                                    <span className={styles.detailValue}>12 Total</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Video Format:</span>
                                    </span>
                                    <span className={styles.detailValue}>Full HD (1080p)</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>RSVP Support:</span>
                                    <span className={styles.detailValue}>Included</span>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.priceSection}>
                                <div className={styles.priceInfo}>
                                    <span className={styles.priceTitle}>Gold Bundle</span>
                                    <span className={styles.priceSub}>INCLUSIVE OF ALL TAXES</span>
                                </div>
                                <div className={styles.priceValue}>₹1,200</div>
                            </div>

                            <button
                                className={styles.confirmBtn}
                                onClick={handleCheckout}
                            >
                                Confirm & Pay
                            </button>
                        </div>

                        {/* Info Blocks below the card */}
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBlock}>
                                <h3 className={styles.infoBlockTitle}>Satisfaction Guaranteed</h3>
                                <p className={styles.infoBlockText}>
                                    Final assets will be generated without watermarks in high definition immediately after payment. Editing allowed for next 15 days.
                                </p>
                            </div>

                            <div className={styles.infoBlock}>
                                <div className={styles.helpBlock}>
                                    <div className={styles.helpItem}>
                                        <Headphones size={20} color="#71717a" />
                                        <div className={styles.helpText}>
                                            Need Help? Contact Us <strong>+91 96250 28849</strong><br />
                                            <span style={{ fontSize: '0.625rem', opacity: 0.8 }}>Monday - Saturday 9:00 AM - 6:00 PM</span>
                                        </div>
                                    </div>
                                    <div className={styles.paymentRow}>
                                        <div className={styles.paymentBadges}>
                                            <div className={styles.cardIcon}></div>
                                            <div className={styles.cardIcon}></div>
                                            <div className={styles.cardIcon}></div>
                                        </div>
                                        <span className={styles.secureLabel}>SECURE PAYMENTS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
