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
    const { formData, selectedThemeId, isAuthenticated, login, bundleImages, bundleItems } = useWeddingStore();
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

    // Build preview items from bundleItems matched to wedding events
    const buildPreviewItems = () => {
        if (!bundleItems || bundleItems.length === 0) {
            // Fallback: use old displayImages approach
            const displayImages = (bundleImages && bundleImages.length > 0) ? bundleImages : (theme.previewImages || []);
            return displayImages.map((imgUrl, index) => ({
                id: `design-${index}`,
                name: ALL_ASSETS[index]?.name || `Design ${index + 1}`,
                image: imgUrl,
                event: {
                    id: `design-${index}`,
                    name: ALL_ASSETS[index]?.name || `Design ${index + 1}`,
                    date: formData.primaryDate,
                    time: formData.primaryTime,
                    venue: formData.defaultVenueName
                }
            }));
        }

        // Match bundleItems to wedding events by eventType
        const weddingEvents = formData.events || [];
        const items: Array<{ id: string; name: string; image: string; event: any }> = [];

        for (const bi of bundleItems) {
            if (!bi.templateFile) continue;

            const biType = bi.eventType.toUpperCase().replace(/_/g, '');

            // Find matching wedding event using multiple fallbacks
            let matchedEvent = weddingEvents.find(evt => {
                const evtId = evt.id.toUpperCase();
                const evtType = (evt.eventType || '').toUpperCase();
                const evtName = (evt.name || '').toUpperCase();

                // 1. Check ID (e.g. 'wedding')
                if (biType.includes(evtId) || evtId.includes(biType)) return true;

                // 2. Check eventType field
                if (evtType && (biType.includes(evtType) || evtType.includes(biType))) return true;

                // 3. Check name
                if (biType.includes(evtName) || evtName.includes(biType)) return true;

                // 4. Special cases for common naming
                if (biType.includes('WEDDING') && evtId === 'WEDDING') return true;
                if (biType.includes('HALDI') && evtId === 'HALDI') return true;
                if (biType.includes('MEHENDI') && evtId === 'MEHENDI') return true;
                if (biType.includes('SANGEET') && evtId === 'SANGEET') return true;
                if (biType.includes('RECEPTION') && evtId === 'RECEPTION') return true;

                return false;
            });

            // If no match found, default to 'wedding' for generic wedding items
            if (!matchedEvent && biType.includes('WEDDING')) {
                matchedEvent = weddingEvents.find(e => e.id === 'wedding');
            }

            items.push({
                id: bi.id,
                name: matchedEvent?.heading || matchedEvent?.name || bi.templateName || bi.eventType,
                image: bi.templateFile,
                event: matchedEvent ? {
                    id: matchedEvent.id,
                    name: matchedEvent.heading || matchedEvent.name,
                    date: matchedEvent.date || formData.primaryDate,
                    time: matchedEvent.time || formData.primaryTime,
                    venue: (matchedEvent.isCustomVenue && matchedEvent.venue) ? matchedEvent.venue : formData.defaultVenueName,
                    tagline: matchedEvent.tagline,
                    description: matchedEvent.description,
                    heading: matchedEvent.heading
                } : {
                    id: bi.id,
                    name: bi.templateName || bi.eventType,
                    date: formData.primaryDate,
                    time: formData.primaryTime,
                    venue: formData.defaultVenueName
                }
            });
        }

        return items;
    };

    const previewItems = buildPreviewItems();



    return (
        <div className={styles.previewPage}>
            {/* Fullscreen Preview Modal */}
            {selectedPreviewIndex !== null && theme && (
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
                            event={previewItems[selectedPreviewIndex]?.event || {
                                id: `design-${selectedPreviewIndex}`,
                                name: `Design ${selectedPreviewIndex + 1}`,
                                date: formData.primaryDate,
                                time: formData.primaryTime,
                                venue: formData.defaultVenueName
                            }}
                            theme={theme}
                            groomName={formData.groomName}
                            brideName={formData.brideName}
                            groomParents={formData.groomParents}
                            brideParents={formData.brideParents}
                            welcomeMessage={formData.invitationMessage}
                            isPlaceholder={true}
                            type='image'
                            customImage={previewItems[selectedPreviewIndex]?.image}
                            isSecured={false} // Preview always has watermarks unless downloaded
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
                            {(previewItems.length > 0) ? (
                                previewItems.map((item, index) => (
                                    <InvitationCard
                                        key={item.id}
                                        event={item.event}
                                        theme={theme}
                                        groomName={formData.groomName}
                                        brideName={formData.brideName}
                                        groomParents={formData.groomParents}
                                        brideParents={formData.brideParents}
                                        welcomeMessage={formData.invitationMessage}
                                        isPlaceholder={true}
                                        type='image'
                                        customImage={item.image}
                                        onClick={() => setSelectedPreviewIndex(index)}
                                        isSecured={false}
                                    />
                                ))
                            ) : (
                                <div className={styles.noPreviews} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    No preview images available for this theme.
                                </div>
                            )}
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

                                <div className={styles.editorField}>
                                    <label>Event Heading</label>
                                    <input
                                        className={styles.editorInput}
                                        value={formData.events?.find(e => e.id === 'wedding')?.heading || 'Wedding Ceremony'}
                                        onChange={(e) => {
                                            const weddingEvent = formData.events?.find(evt => evt.id === 'wedding');
                                            if (weddingEvent) {
                                                updateEvent(weddingEvent.id, { heading: e.target.value });
                                            }
                                        }}
                                        placeholder="Enter heading"
                                    />
                                </div>

                                <div className={styles.editorField}>
                                    <label>Welcome Message</label>
                                    <textarea
                                        className={clsx(styles.editorInput, styles.editorTextarea)}
                                        style={{ minHeight: '80px' }}
                                        value={formData.invitationMessage}
                                        onChange={(e) => updateFormData({ invitationMessage: e.target.value })}
                                        placeholder="We are pleased to invite you..."
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
