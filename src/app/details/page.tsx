'use client';

export const dynamic = 'force-dynamic';

import { useWeddingStore } from '@/store/wedding-store';
import { Input } from '@/components/form/Input';
import styles from './details.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { 
    ChevronDown, 
    Check, 
    Sparkles, 
    Heart, 
    MapPin, 
    Calendar, 
    Users, 
    ArrowUp, 
    ArrowDown, 
    Trash2,
    Clock,
    CheckCircle2, 
    Loader2, 
    X,
    ExternalLink,
    AlertCircle,
    ArrowRight,
    Play
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RSVPForm } from '@/app/rsvp/[id]/RSVPForm';
import type { Theme } from '@/lib/constants/themes';
import { DEFAULT_EVENTS, type WeddingEvent } from '@/lib/schemas/wedding-form';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import { PreviewCard } from '@/components/preview/PreviewCard';
import { IntricateMandalaSvg } from '@/components/ui/IntricateMandala';
import confetti from 'canvas-confetti';
import { resolveEventSections } from '@/lib/templates/event-type';

// Motion variants for welcome popup transitions (apple-design / emil-design-eng / ui-ux-pro-max)
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as const } 
    },
    exit: { 
        opacity: 0, 
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } 
    }
};

const cardVariants = {
    hidden: { scale: 0.94, opacity: 0, y: 12 },
    visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring" as const, 
            bounce: 0.15,
            duration: 0.4,
            staggerChildren: 0.04,
            delayChildren: 0.05
        }
    },
    exit: { 
        scale: 0.96, 
        opacity: 0,
        y: -10,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } 
    }
};

const itemVariants = {
    hidden: { y: 8, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1, 
        transition: { type: "spring" as const, bounce: 0.2, duration: 0.35 }
    }
};

function DetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        formData,
        updateFormData,
        saveWedding,
        selectedThemeId,
        bundleImages,
        bundleItems,
        selectedPlan,
        setBundleData,
        addEvent,
        removeEvent,
        updateEvent
    } = useWeddingStore();

    // Studio Active Chapter State (1: Your Story, 2: The Ceremony, 3: Celebrate Every Moment, 4: Ready to Invite)
    const [activeChapter, setActiveChapter] = useState<number>(1);
    
    // Focused field state for visual glows on preview
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Auto-save Status State: 'synced' | 'saving' | 'error'
    const [saveStatus, setSaveStatus] = useState<'synced' | 'saving' | 'error'>('synced');
    const [isMounted, setIsMounted] = useState(false);

    // Timeline Preview State
    const [activePreviewEventId, setActivePreviewEventId] = useState<string>('wedding');

    // Event Delete Confirmation State
    const [eventToDelete, setEventToDelete] = useState<{ id: string; name: string } | null>(null);

    // Welcome Overlay State
    const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
    const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
    const [isDetailsConfirmed, setIsDetailsConfirmed] = useState(false);
    const [isCrafting, setIsCrafting] = useState(false);
    const cardRef = useRef<InvitationCardRef>(null);

    // Step 1 — ASSIGN: give every "Celebrate Every Moment" section its Event.id.
    // `bundleItems` is already scoped to exactly one bundle (the theme's own, fetched per
    // selectedThemeId), so nothing here needs to guard against cross-bundle leakage — only
    // *which item within it* belongs to *which section*.
    //
    // bundleItem.eventId already *is* Event.id (it's the Prisma foreign key) — that part of
    // the join needs no resolving. The actual gap is that the wedding form's own event list
    // (formData.events) carries no field linking a local event ('haldi') back to that id at
    // all, so classification runs once here, per bundleItem, to bridge it (see
    // resolveEventSections). Every lookup after this point is a plain eventId equality
    // check — no more name or filename comparisons.
    const eventSections = useMemo(
        () => resolveEventSections(bundleItems, formData.events),
        [bundleItems, formData.events]
    );

    // Step 2 — SELECT: which local section is currently active, from UI state alone.
    const activeLocalEventId = (activeChapter === 3 && activePreviewEventId && activePreviewEventId !== 'wedding')
        ? activePreviewEventId
        : 'wedding';

    // Step 3 — MATCH: bundleItem.eventId === section.eventId. This is the only place a
    // BundleItem is looked up by id from here on.
    const targetBundleItem = useMemo(() => {
        if (!bundleItems || bundleItems.length === 0) return null;

        const activeSection = eventSections.find(s => s.localEventId === activeLocalEventId);
        let match = activeSection ? bundleItems.find(item => item.eventId === activeSection.eventId) : undefined;

        // Fall back to the wedding template if this specific event has no template of its own.
        if (!match) {
            const weddingSection = eventSections.find(s => s.localEventId === 'wedding');
            match = weddingSection ? bundleItems.find(item => item.eventId === weddingSection.eventId) : undefined;
        }

        return match || null;
    }, [bundleItems, eventSections, activeLocalEventId]);

    const templateUrl = useMemo(() => {
        // 1. The eventId-matched bundleItem, when one exists.
        if (targetBundleItem?.templatePath) return targetBundleItem.templatePath;

        // 2. Any HTML item at all, then any item — better than a blank preview.
        if (bundleItems && bundleItems.length > 0) {
            const anyHtmlItem = bundleItems.find(item => item.templatePath && item.templatePath.toLowerCase().includes('.html'));
            if (anyHtmlItem) return anyHtmlItem.templatePath;
            if (bundleItems[0]?.templatePath) return bundleItems[0].templatePath;
        }

        // 3. Legacy themes with no bundleItems at all, just a flat image list.
        if (bundleImages && bundleImages.length > 0) {
            let searchTerm = 'wedding';
            if (activeChapter === 3 && activePreviewEventId && activePreviewEventId !== 'wedding') {
                const foundEvent = formData.events?.find(e => e.id === activePreviewEventId);
                searchTerm = (foundEvent?.name || activePreviewEventId).toLowerCase();
            }
            let targetImage = searchTerm !== 'wedding' ? bundleImages.find(img => img.toLowerCase().includes(searchTerm)) : undefined;
            if (!targetImage) {
                targetImage = bundleImages.find(img => img.toLowerCase().includes('wedding') || img.toLowerCase().includes('reception') || img.includes('item-Wedding_Invitation'));
            }
            return targetImage || bundleImages[0];
        }

        return undefined;
    }, [targetBundleItem, bundleItems, bundleImages, activeChapter, activePreviewEventId, formData.events]);

    // The resolved bundleItem row can exist while its actual file on disk doesn't (e.g. an
    // admin-uploaded template that was later moved/deleted) — verify existence so a dead
    // link shows a clean message instead of the browser's raw 404 page inside the iframe.
    const [templateMissing, setTemplateMissing] = useState(false);
    useEffect(() => {
        if (!templateUrl || !templateUrl.toLowerCase().endsWith('.html')) {
            setTemplateMissing(false);
            return;
        }
        let alive = true;
        fetch(templateUrl, { method: 'HEAD', cache: 'no-store' })
            .then(res => { if (alive) setTemplateMissing(!res.ok); })
            .catch(() => { if (alive) setTemplateMissing(true); });
        return () => { alive = false; };
    }, [templateUrl]);

    // When the active card is a designed (structured) template, resolve its CardDocument
    // layout so we render it via CardRenderer instead of loading the marker as an image.
    const activeStructuredLayout = useMemo(() => {
        if (!templateUrl || !templateUrl.startsWith('structured:')) return null;
        const it = (bundleItems || []).find((i: any) => i.templatePath === templateUrl);
        return (it as any)?.layout || null;
    }, [templateUrl, bundleItems]);

    const isHTMLDesign = !!templateUrl && templateUrl.toLowerCase().includes('.html');
    // A designed (structured) card is a single self-contained story card — like the
    // HTML cards, it should sit still in the frame, not be panned by the camera.
    const isDesignedCard = !!templateUrl && templateUrl.startsWith('structured:');
    const noCameraPan = isHTMLDesign || isDesignedCard;

    const previewEvent = useMemo(() => {
        if (activeChapter === 3 && activePreviewEventId && activePreviewEventId !== 'wedding') {
            const foundEvent = formData.events?.find(e => e.id === activePreviewEventId);
            if (foundEvent) return foundEvent;
        }
        return { 
            id: 'default', 
            date: formData.primaryDate, 
            time: formData.primaryTime, 
            venue: formData.defaultVenueName, 
            name: 'Wedding' 
        };
    }, [activeChapter, activePreviewEventId, formData]);

    const cameraY = isCrafting ? '-80%' :
                    activeChapter === 1 ? '0%' :
                    activeChapter === 2 ? (noCameraPan ? '0%' : '-15%') :
                    activeChapter === 3 ? (noCameraPan ? '0%' : '-40%') :
                    activeChapter === 4 ? (noCameraPan ? '0%' : '-65%') : '0%';

    const dismissWelcomeOverlay = () => {
        setShowWelcomeOverlay(false);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const triggerCelebrationExplosion = () => {
        // Refined background confetti matching Success overlay
        confetti({
            particleCount: 75, 
            spread: 140,
            origin: { x: 0.5, y: 0.5 },
            angle: 90, 
            colors: ['#D4AF37', '#AA861E', '#FFFFFF', '#E5E4E2'],
            shapes: ['circle', 'square'],
            gravity: 0.5, 
            scalar: 1.0, 
            ticks: 190, 
            startVelocity: 34, 
            drift: 0.05, 
            zIndex: 10005 
        });
        
        // Refined foreground confetti (cinematic depth of field simulation)
        confetti({
            particleCount: 15, 
            spread: 160,
            origin: { x: 0.5, y: 0.5 },
            angle: 90, 
            colors: ['#D4AF37', '#FFFFFF'],
            shapes: ['circle'],
            gravity: 0.55, 
            scalar: 1.8, 
            ticks: 190, 
            startVelocity: 42, 
            zIndex: 10006 
        });
    };

    useEffect(() => {
        setIsMounted(true);
        if (searchParams.get('welcome') === 'true') {
            setShowWelcomeOverlay(true);
            triggerCelebrationExplosion();
            
            // Smooth auto-dismiss after 2 seconds so user has time to read and enjoy the moment
            const timer = setTimeout(() => {
                dismissWelcomeOverlay();
            }, 2000);
            return () => {
                clearTimeout(timer);
                try {
                    confetti.reset();
                } catch (_) {}
            };
        }
    }, [searchParams]);

    // Fetch theme config and refresh bundleItems from DB on every details page load
    useEffect(() => {
        if (!selectedThemeId) return;

        async function fetchTheme() {
            try {
                const res = await fetch(`/api/themes/${selectedThemeId}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setActiveTheme(data.theme);
                    // Refresh bundleItems so admin template updates are reflected immediately
                    const freshItems = data.theme?.bundles?.[0]?.bundleItems || [];
                    if (freshItems.length > 0) {
                        setBundleData(selectedPlan, bundleImages, freshItems);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch theme", error);
            }
        }
        fetchTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedThemeId]);

    // Auto-save useEffect with 1s debounce
    useEffect(() => {
        if (!isMounted) return;

        setSaveStatus('saving');
        const timer = setTimeout(async () => {
            try {
                const result = await saveWedding();
                if (result.success) {
                    setSaveStatus('synced');
                } else {
                    setSaveStatus('error');
                }
            } catch (err) {
                setSaveStatus('error');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [
        formData.groomName,
        formData.brideName,
        formData.groomParents,
        formData.brideParents,
        formData.primaryDate,
        formData.primaryTime,
        formData.defaultVenueName,
        formData.primaryMapLink,
        formData.events,
        formData.eventType,
        formData.rsvpDeadline,
        formData.invitationMessage,
    ]);

    const themeName = activeTheme ? activeTheme.name : 'Choose Theme';

    // Formatting date helper for cover display
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "DECEMBER 15, 2026";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }).toUpperCase();
        } catch (e) {
            return dateStr.toUpperCase();
        }
    };

    // Reorder Timeline events helper
    const moveEvent = (index: number, direction: 'up' | 'down') => {
        if (!formData.events) return;
        const newEvents = [...formData.events];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newEvents.length) return;
        
        // Swap elements
        const temp = newEvents[index];
        newEvents[index] = newEvents[targetIndex];
        newEvents[targetIndex] = temp;

        updateFormData({ events: newEvents });
    };

    // Confirm and execute event deletion
    const handleConfirmDeleteEvent = () => {
        if (!eventToDelete) return;
        const deletedId = eventToDelete.id;
        removeEvent(deletedId);
        if (activePreviewEventId === deletedId) {
            setActivePreviewEventId('wedding');
        }
        setEventToDelete(null);
    };

    // Keyboard support: dismiss delete confirmation on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && eventToDelete) {
                setEventToDelete(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [eventToDelete]);

    // Add new custom event helper
    const handleAddCeremony = () => {
        const id = `custom_${Date.now()}`;
        const newEvent: WeddingEvent = {
            id,
            name: 'New Ceremony',
            date: formData.primaryDate || '',
            time: '18:30',
            venue: '',
        };
        addEvent(newEvent);
    };

    // Focus state listeners
    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    // Complete editing CTA
    const handleFinish = async () => {
        setSaveStatus('saving');
        
        saveWedding().then(result => {
            if (result.success) setSaveStatus('synced');
            else setSaveStatus('error');
        }).catch(() => {
            setSaveStatus('error');
        });

        router.push('/preview?processing=true');
    };

    // Swap names logic - mapped to invitationFor / bride/groom selection
    const isBrideFirst = formData.invitationFor ? formData.invitationFor === 'bride' : formData.nameOrder === 'bride_first';
    const displayGroomName = isBrideFirst ? formData.brideName : formData.groomName;
    const displayBrideName = isBrideFirst ? formData.groomName : formData.brideName;
    const displayGroomParents = isBrideFirst ? formData.brideParents : formData.groomParents;
    const displayBrideParents = isBrideFirst ? formData.groomParents : formData.brideParents;

    return (
        <div className={styles.page}>
            <AnimatePresence onExitComplete={() => { try { confetti.reset(); } catch (_) {} }}>
                {showWelcomeOverlay && (
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={styles.transitionOverlay}
                        style={{ zIndex: 10000 }}
                        onClick={dismissWelcomeOverlay}
                    >
                        <motion.div
                            variants={cardVariants}
                            className={styles.transitionContent}
                        >
                            <motion.div
                                variants={itemVariants}
                                className={styles.transitionIconWrapper}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5, ease: [0.77, 0, 0.175, 1] }}
                                >
                                    <Heart className={styles.transitionHeartOutline} size={48} strokeWidth={0.75} />
                                </motion.div>
                            </motion.div>

                            <motion.h2
                                variants={itemVariants}
                                className={styles.transitionHeadline}
                            >
                                Great choice.
                            </motion.h2>

                            <motion.p
                                variants={itemVariants}
                                className={styles.transitionSupportingText}
                            >
                                Now let’s personalise your wedding invitation suite.
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className={styles.reassuranceContainer}
                            >
                                <span className={styles.reassurancePrimary}>Setting up your wedding workspace…</span>
                                <span className={styles.reassuranceSecondary}>Everything will be ready in a moment.</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Event Delete Confirmation Modal (ui-ux-pro-max) */}
            <AnimatePresence>
                {eventToDelete && (
                    <motion.div 
                        className={styles.deleteModalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        onClick={() => setEventToDelete(null)}
                    >
                        <motion.div 
                            className={styles.deleteModalCard}
                            initial={{ scale: 0.94, opacity: 0, y: 14 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.96, opacity: 0, y: 8 }}
                            transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-event-modal-title"
                        >
                            <div className={styles.deleteIconWrapper}>
                                <Trash2 size={22} strokeWidth={2} />
                            </div>
                            <h3 id="delete-event-modal-title" className={styles.deleteModalTitle}>
                                Delete Event?
                            </h3>
                            <p className={styles.deleteModalText}>
                                Are you sure you want to delete <strong>&ldquo;{eventToDelete.name}&rdquo;</strong>? This event card and its schedule will be removed from your wedding suite.
                            </p>
                            <div className={styles.deleteModalActions}>
                                <button 
                                    type="button" 
                                    className={styles.deleteBtnConfirm}
                                    onClick={handleConfirmDeleteEvent}
                                >
                                    Yes, Delete Event
                                </button>
                                <button 
                                    type="button" 
                                    className={styles.deleteBtnCancel}
                                    onClick={() => setEventToDelete(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className={styles.header}>
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Themes', href: '/themes' },
                        { label: `${themeName}${selectedPlan ? ` (${selectedPlan})` : ''}`, href: `/themes/${selectedThemeId}` },
                        { label: 'Wedding Details', active: true },
                    ]}
                />
                
                {/* Auto-Save Indicator */}
                {saveStatus === 'saving' && (
                    <div className={clsx(styles.saveStatus, styles.saving)}>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving Changes...</span>
                    </div>
                )}
            </header>

            <main className={styles.studioContainer}>
                {/* Sticky Left Preview Column (40%) */}
                <section className={styles.previewCol}>
                    <div className={styles.previewCardStage}>
                        {/* Outside Rotating Intricate Mandala on Left Side behind Card */}
                        <div className={styles.outsideMandala} aria-hidden="true">
                            <IntricateMandalaSvg idPrefix="details-outside-mandala" />
                        </div>

                        <div className={styles.inviteFrame}>
                            <div className={styles.paperSurface}>
                                <div className={styles.goldFoilOrnament}>
                                    <Sparkles size={28} />
                                </div>

                                {/* Live Invitation Continuous Camera System */}
                                <motion.div
                                    animate={{ y: activeChapter === 4 ? 0 : cameraY }}
                                    transition={isCrafting ? { ease: "linear", duration: 3.5 } : { type: "spring", bounce: 0, duration: 0.6 }}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <AnimatePresence mode="wait">
                                        {activeChapter === 4 ? (
                                            <motion.div
                                                key="rsvp-preview"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                                className={styles.rsvpPagePreviewContainer}
                                            >
                                                <RSVPForm wedding={{
                                                    id: 'preview',
                                                    groomName: formData.groomName || 'Groom',
                                                    brideName: formData.brideName || 'Bride',
                                                    themeId: 'default',
                                                    invitationMessage: formData.invitationMessage || "Please join us for our special day!",
                                                    allowCompanions: formData.allowCompanions || false,
                                                    collectDietary: formData.collectDietary || false,
                                                    events: [
                                                        {
                                                            id: 'wedding-ceremony',
                                                            name: 'Wedding Ceremony',
                                                            eventName: 'Wedding Ceremony',
                                                            date: formData.primaryDate,
                                                            time: formData.primaryTime,
                                                            venue: formData.defaultVenueName,
                                                            eventType: 'Wedding',
                                                            description: '',
                                                            heading: 'Wedding Ceremony',
                                                            isCustomVenue: false
                                                        },
                                                        ...(formData.events || [])
                                                    ]
                                                }} isPreview={true} />
                                            </motion.div>
                                        ) : templateMissing ? (
                                            <motion.div
                                                key={`invite-preview-missing-${previewEvent?.id || 'wedding'}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    aspectRatio: '9 / 16',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    textAlign: 'center',
                                                    padding: '32px',
                                                    background: '#FAF7F2',
                                                    border: '1px dashed #D4AF37',
                                                    borderRadius: '8px',
                                                    color: '#8A7B5C',
                                                }}
                                            >
                                                <span style={{ fontSize: '14px', fontWeight: 600 }}>Preview unavailable</span>
                                                <span style={{ fontSize: '12.5px', opacity: 0.85 }}>
                                                    The template for this event hasn&apos;t been uploaded yet. It will appear here once it&apos;s added in the theme&apos;s bundle.
                                                </span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={`invite-preview-${previewEvent?.id || 'wedding'}-${templateUrl}`}
                                                initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.96 }}
                                                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                                exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.96 }}
                                                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                                style={{ width: '100%', height: '100%' }}
                                            >
                                                <PreviewCard
                                                    ref={cardRef}
                                                    event={previewEvent}
                                                    theme={activeTheme || { id: 'default', name: 'Default', description: '', thumbnail: '', previewImages: [] }}
                                                    groomName={displayGroomName}
                                                    brideName={displayBrideName}
                                                    invitationFor={formData.invitationFor}
                                                    groomParents={displayGroomParents}
                                                    brideParents={displayBrideParents}
                                                    customImage={templateUrl}
                                                    structuredLayout={activeStructuredLayout}
                                                    structuredCouple={{
                                                        groomName: displayGroomName,
                                                        brideName: displayBrideName,
                                                        groomParents: displayGroomParents,
                                                        brideParents: displayBrideParents,
                                                        primaryDate: formData.primaryDate,
                                                        primaryTime: formData.primaryTime,
                                                        defaultVenueName: formData.defaultVenueName,
                                                    }}
                                                    isRawPreview={false}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Refresh Preview — clears localStorage saved layout and reloads the iframe */}
                    <button
                        onClick={() => cardRef.current?.clearCache?.()}
                        title="Clear cached layout and reload the preview"
                        style={{
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'none',
                            border: '1px solid #D4AF37',
                            borderRadius: '6px',
                            color: '#B39D73',
                            fontSize: '12px',
                            fontFamily: 'inherit',
                            padding: '5px 12px',
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                            opacity: 0.8,
                            transition: 'opacity 0.2s',
                            alignSelf: 'center',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                    >
                        ↺ Refresh Preview
                    </button>
                </section>

                {/* Right Column Workspace (60%) */}
                <section className={styles.workspaceCol} style={{ position: 'relative' }}>
                    <AnimatePresence>
                        {isCrafting && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className={styles.craftingOverlay}
                            >
                                <Loader2 className="animate-spin" size={32} color="#B39D73" style={{ marginBottom: '1rem' }} />
                                <h3>Crafting Your Invitation</h3>
                                <p>Adding the final touches...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* CHAPTER 1: Your Story */}
                    <div className={clsx(
                        styles.chapter, 
                        activeChapter === 1 ? styles.chapterActive : styles.chapterCollapsed
                    )} onClick={() => activeChapter !== 1 && setActiveChapter(1)}>
                        
                        <div 
                            className={styles.chapterHeader}
                            onClick={(e) => {
                                if (activeChapter === 1) {
                                    e.stopPropagation();
                                    setActiveChapter(0);
                                }
                            }}
                        >
                            <div className={styles.chapterHeaderLeft}>
                                <div className={styles.chapterNumber}>1</div>
                                <h3 className={styles.chapterTitle}>Your Story</h3>
                            </div>
                            <ChevronDown size={18} className={styles.chapterToggleIcon} />
                        </div>

                        <AnimatePresence initial={false}>
                            {activeChapter === 1 && (
                                <motion.div
                                    key="body-1"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                    style={{ overflow: activeChapter === 1 ? 'visible' : 'hidden' }}
                                >
                                    <div className={styles.chapterBody}>
                                        <div className={styles.inviteForWrapper}>
                                            <label className={styles.studioLabel}>Creating Invite For</label>
                                            <div className={styles.segmentedControl} role="tablist" aria-label="Creating invite for">
                                                {(['bride', 'groom'] as const).map((side) => {
                                                    const isSelected = (formData.invitationFor || (isBrideFirst ? 'bride' : 'groom')) === side;
                                                    return (
                                                        <button
                                                            key={side}
                                                            type="button"
                                                            role="tab"
                                                            aria-selected={isSelected}
                                                            className={clsx(styles.segmentBtn, isSelected && styles.segmentBtnActive)}
                                                            onClick={() => updateFormData({
                                                                invitationFor: side,
                                                                nameOrder: side === 'bride' ? 'bride_first' : 'groom_first'
                                                            })}
                                                        >
                                                            {isSelected && (
                                                                <motion.div
                                                                    layoutId="activeInviteForIndicator"
                                                                    className={styles.segmentIndicator}
                                                                    transition={{ type: "spring", bounce: 0.12, duration: 0.35 }}
                                                                />
                                                            )}
                                                            <span className={styles.segmentLabel}>
                                                                {side === 'bride' ? 'Bride' : 'Groom'}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {isBrideFirst ? (
                                            <>
                                                <div className={clsx(styles.studioInputGroup, styles.split)}>
                                                    <div>
                                                        <label className={styles.studioLabel}>Who is the Bride?</label>
                                                        <Input
                                                            label="Bride's First Name"
                                                            hideLabel
                                                            value={formData.brideName}
                                                            onFocus={() => handleFocus('brideName')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ brideName: e.target.value })}
                                                            placeholder="Bride Name"
                                                            maxLength={25}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={styles.studioLabel}>Bride's Parents</label>
                                                        <Input
                                                            label="Bride's Parents"
                                                            hideLabel
                                                            value={formData.brideParents || ''}
                                                            onFocus={() => handleFocus('brideParents')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ brideParents: e.target.value })}
                                                            placeholder="e.g. Mr. & Mrs. Patel"
                                                        />
                                                    </div>
                                                </div>

                                                <div className={clsx(styles.studioInputGroup, styles.split)}>
                                                    <div>
                                                        <label className={styles.studioLabel}>Who is the Groom?</label>
                                                        <Input
                                                            label="Groom's First Name"
                                                            hideLabel
                                                            value={formData.groomName}
                                                            onFocus={() => handleFocus('groomName')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ groomName: e.target.value })}
                                                            placeholder="Groom Name"
                                                            maxLength={25}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={styles.studioLabel}>Groom's Parents</label>
                                                        <Input
                                                            label="Groom's Parents"
                                                            hideLabel
                                                            value={formData.groomParents || ''}
                                                            onFocus={() => handleFocus('groomParents')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ groomParents: e.target.value })}
                                                            placeholder="e.g. Mr. & Mrs. Sharma"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={clsx(styles.studioInputGroup, styles.split)}>
                                                    <div>
                                                        <label className={styles.studioLabel}>Who is the Groom?</label>
                                                        <Input
                                                            label="Groom's First Name"
                                                            hideLabel
                                                            value={formData.groomName}
                                                            onFocus={() => handleFocus('groomName')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ groomName: e.target.value })}
                                                            placeholder="Groom Name"
                                                            maxLength={25}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={styles.studioLabel}>Groom's Parents</label>
                                                        <Input
                                                            label="Groom's Parents"
                                                            hideLabel
                                                            value={formData.groomParents || ''}
                                                            onFocus={() => handleFocus('groomParents')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ groomParents: e.target.value })}
                                                            placeholder="e.g. Mr. & Mrs. Sharma"
                                                        />
                                                    </div>
                                                </div>

                                                <div className={clsx(styles.studioInputGroup, styles.split)}>
                                                    <div>
                                                        <label className={styles.studioLabel}>Who is the Bride?</label>
                                                        <Input
                                                            label="Bride's First Name"
                                                            hideLabel
                                                            value={formData.brideName}
                                                            onFocus={() => handleFocus('brideName')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ brideName: e.target.value })}
                                                            placeholder="Bride Name"
                                                            maxLength={25}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={styles.studioLabel}>Bride's Parents</label>
                                                        <Input
                                                            label="Bride's Parents"
                                                            hideLabel
                                                            value={formData.brideParents || ''}
                                                            onFocus={() => handleFocus('brideParents')}
                                                            onBlur={handleBlur}
                                                            onChange={(e) => updateFormData({ brideParents: e.target.value })}
                                                            placeholder="e.g. Mr. & Mrs. Patel"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CHAPTER 2: The Ceremony */}
                    <div className={clsx(
                        styles.chapter, 
                        activeChapter === 2 ? styles.chapterActive : styles.chapterCollapsed
                    )} onClick={() => activeChapter !== 2 && setActiveChapter(2)}>
                        
                        <div 
                            className={styles.chapterHeader}
                            onClick={(e) => {
                                if (activeChapter === 2) {
                                    e.stopPropagation();
                                    setActiveChapter(0);
                                }
                            }}
                        >
                            <div className={styles.chapterHeaderLeft}>
                                <div className={styles.chapterNumber}>2</div>
                                <h3 className={styles.chapterTitle}>The Ceremony</h3>
                            </div>
                            <ChevronDown size={18} className={styles.chapterToggleIcon} />
                        </div>

                        <AnimatePresence initial={false}>
                            {activeChapter === 2 && (
                                <motion.div
                                    key="body-2"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                    style={{ overflow: activeChapter === 2 ? 'visible' : 'hidden' }}
                                >
                                    <div className={styles.chapterBody}>
                                        <div className={clsx(styles.studioInputGroup, styles.split)}>
                                            <div>
                                                <label className={styles.studioLabel}>When is the Ceremony?</label>
                                                <Input
                                                    label="Primary Date"
                                                    hideLabel
                                                    type="date"
                                                    value={formData.primaryDate || ''}
                                                    onFocus={() => handleFocus('primaryDate')}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => updateFormData({ primaryDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className={styles.studioLabel}>At what time?</label>
                                                <Input
                                                    label="Primary Time"
                                                    hideLabel
                                                    type="time"
                                                    value={formData.primaryTime || ''}
                                                    onFocus={() => handleFocus('primaryTime')}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => updateFormData({ primaryTime: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.studioInputGroup}>
                                            <label className={styles.studioLabel}>Where is everyone gathering?</label>
                                            <Input
                                                label="Venue Address"
                                                hideLabel
                                                type="textarea"
                                                className={styles.studioTextarea}
                                                value={formData.defaultVenueName || ''}
                                                onFocus={() => handleFocus('defaultVenueName')}
                                                onBlur={handleBlur}
                                                onChange={(e) => updateFormData({ defaultVenueName: e.target.value })}
                                                placeholder="e.g. The Grand Palace Hall, Palace Road, Jodhpur"
                                            />
                                        </div>

                                        <div className={styles.mapsAutocompleteWrapper}>
                                            <div className={styles.mapsHeaderRow}>
                                                <label className={styles.studioLabel}>Google Maps Link</label>
                                                <a 
                                                    href="https://www.google.com/maps" 
                                                    target="_blank" 
                                                    className={styles.mapsLinkHelper}
                                                    rel="noopener noreferrer"
                                                >
                                                    Find on Maps <ExternalLink size={10} style={{ display: 'inline', marginLeft: '2px' }} />
                                                </a>
                                            </div>
                                            <Input
                                                label="Maps Link"
                                                hideLabel
                                                value={formData.primaryMapLink || ''}
                                                onFocus={() => handleFocus('primaryMapLink')}
                                                onBlur={handleBlur}
                                                onChange={(e) => updateFormData({ primaryMapLink: e.target.value })}
                                                placeholder="e.g. https://maps.google.com/..."
                                                helperText="Guests can tap this on their phone to navigate directly to the venue."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CHAPTER 3: Celebrate Every Moment */}
                    <div className={clsx(
                        styles.chapter, 
                        activeChapter === 3 ? styles.chapterActive : styles.chapterCollapsed
                    )} onClick={() => {
                        if (activeChapter !== 3) {
                            setActiveChapter(3);
                            if (formData.events && formData.events.length > 0) {
                                const eventExists = formData.events.some(e => e.id === activePreviewEventId);
                                if (!eventExists) {
                                    setActivePreviewEventId(formData.events[0].id);
                                }
                            }
                        }
                    }}>
                        
                        <div 
                            className={styles.chapterHeader}
                            onClick={(e) => {
                                if (activeChapter === 3) {
                                    e.stopPropagation();
                                    setActiveChapter(0);
                                }
                            }}
                        >
                            <div className={styles.chapterHeaderLeft}>
                                <div className={styles.chapterNumber}>3</div>
                                <h3 className={styles.chapterTitle}>Celebrate Every Moment</h3>
                            </div>
                            <ChevronDown size={18} className={styles.chapterToggleIcon} />
                        </div>

                        <AnimatePresence initial={false}>
                            {activeChapter === 3 && (
                                <motion.div
                                    key="body-3"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                    style={{ overflow: activeChapter === 3 ? 'visible' : 'hidden' }}
                                >
                                    <div className={styles.chapterBody}>
                                        <div className={styles.timelineBuilder}>
                                            {(formData.events || []).map((event, index) => {
                                                // The heading is the event's identity — carries the real Event.id from the
                                                // BundleItem/Event relationship (via eventSections, resolved above) rather
                                                // than the editable name, which is no longer editable here for exactly that
                                                // reason: renaming it must never be able to break the eventId/template link.
                                                const matchedSection = eventSections.find(s => s.localEventId === event.id);
                                                return (
                                                <div
                                                    className={clsx(
                                                        styles.timelineCard,
                                                        (focusedField === event.id || activePreviewEventId === event.id) && styles.timelineCardActive
                                                    )}
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActivePreviewEventId(event.id);
                                                    }}
                                                >
                                                    <div className={styles.timelineCardHeader}>
                                                        <div className={styles.timelineCardTitle} data-event-id={matchedSection?.eventId}>{event.name}</div>
                                                        <div className={styles.timelineCardControls}>
                                                            <button 
                                                                className={styles.timelineBtn}
                                                                onClick={() => moveEvent(index, 'up')}
                                                                disabled={index === 0}
                                                                title="Move Up"
                                                            >
                                                                <ArrowUp size={14} />
                                                            </button>
                                                            <button 
                                                                className={styles.timelineBtn}
                                                                onClick={() => moveEvent(index, 'down')}
                                                                disabled={index === (formData.events || []).length - 1}
                                                                title="Move Down"
                                                            >
                                                                <ArrowDown size={14} />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                className={styles.timelineDeleteBtn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEventToDelete({
                                                                        id: event.id,
                                                                        name: event.name || `Event #${index + 1}`
                                                                    });
                                                                }}
                                                                title="Delete Event"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={clsx(styles.studioInputGroup, styles.split)}>
                                                        <div>
                                                            <label className={styles.studioLabel}>Date</label>
                                                            <Input
                                                                label="Date"
                                                                hideLabel
                                                                type="date"
                                                                value={event.date || ''}
                                                                onFocus={() => { handleFocus(event.id); setActivePreviewEventId(event.id); }}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className={styles.studioLabel}>Time</label>
                                                            <Input
                                                                label="Time"
                                                                hideLabel
                                                                type="time"
                                                                value={event.time || ''}
                                                                onFocus={() => { handleFocus(event.id); setActivePreviewEventId(event.id); }}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => updateEvent(event.id, { time: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className={styles.studioInputGroup}>
                                                        <div>
                                                            <label className={styles.studioLabel}>Venue Name (Optional)</label>
                                                            <Input
                                                                label="Venue"
                                                                hideLabel
                                                                value={event.venue || ''}
                                                                onFocus={() => { handleFocus(event.id); setActivePreviewEventId(event.id); }}
                                                                onBlur={handleBlur}
                                                                placeholder="Inherits global venue if left empty"
                                                                onChange={(e) => updateEvent(event.id, { venue: e.target.value, isCustomVenue: !!e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CHAPTER 4: Ready to Invite */}
                    <div className={clsx(
                        styles.chapter, 
                        activeChapter === 4 ? styles.chapterActive : styles.chapterCollapsed
                    )} onClick={() => activeChapter !== 4 && setActiveChapter(4)}>
                        
                        <div 
                            className={styles.chapterHeader}
                            onClick={(e) => {
                                if (activeChapter === 4) {
                                    e.stopPropagation();
                                    setActiveChapter(0);
                                }
                            }}
                        >
                            <div className={styles.chapterHeaderLeft}>
                                <div className={styles.chapterNumber}>4</div>
                                <h3 className={styles.chapterTitle}>Ready to Invite</h3>
                            </div>
                            <ChevronDown size={18} className={styles.chapterToggleIcon} />
                        </div>

                        <AnimatePresence initial={false}>
                            {activeChapter === 4 && (
                                <motion.div
                                    key="body-4"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                    style={{ overflow: activeChapter === 4 ? 'visible' : 'hidden' }}
                                >
                                    <div className={styles.chapterBody}>
                                        <div className={clsx(styles.studioInputGroup, styles.split)}>
                                            <div>
                                                <label className={styles.studioLabel}>Invitation Type</label>
                                                <select
                                                    className={styles.studioSelect}
                                                    value={formData.eventType || 'Wedding'}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        updateFormData({ eventType: val });
                                                    }}
                                                >
                                                    <option value="Wedding">Wedding Ceremony</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={styles.studioLabel}>RSVP Deadline Date</label>
                                                <Input
                                                    label="RSVP Deadline"
                                                    hideLabel
                                                    type="date"
                                                    value={formData.rsvpDeadline || ''}
                                                    onFocus={() => handleFocus('rsvpDeadline')}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => updateFormData({ rsvpDeadline: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.studioInputGroup}>
                                            <label className={styles.studioLabel}>Write a note guests will remember</label>
                                            <Input
                                                label="Welcome Message"
                                                hideLabel
                                                type="textarea"
                                                className={styles.studioTextarea}
                                                value={formData.invitationMessage || ''}
                                                onFocus={() => handleFocus('invitationMessage')}
                                                onBlur={handleBlur}
                                                placeholder="Ex: We can't wait to celebrate our special day with our dearest friends and family!"
                                                onChange={(e) => updateFormData({ invitationMessage: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Final Unveiling Action Card */}
                    <div className={styles.actionCard}>
                        <h4 className={styles.actionHeadline}>Let's bring your invitation to life.</h4>
                        <p className={styles.actionSubtext}>
                            We'll craft your invitation with care, just as your guests will experience it.
                        </p>

                        <div className={styles.actionGroup}>
                            <label className={styles.confirmationCheckboxRow}>
                                <input 
                                    type="checkbox"
                                    className={styles.confirmationInput}
                                    checked={isDetailsConfirmed}
                                    onChange={(e) => setIsDetailsConfirmed(e.target.checked)}
                                />
                                <span className={styles.confirmationLabelText}>
                                    Please review all your details for accuracy and spelling before generating.
                                </span>
                            </label>

                            <div className={styles.actionButtonRow}>
                                <button 
                                    className={styles.actionBtnPrimary} 
                                    onClick={handleFinish}
                                >
                                    Generate My Nimantran
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default function DetailsPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#FDFBF7' }} />}>
            <DetailsContent />
        </Suspense>
    );
}
