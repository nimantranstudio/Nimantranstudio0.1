'use client';

import { useWeddingStore } from '@/store/wedding-store';
import type { Theme } from '@/lib/constants/themes';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import styles from '@/components/preview/Preview.module.css';
import { ChevronLeft, Headphones, Play, Edit, Download, Share2, Check, Lock, Link as LinkIcon, Copy, Sparkles, MessageCircle, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import confetti from 'canvas-confetti';
import { Suspense } from 'react';

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
    return (
        <Suspense fallback={<div>Loading preview...</div>}>
            <PreviewContent />
        </Suspense>
    );
}

import { ProcessingOverlay } from '@/components/processing/ProcessingOverlay';

function PreviewContent() {
    const { formData, selectedThemeId, isAuthenticated, login, bundleImages, bundleItems, selectedPlan } = useWeddingStore();
    const [isSecuring, setIsSecuring] = useState(false);
    const [packages, setPackages] = useState<any[]>([]);
    const [theme, setTheme] = useState<any | null>(null);

    // Dynamic pricing lookup based on selected plan and available packages
    const planLabelMap: Record<string, string> = {
        'essentials': 'WhatsApp Essentials',
        'posters': 'WhatsApp + Posters',
        'complete': 'Complete Wedding Suite'
    };

    const targetPackage = packages.find(p => p.name === planLabelMap[selectedPlan || 'essentials']);
    const activeBundle = theme?.bundles?.[0];
    const activeInvoice = activeBundle?.bundleInvoices?.find((inv: any) => inv.packageId === targetPackage?.id);

    // Pricing values from DB with fallbacks
    const pricing = {
        packageName: targetPackage?.name || 'WhatsApp Essentials',
        designSuite: activeInvoice?.invitationDesignSuite ?? 1540,
        rsvpTracking: activeInvoice?.rsvpManagementTracking ?? 735,
        guestDashboard: activeInvoice?.guestDashboard ?? 400,
        totalValue: activeInvoice?.totalWeddingSuiteValue ?? 2675,
        discount: activeInvoice?.discount ?? 1676,
        discountedPrice: activeInvoice?.discountedPrice ?? 2675,
        finalPrice: activeInvoice?.finalSellingPrice ?? 999
    };
    
    const discountPercent = pricing.totalValue > 0 
        ? Math.round(((pricing.totalValue - pricing.finalPrice) / pricing.totalValue) * 100) 
        : 0;
    const amountSaved = pricing.totalValue - pricing.finalPrice;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const cardRef = useRef<InvitationCardRef>(null);
    const suiteRefs = useRef<Record<string, InvitationCardRef | null>>({});
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Fluid transition state
    const [showProcessing, setShowProcessing] = useState(searchParams.get('processing') === 'true');
    const [copyStatus, setCopyStatus] = useState(false);

    // Generate RSVP Link based on couple names
    const rsvpSlug = `${formData.groomName?.toLowerCase().split(' ')[0] || 'wedding'}-${formData.brideName?.toLowerCase().split(' ')[0] || 'rsvp'}`;
    const rsvpFullUrl = `https://nimantran.app/rsvp/${rsvpSlug}`;

    const handleCopyRsvpLink = async () => {
        try {
            await navigator.clipboard.writeText(rsvpFullUrl);
            setCopyStatus(true);
            // Brief celebratory micro-burst
            confetti({
                particleCount: 30,
                spread: 40,
                origin: { y: 0.7 },
                colors: ['#D4AF37', '#F3E8D2'],
                gravity: 0.8,
                scalar: 0.8,
                zIndex: 1000
            });
            setTimeout(() => setCopyStatus(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const { updateFormData, updateEvent } = useWeddingStore();

    // Trigger seamless celebratory confetti if coming from old processing route
    useEffect(() => {
        if (searchParams.get('confetti') === 'true') {
            const trigger = (delay: number) => {
                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        spread: 160,
                        origin: { y: 0.6 },
                        colors: ['#D4AF37', '#AA861E', '#FFFFFF'],
                        gravity: 0.5,
                        scalar: 1.4,
                        zIndex: 20000
                    });
                }, delay);
            };
            trigger(0);
            trigger(1500);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch packages first
                const pkgRes = await fetch('/api/admin/packages');
                if (pkgRes.ok) {
                    const pkgData = await pkgRes.json();
                    setPackages(pkgData.packages || []);
                }

                if (!selectedThemeId) return;
                const res = await fetch(`/api/themes/${selectedThemeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTheme(data.theme);
                }
            } catch (error) {
                console.error("Failed to fetch theme or packages", error);
            }
        }
        fetchData();
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

        // Strict direct mapping since Event table IDs match CelebrationTimeline IDs
        // ID_MAPPING removed
        // Match bundleItems to wedding events by eventType or ID mapping
        const weddingEvents = formData.events || [];
        const items: Array<{ id: string; name: string; image: string; event: any }> = [];

        for (const bi of bundleItems) {
            if (!bi.templatePath) continue; 

            const rawType = bi.eventType || bi.event?.eventName || '';
            const biType = rawType.toUpperCase().replace(/_/g, '');
            const dbEventId = bi.eventId;

            // Find matching wedding event using multiple fallbacks
            let matchedEvent = weddingEvents.find(evt => {
                const masterId = evt.id.toLowerCase();
                
                // 1. Check ID Mapping first for precision (Highly reliable)
                if (dbEventId && dbEventId === masterId) return true;

                // Only if mapping fails, try name matching
                if (!biType) return false;

                const evtType = (evt.eventType || '').toUpperCase();
                const evtName = (evt.name || '').toUpperCase();

                // 2. Check name (Avoid empty string matching)
                if (evtName && biType.includes(evtName)) return true;

                // 3. Special cases for common naming
                if (biType.includes('WEDDING') && evtName.includes('WEDDING')) return true;
                if (biType.includes('HALDI') && evtName.includes('HALDI')) return true;
                if (biType.includes('MEHENDI') && evtName.includes('MEHENDI')) return true;
                if (biType.includes('SANGEET') && evtName.includes('SANGEET')) return true;
                if (biType.includes('RECEPTION') && evtName.includes('RECEPTION')) return true;

                return false;
            });

            // If no match found, default to 'wedding' for generic wedding items
            if (!matchedEvent && biType.includes('WEDDING')) {
                matchedEvent = weddingEvents.find(e => e.id === 'evt_7');
            }

            const displayName = matchedEvent?.heading || matchedEvent?.name || bi.event?.eventName || bi.templateName || bi.eventType || 'Invitation';

            const isWedding = matchedEvent?.id === 'evt_7' || biType.includes('WEDDING');

            items.push({
                id: bi.id,
                name: displayName,
                image: bi.templatePath,
                event: matchedEvent ? {
                    id: matchedEvent.id,
                    name: matchedEvent.heading || matchedEvent.name,
                    // Only fallback to primary details if it's the main wedding event
                    date: isWedding ? (matchedEvent.date || formData.primaryDate) : (matchedEvent.date || undefined),
                    time: isWedding ? (matchedEvent.time || formData.primaryTime) : (matchedEvent.time || undefined),
                    venue: isWedding 
                        ? ((matchedEvent.isCustomVenue && matchedEvent.venue) ? matchedEvent.venue : formData.defaultVenueName) 
                        : (matchedEvent.venue || undefined),
                    tagline: matchedEvent.tagline,
                    description: matchedEvent.description,
                    heading: matchedEvent.heading
                } : {
                    id: bi.id,
                    name: displayName,
                    date: isWedding ? formData.primaryDate : undefined,
                    time: isWedding ? formData.primaryTime : undefined,
                    venue: isWedding ? formData.defaultVenueName : undefined
                }
            });
        }

        return items;
    };

    const getItemDescription = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('video')) return "Short modern invite announcement video";
        if (n.includes('rsvp')) return "Personalized link to collect responses";
        if (n.includes('save the date')) return "WhatsApp and story-formatted image";
        if (n.includes('haldi')) return "Delightful WhatsApp-ready image card";
        if (n.includes('mehendi')) return "Delightful WhatsApp-ready image card";
        if (n.includes('sangeet')) return "Sophisticated WhatsApp-ready image card";
        if (n.includes('reception')) return "Classy WhatsApp-ready image card";
        return "Elegant WhatsApp-ready image card";
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
                            inviteFor={formData.inviteFor}
                            isPlaceholder={true}
                            type='image'
                            customImage={previewItems[selectedPreviewIndex]?.image}
                            isSecured={true} // Preview always has watermarks unless downloaded
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
                                    title="Download High Res"
                                >
                                    <Download size={24} />
                                </button>
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    style={{
                                        background: '#10B981', color: 'white', border: 'none', borderRadius: '50%',
                                        width: '48px', height: '48px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Live Edit"
                                >
                                    <Edit size={24} />
                                </button>
                                <button
                                    onClick={() => {
                                        const text = encodeURIComponent(`Check out our wedding invitation!\n\n${window.location.href}`);
                                        window.open(`https://wa.me/?text=${text}`, '_blank');
                                    }}
                                    style={{
                                        background: '#F59E0B', color: 'white', border: 'none', borderRadius: '50%',
                                        width: '48px', height: '48px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Share Link"
                                >
                                    <Share2 size={24} />
                                </button>
                            </div>
                        ) : (
                            /* Done Editing Button */
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
                                            console.log("Saving invitation edits:", edits);
                                            
                                            // Apply global edits
                                            const newFormData = { ...formData };
                                            let formDataChanged = false;
                                            
                                            const currentItem = previewItems[selectedPreviewIndex];
                                            const currentEvent = currentItem?.event;

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


            <main className="container">
                <div className={styles.mainLayout}>
                    {/* Left Column: Suite List */}
                    <div className={styles.leftColumn}>
                        <div className={styles.suiteCard}>
                            <h2 className={styles.suiteHeaderTitle}>Your Wedding Invite Suite is Ready!</h2>
                            <div className={styles.suiteList}>
                                {(previewItems.length > 0) ? (
                                    previewItems.map((item, index) => (
                                        <div key={item.id} className={styles.suiteItem}>
                                            <div className={styles.suiteThumbContainer} onClick={() => setSelectedPreviewIndex(index)}>
                                                <InvitationCard 
                                                    ref={el => { suiteRefs.current[item.id] = el; }}
                                                    event={item.event}
                                                    theme={theme}
                                                    groomName={formData.groomName || ''}
                                                    brideName={formData.brideName || ''}
                                                    groomParents={formData.groomParents}
                                                    brideParents={formData.brideParents}
                                                    welcomeMessage={formData.invitationMessage}
                                                    inviteFor={formData.inviteFor}
                                                    isPlaceholder={true}
                                                    customImage={item.image}
                                                    className={styles.suiteThumbCard}
                                                    isSecured={true}
                                                />
                                                <div className={styles.suitePreviewOverlay}>Preview</div>
                                            </div>
                                            <div className={styles.suiteInfo}>
                                                <h3 className={styles.suiteItemTitle}>{item.name.includes('Invite') ? item.name : `${item.name} Invite`}</h3>
                                                <p className={styles.suiteItemDesc}>{getItemDescription(item.name)}</p>
                                                <p className={styles.suiteItemActionHint}>Share instantly after unlock</p>
                                            </div>
                                            <div className={styles.suiteActions}>
                                                <div className={styles.suiteQuickActions}>
                                                    <button 
                                                        className={styles.suiteQuickActionBtn}
                                                        onClick={() => { setSelectedPreviewIndex(index); setIsEditMode(true); }}
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        className={styles.suiteQuickActionBtn}
                                                        onClick={() => { 
                                                            const ref = suiteRefs.current[item.id];
                                                            if (ref) ref.downloadImage();
                                                        }}
                                                        title="Download"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button 
                                                        className={styles.suiteQuickActionBtn}
                                                        onClick={() => {
                                                            const text = encodeURIComponent(`Check out our ${item.name}!\n\n${window.location.href}`);
                                                            window.open(`https://wa.me/?text=${text}`, '_blank');
                                                        }}
                                                        title="Share"
                                                    >
                                                        <Share2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noPreviews} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                        No preview images available for this theme.
                                    </div>
                                )}

                                {/* RSVP Link Card */}
                                <div className={styles.suiteItem} style={{ alignItems: 'flex-start' }}>
                                    <div className={styles.rsvpPreviewPlaceholder}>
                                        <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
                                            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-playfair)', fontWeight: 'bold' }}>{formData.groomName?.split(' ')[0]} & {formData.brideName?.split(' ')[0]}</div>
                                        </div>
                                        <div className={styles.rsvpPreviewForm}>
                                            <div className={styles.rsvpPreviewLine}></div>
                                            <div className={styles.rsvpPreviewLine} style={{ width: '80%' }}></div>
                                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                                <div style={{ height: '12px', width: '12px', background: '#F3F4F6', borderRadius: '2px' }}></div>
                                                <div style={{ height: '12px', width: '12px', background: '#F3F4F6', borderRadius: '2px' }}></div>
                                            </div>
                                            <div className={styles.rsvpPreviewBtn}></div>
                                        </div>
                                    </div>

                                    <div className={styles.suiteInfo}>
                                        <h3 className={styles.suiteItemTitle}>RSVP Link</h3>
                                        <p className={styles.suiteItemDesc}>Smart guest response collection page</p>
                                        
                                        <div className={styles.rsvpUrlSection}>
                                            <div className={styles.rsvpUrlBox}>
                                                <span className={styles.rsvpUrlText}>{rsvpFullUrl.replace('https://', '')}</span>
                                                <button 
                                                    className={styles.copyPill} 
                                                    onClick={handleCopyRsvpLink}
                                                    title={copyStatus ? "Copied!" : "Copy Link"}
                                                    style={{ background: copyStatus ? '#10B981' : '#F1F5F9', color: copyStatus ? 'white' : '#1E293B' }}
                                                >
                                                    {copyStatus ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={styles.suiteActions}>
                                        <div className={styles.suiteQuickActions} style={{ marginTop: '0.5rem' }}>
                                            <button className={styles.suiteQuickActionBtn} title="Edit RSVP Template">
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                className={styles.suiteQuickActionBtn} 
                                                title="Share on WhatsApp"
                                                onClick={() => {
                                                    const text = encodeURIComponent(`We would love to have you at our wedding! \n\nPlease RSVP here: ${rsvpFullUrl}`);
                                                    window.open(`https://wa.me/?text=${text}`, '_blank');
                                                }}
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Title and Summary Card */}
                    <div className={styles.rightColumn}>
                        <div className={styles.summaryView}>
                            <div className={styles.summaryCard}>
                                <h1 className={styles.designTitle}>
                                    Unlock Your Wedding Suite
                                </h1>

                                <div className={styles.breakdownBox}>
                                    <div className={styles.popularBadge}>
                                        <div className={styles.badgeCheck}>
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                        <span>Popular this month</span>
                                    </div>
                                    <div className={styles.designDetailsList}>
                                        <div className={styles.designDetailSubheader}>{pricing.packageName}</div>
                                        <div className={styles.themeNameLabel}>{theme?.name || 'Wedding Theme ✨'}</div>
                                        <div className={styles.designDetailRow}>
                                            <span>Invitation design suite</span>
                                            <span>₹{pricing.designSuite}</span>
                                        </div>
                                        <div className={styles.designDetailRow}>
                                            <span>RSVP management & tracking</span>
                                            <span>₹{pricing.rsvpTracking}</span>
                                        </div>
                                        <div className={styles.designDetailRow}>
                                            <span>Guest dashboard + hosting</span>
                                            <span>₹{pricing.guestDashboard}</span>
                                        </div>
                                        <div className={styles.designDivider}></div>
                                        <div className={styles.totalValueRow}>
                                            <span>Total Wedding Suite Value</span>
                                            <span>₹{pricing.totalValue}</span>
                                        </div>
                                    </div>

                                    <div className={styles.offerRow}>
                                        <span>Launch Offer Discount</span>
                                        <span>{discountPercent}% OFF</span>
                                    </div>

                                    <div className={styles.finalPriceSection}>
                                        <div className={styles.priceLeft}>
                                            <span className={styles.originalPrice}>Total Amount</span>
                                        </div>
                                        <div className={styles.finalPriceRight}>
                                            <span className={styles.strikethroughPrice}>₹{pricing.totalValue}</span>
                                            <span className={`${styles.finalPrice} ${isButtonHovered ? styles.finalPriceMagnetic : ''}`}>₹{pricing.finalPrice}</span>
                                        </div>
                                    </div>

                                    <div className={styles.savingsBanner}>
                                        ✨ You saved ₹{pricing.discountedPrice} on your wedding communication suite
                                    </div>
                                    <div className={styles.socialProofLine}>
                                        ✨ Chosen by 24 families this month
                                    </div>
                                </div>

                                <div className={styles.partitionLine}></div>

                                <button
                                    className={styles.unlockButton}
                                    onClick={handleCheckout}
                                    onMouseEnter={() => setIsButtonHovered(true)}
                                    onMouseLeave={() => setIsButtonHovered(false)}
                                >
                                    Unlock My Wedding Invites
                                </button>

                                <div className={styles.featureList}>
                                    <div className={styles.featureItem}>
                                        <div className={styles.checkWrapper}><Check size={10} strokeWidth={4} /></div>
                                        <span>Instant delivery</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <div className={styles.checkWrapper}><Check size={10} strokeWidth={4} /></div>
                                        <span>Secure Payments</span>
                                    </div>
                                    <div className={styles.featureItem}>
                                        <div className={styles.checkWrapper}><Check size={10} strokeWidth={4} /></div>
                                        <span>Free edits for 15 days</span>
                                    </div>
                                </div>

                                <p className={styles.footerNote}>
                                    Most couples start sharing invites within 10 minutes after payment.
                                </p>
                            </div>
                        </div>

                        {/* Info Blocks below the card */}
                        <div className={styles.infoBlockContainer}>
                            <div className={styles.infoBoxFull}>
                                <h3 className={styles.infoBoxTitle}>SATISFACTION GUARANTEED</h3>
                                <p className={styles.infoBoxText}>
                                    Final assets will be generated without watermarks in high definition immediately after payment. Editing allowed for next 15 days.
                                </p>
                            </div>
                            <div className={styles.infoBoxSplit}>
                                <div className={styles.infoBoxHalf}>
                                    <Headphones size={24} className={styles.infoIcon} />
                                    <div className={styles.infoContent}>
                                        <span className={styles.infoLabel}>Need Help? Contact Us</span>
                                        <span className={styles.infoValue}>+91 80105 81916</span>
                                    </div>
                                </div>
                                <div className={styles.infoBoxHalf}>
                                    <ShieldCheck size={24} className={styles.infoIcon} />
                                    <span className={styles.infoValue}>SECURE PAYMENTS</span>
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
            {showProcessing && (
                <ProcessingOverlay onComplete={() => setShowProcessing(false)} />
            )}
        </div>
    );
}
