'use client';

import { useWeddingStore } from '@/store/wedding-store';
import type { Theme } from '@/lib/constants/themes';
import { InvitationCard } from '@/components/preview/InvitationCard';
import styles from '@/components/preview/Preview.module.css';
import { ChevronLeft, Headphones, Play } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useState, useEffect } from 'react';
import { LoginModal } from '@/components/auth/LoginModal';

export default function PreviewPage() {
    const { formData, selectedThemeId, isAuthenticated, login, bundleImages } = useWeddingStore();
    const [isSecuring, setIsSecuring] = useState(false);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'edit'>('summary');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);


    const { updateFormData, updateEvent } = useWeddingStore();

    useEffect(() => {
        async function fetchTheme() {
            if (!selectedThemeId) return;
            try {
                const res = await fetch(`/api/themes/${selectedThemeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTheme(data.theme);
                }
            } catch (error) {
                console.error("Failed to fetch theme", error);
            }
        }
        fetchTheme();
    }, [selectedThemeId]);

    // Auto-close modal if auth state changes to true (e.g. cross-tab login or delayed hydration)
    useEffect(() => {
        if (isAuthenticated && showLoginModal) {
            setShowLoginModal(false);
            setIsSecuring(true);
        }
    }, [isAuthenticated, showLoginModal]);

    const handleCheckout = () => {
        // Direct read to ensure we have the latest persisted state
        const state = useWeddingStore.getState();
        const currentAuth = state.isAuthenticated;

        if (currentAuth) {
            setIsSecuring(true);
            return;
        }

        // If not auth, check if we have a phone number (maybe just need to re-verify?)
        // For now, always prompt login, but LoginModal will handle existing users better
        setShowLoginModal(true);
    };

    const handleLoginSuccess = (phone: string) => {
        setShowLoginModal(false);
        login(phone);
        setIsSecuring(true);
    };

    if (!theme) {
        return (
            <div className={styles.previewPage}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#666' }}>
                    <div>Loading theme details...</div>
                </div>
            </div>
        );
    }

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

    const bundleItems = [
        { id: 'save-the-date', name: 'Save The Date', variant: 'save-the-date', customImage: '/assets/bundle-templates/save-the-date.png', usePrimaryDate: true },
        // Loop through actual events defined by user
        ...formData.events.map(ev => {
            const evLower = ev.name.toLowerCase();
            let templateFile = 'wedding.png';
            if (evLower.includes('haldi')) templateFile = 'haldi.png';
            else if (evLower.includes('mehndi') || evLower.includes('mehendi')) templateFile = 'mehndi.png';
            else if (evLower.includes('sangeet')) templateFile = 'sangeet.png';

            return {
                ...ev,
                variant: 'default',
                customImage: `/assets/bundle-templates/${templateFile}`,
                usePrimaryDate: false
            };
        })
    ];

    const activeItem = selectedPreviewIndex !== null ? bundleItems[selectedPreviewIndex] : null;

    return (
        <div className={styles.previewPage}>
            {/* Fullscreen Preview Modal */}
            {selectedPreviewIndex !== null && theme && activeItem && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '2rem'
                    }}
                    onClick={() => setSelectedPreviewIndex(null)}
                >
                    <button
                        onClick={() => setSelectedPreviewIndex(null)}
                        style={{
                            position: 'absolute', top: '2rem', right: '2rem',
                            background: 'white', border: 'none', borderRadius: '50%',
                            width: '40px', height: '40px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InvitationCard
                            event={{
                                id: activeItem.id || `design-${selectedPreviewIndex}`,
                                name: activeItem.name,
                                date: activeItem.usePrimaryDate ? formData.primaryDate : activeItem.date,
                                time: activeItem.usePrimaryDate ? formData.primaryTime : activeItem.time,
                                venue: activeItem.usePrimaryDate ? formData.defaultVenueName : activeItem.venue
                            }}
                            theme={theme}
                            groomName={formData.groomName}
                            brideName={formData.brideName}
                            isPlaceholder={false}
                            type='image'
                            customImage={activeItem.customImage}
                            variant={activeItem.variant as 'default' | 'save-the-date'}
                        />
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', href: '/themes' },
                            { label: theme.name, href: `/themes/${selectedThemeId}` },
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
                            {bundleItems.map((item, index) => (
                                <InvitationCard
                                    key={index}
                                    event={{
                                        id: item.id || `design-${index}`,
                                        name: item.name,
                                        date: item.usePrimaryDate ? formData.primaryDate : item.date,
                                        time: item.usePrimaryDate ? formData.primaryTime : item.time,
                                        venue: item.usePrimaryDate ? formData.defaultVenueName : item.venue
                                    }}
                                    theme={theme}
                                    groomName={formData.groomName}
                                    brideName={formData.brideName}
                                    isPlaceholder={false}
                                    type='image'
                                    customImage={item.customImage}
                                    onClick={() => setSelectedPreviewIndex(index)}
                                    variant={item.variant as 'default' | 'save-the-date'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Title and Summary Card */}
                    <div className={styles.rightColumn}>
                        <div className={styles.editorTabs}>
                            <button
                                className={clsx(styles.tabBtn, activeTab === 'summary' && styles.tabBtnActive)}
                                onClick={() => setActiveTab('summary')}
                            >
                                Summary
                            </button>
                            <button
                                className={clsx(styles.tabBtn, activeTab === 'edit' && styles.tabBtnActive)}
                                onClick={() => setActiveTab('edit')}
                            >
                                Live Editor
                            </button>
                        </div>

                        {activeTab === 'summary' ? (
                            <div className={styles.summaryView}>
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
                            </div>
                        ) : (
                            <div className={styles.editorContent}>
                                <div className={styles.editorHeader}>
                                    <h2 style={{ fontSize: '1.5rem', color: '#1a4d2e', marginBottom: '0.5rem' }}>Quick Edit</h2>
                                    <p style={{ fontSize: '0.875rem', color: '#666' }}>Changes are reflected instantly on the preview cards.</p>
                                </div>

                                <div className={styles.editorField}>
                                    <label>Groom's Name</label>
                                    <input
                                        className={styles.editorInput}
                                        value={formData.groomName}
                                        onChange={(e) => updateFormData({ groomName: e.target.value })}
                                        placeholder="Groom Name"
                                    />
                                </div>

                                <div className={styles.editorField}>
                                    <label>Bride's Name</label>
                                    <input
                                        className={styles.editorInput}
                                        value={formData.brideName}
                                        onChange={(e) => updateFormData({ brideName: e.target.value })}
                                        placeholder="Bride Name"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className={styles.editorField}>
                                        <label>Wedding Date</label>
                                        <input
                                            type="date"
                                            className={styles.editorInput}
                                            value={formData.primaryDate}
                                            onChange={(e) => updateFormData({ primaryDate: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.editorField}>
                                        <label>Wedding Time</label>
                                        <input
                                            type="time"
                                            className={styles.editorInput}
                                            value={formData.primaryTime || ''}
                                            onChange={(e) => updateFormData({ primaryTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.editorField}>
                                    <label>Default Venue</label>
                                    <textarea
                                        className={clsx(styles.editorInput, styles.editorTextarea)}
                                        value={formData.defaultVenueName}
                                        onChange={(e) => updateFormData({ defaultVenueName: e.target.value })}
                                        placeholder="The Grand Palace, Rajasthan"
                                    />
                                </div>

                                <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#ECFDF5', borderRadius: '16px', border: '1px solid #10B981' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#065F46', fontWeight: 600 }}>
                                        Pro Tip: Your changes are automatically saved. Switch back to the 'Summary' tab to complete your purchase.
                                    </p>
                                </div>
                            </div>
                        )}

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
            {/* Authentication Gateway */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}
