'use client';

import { useWeddingStore } from '@/store/wedding-store';
import type { Theme } from '@/lib/constants/themes';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import styles from '@/components/preview/Preview.module.css';
import { ChevronLeft, Headphones, Play } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const cardRef = useRef<InvitationCardRef>(null);
    const router = useRouter();

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

    // Navigate to payment screen when securing bundle
    useEffect(() => {
        if (isSecuring) {
            const timer = setTimeout(() => {
                router.push('/payment');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isSecuring, router]);

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
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#333',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>



                    <div
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InvitationCard
                            ref={cardRef}
                            key={`preview-${selectedPreviewIndex}-${resetKey}`}
                            event={previewItems[selectedPreviewIndex]?.event || {
                                id: `design-${selectedPreviewIndex}`,
                                name: `Design ${selectedPreviewIndex + 1}`,
                                date: formData.primaryDate,
                                time: formData.primaryTime,
                                venue: formData.defaultVenueName
                            }}
                            theme={theme}
                            groomName={formData.groomName || undefined}
                            brideName={formData.brideName || undefined}
                            groomParents={formData.groomParents || undefined}
                            brideParents={formData.brideParents || undefined}
                            welcomeMessage={formData.invitationMessage || undefined}
                            isPlaceholder={true}
                            type='image'
                            customImage={previewItems[selectedPreviewIndex]?.image}
                            isSecured={false} // Preview always has watermarks unless downloaded
                            showSizingBoxes={isEditMode}
                        />

                        {/* On-Invite Action Buttons */}
                        {!isEditMode ? (
                            <div style={{
                                position: 'absolute', top: '1.5rem', right: '1.5rem',
                                display: 'flex', gap: '1rem', zIndex: 10
                            }}>
                                <button
                                    onClick={() => {
                                        if (cardRef.current) {
                                            cardRef.current.downloadImage();
                                        }
                                    }}
                                    style={{
                                        background: '#3B82F6', color: 'white', border: 'none', borderRadius: '50%',
                                        width: '48px', height: '48px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Download Invitation"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                </button>

                                <button
                                    onClick={() => setIsEditMode(true)}
                                    style={{
                                        background: '#1a4d2e', color: 'white', border: 'none', borderRadius: '50%',
                                        width: '48px', height: '48px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Edit Layout"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                position: 'absolute', top: '1.5rem', right: '1.5rem',
                                display: 'flex', gap: '1rem', zIndex: 10
                            }}>
                                <button
                                    onClick={() => {
                                        setResetKey(prev => prev + 1); // Discard layout changes by force remounting
                                        setIsEditMode(false);
                                    }}
                                    style={{
                                        background: 'white', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '50%',
                                        width: '48px', height: '48px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                        transition: 'background 0.2s, transform 0.2s',
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
                                    title="Cancel"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        if (cardRef.current && selectedPreviewIndex !== null) {
                                            const edits = cardRef.current.saveEdits();
                                            const newFormData = { ...formData };
                                            let formDataChanged = false;
                                            
                                            const currentEventId = previewItems[selectedPreviewIndex]?.event?.id;
                                            const currentEvent = formData.events?.find(e => e.id === currentEventId);

                                            if (edits['groom-name'] !== undefined && edits['groom-name'] !== formData.groomName) {
                                                newFormData.groomName = edits['groom-name'];
                                                formDataChanged = true;
                                            }
                                            if (edits['bride-name'] !== undefined && edits['bride-name'] !== formData.brideName) {
                                                newFormData.brideName = edits['bride-name'];
                                                formDataChanged = true;
                                            }
                                            if ((edits['groom-parents'] !== undefined || edits['groom-parent-name'] !== undefined)) {
                                                const gp = edits['groom-parents'] !== undefined ? edits['groom-parents'] : edits['groom-parent-name'];
                                                if (gp !== undefined && gp !== formData.groomParents) {
                                                    newFormData.groomParents = gp;
                                                    formDataChanged = true;
                                                }
                                            }
                                            if ((edits['bride-parents'] !== undefined || edits['bride-parent-name'] !== undefined)) {
                                                const bp = edits['bride-parents'] !== undefined ? edits['bride-parents'] : edits['bride-parent-name'];
                                                if (bp !== undefined && bp !== formData.brideParents) {
                                                    newFormData.brideParents = bp;
                                                    formDataChanged = true;
                                                }
                                            }
                                            if (edits['welcome-message'] !== undefined && edits['welcome-message'] !== formData.invitationMessage) {
                                                newFormData.invitationMessage = edits['welcome-message'];
                                                formDataChanged = true;
                                            }

                                            if ((edits['event-venue'] !== undefined || edits['venue'] !== undefined)) {
                                                const v = edits['event-venue'] !== undefined ? edits['event-venue'] : edits['venue'];
                                                if (v !== undefined && v !== formData.defaultVenueName) {
                                                    newFormData.defaultVenueName = v;
                                                    formDataChanged = true;
                                                }
                                            }
                                            if (edits['event-date'] !== undefined && edits['event-date'] !== formData.primaryDate) {
                                                newFormData.primaryDate = edits['event-date'];
                                                formDataChanged = true;
                                            }
                                            if (edits['event-time'] !== undefined && edits['event-time'] !== formData.primaryTime) {
                                                newFormData.primaryTime = edits['event-time'];
                                                formDataChanged = true;
                                            }

                                            if (formDataChanged) {
                                                updateFormData(newFormData);
                                            }

                                            if (currentEvent) {
                                                let eventChanged = false;
                                                const updatedEvent = { ...currentEvent };

                                                if (edits['event-name'] !== undefined && edits['event-name'] !== (currentEvent.heading || currentEvent.name)) {
                                                    updatedEvent.heading = edits['event-name'];
                                                    eventChanged = true;
                                                }
                                                if (edits['event-date'] !== undefined && edits['event-date'] !== currentEvent.date) {
                                                    updatedEvent.date = edits['event-date'];
                                                    eventChanged = true;
                                                }
                                                if (edits['event-time'] !== undefined && edits['event-time'] !== currentEvent.time) {
                                                    updatedEvent.time = edits['event-time'];
                                                    eventChanged = true;
                                                }
                                                if ((edits['event-venue'] !== undefined || edits['venue'] !== undefined)) {
                                                    const v = edits['event-venue'] !== undefined ? edits['event-venue'] : edits['venue'];
                                                    if (v !== undefined && v !== currentEvent.venue) {
                                                        updatedEvent.venue = v;
                                                        updatedEvent.isCustomVenue = true;
                                                        eventChanged = true;
                                                    }
                                                }
                                                
                                                if (eventChanged) {
                                                    updateEvent(currentEvent.id, updatedEvent);
                                                }
                                            }
                                        }
                                        setIsEditMode(false);
                                    }}
                                    style={{
                                        background: '#1a4d2e', color: 'white', border: 'none', borderRadius: '50%',
                                        width: '48px', height: '48px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Done"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </button>
                            </div>
                        )}
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
                                        groomName={formData.groomName || undefined}
                                        brideName={formData.brideName || undefined}
                                        groomParents={formData.groomParents || undefined}
                                        brideParents={formData.brideParents || undefined}
                                        welcomeMessage={formData.invitationMessage || undefined}
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
