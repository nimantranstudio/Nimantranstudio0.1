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
    Plus, 
    Clock, 
    CheckCircle2, 
    Loader2, 
    X,
    ExternalLink,
    AlertCircle,
    ArrowRight,
    ArrowDownUp,
    Play
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RSVPForm } from '@/app/rsvp/[id]/RSVPForm';
import type { Theme } from '@/lib/constants/themes';
import { DEFAULT_EVENTS, type WeddingEvent } from '@/lib/schemas/wedding-form';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';

// Motion variants for welcome popup transitions (animation-vocabulary / apple-design / emil-design-eng)
const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { 
        opacity: 1, 
        backdropFilter: "blur(8px)",
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } 
    },
    exit: { 
        opacity: 0, 
        backdropFilter: "blur(0px)",
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } 
    }
};

const cardVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 16, filter: "blur(12px)" },
    visible: { 
        scale: 1, 
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { 
            type: "spring", 
            bounce: 0.15,
            duration: 0.5,
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    exit: { 
        scale: 0.95, 
        opacity: 0,
        y: 8,
        filter: "blur(8px)",
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } 
    }
};

const itemVariants = {
    hidden: { y: 12, opacity: 0, filter: "blur(8px)" },
    visible: { 
        y: 0, 
        opacity: 1,
        filter: "blur(0px)",
        transition: { type: "spring", bounce: 0.2, duration: 0.4 }
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

    // Welcome Overlay State
    const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
    const [isCrafting, setIsCrafting] = useState(false);
    const cardRef = useRef<InvitationCardRef>(null);

    const templateUrl = useMemo(() => {
        let searchEventTerm = 'wedding';
        if (activeChapter === 3 && activePreviewEventId && activePreviewEventId !== 'wedding') {
            const foundEvent = formData.events?.find(e => e.id === activePreviewEventId);
            if (foundEvent && foundEvent.name) {
                searchEventTerm = foundEvent.name.toLowerCase();
            } else {
                searchEventTerm = activePreviewEventId.toLowerCase();
            }
        }

        // 1. First, check bundleItems
        if (bundleItems && bundleItems.length > 0) {
            let targetItem;
            
            if (searchEventTerm === 'wedding') {
                targetItem = bundleItems.find(item => 
                    item.templatePath && 
                    (item.eventId === 'evt_7' || item.eventId === 'wedding' || item.templatePath.includes('item-Wedding_Invitation') || (item.eventType || '').toUpperCase().includes('WEDDING') || item.templatePath.toLowerCase().includes('wedding'))
                );
            } else {
                // Match by eventId, template path, or event name for things like Haldi, Mehendi
                targetItem = bundleItems.find(item => {
                    const match = item.templatePath && 
                        (
                            item.eventId?.toLowerCase() === searchEventTerm || 
                            item.templatePath.toLowerCase().includes(searchEventTerm) ||
                            item.event?.eventName?.toLowerCase().includes(searchEventTerm) ||
                            item.eventType?.toLowerCase().includes(searchEventTerm) ||
                            item.templateName?.toLowerCase().includes(searchEventTerm)
                        );
                    return match;
                });
                
                // Fallback to wedding if specific event template not found
                if (!targetItem) {
                    targetItem = bundleItems.find(item => 
                        item.templatePath && 
                        (item.eventId === 'evt_7' || item.eventId === 'wedding' || item.templatePath.includes('item-Wedding_Invitation') || (item.eventType || '').toUpperCase().includes('WEDDING') || item.templatePath.toLowerCase().includes('wedding'))
                    );
                }
            }

            if (targetItem) return targetItem.templatePath;
            
            // Fallback to any HTML file in bundleItems, then any file
            const anyHtmlItem = bundleItems.find(item => item.templatePath && item.templatePath.toLowerCase().includes('.html'));
            if (anyHtmlItem) return anyHtmlItem.templatePath;
            
            if (bundleItems[0]?.templatePath) return bundleItems[0].templatePath;
        }

        // 2. Check bundleImages (fallback for legacy themes without bundleItems)
        if (bundleImages && bundleImages.length > 0) {
            let targetImage;
            
            if (searchEventTerm !== 'wedding') {
                targetImage = bundleImages.find(img => img.toLowerCase().includes(searchEventTerm));
            }
            
            if (!targetImage) {
                targetImage = bundleImages.find(img => img.toLowerCase().includes('wedding') || img.toLowerCase().includes('reception') || img.includes('item-Wedding_Invitation'));
            }

            if (targetImage) return targetImage;
            
            // Fallback to the first image in the bundle if no match found
            return bundleImages[0];
        }
        
        return undefined;
    }, [bundleItems, bundleImages, activeChapter, activePreviewEventId]);

    const isHTMLDesign = !!templateUrl && templateUrl.toLowerCase().includes('.html');

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
                    activeChapter === 2 ? (isHTMLDesign ? '0%' : '-15%') :
                    activeChapter === 3 ? (isHTMLDesign ? '0%' : '-40%') : 
                    activeChapter === 4 ? (isHTMLDesign ? '0%' : '-65%') : '0%';

    useEffect(() => {
        setIsMounted(true);
        if (searchParams.get('welcome') === 'true') {
            setShowWelcomeOverlay(true);
            setShowConfetti(true);
            
            // Auto dismiss welcome overlay after 3.5s
            const timer = setTimeout(() => {
                setShowWelcomeOverlay(false);
                // Clean up URL parameters
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    // Fetch theme config
    useEffect(() => {
        if (!selectedThemeId) return;

        async function fetchTheme() {
            try {
                const res = await fetch(`/api/themes/${selectedThemeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setActiveTheme(data.theme);
                }
            } catch (error) {
                console.error("Failed to fetch theme", error);
            }
        }
        fetchTheme();
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

    // Swap names logic
    const isBrideFirst = formData.nameOrder === 'bride_first';
    const displayGroomName = isBrideFirst ? formData.brideName : formData.groomName;
    const displayBrideName = isBrideFirst ? formData.groomName : formData.brideName;
    const displayGroomParents = isBrideFirst ? formData.brideParents : formData.groomParents;
    const displayBrideParents = isBrideFirst ? formData.groomParents : formData.brideParents;

    return (
        <div className={styles.page}>
            <AnimatePresence>
                {showWelcomeOverlay && (
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={styles.transitionOverlay}
                        style={{ zIndex: 10000 }}
                    >
                        {showConfetti && <WeddingCelebration />}

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

            <header className={styles.header}>
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Themes', href: '/themes' },
                        { label: `${themeName}${selectedPlan ? ` (${selectedPlan})` : ''}`, href: `/themes/${selectedThemeId}` },
                        { label: 'wedding details', active: true },
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
                    <div className={styles.inviteFrame}>
                        <div className={styles.paperSurface}>
                            <div className={styles.goldFoilOrnament}>
                                <Sparkles size={28} />
                            </div>

                            {/* Live Invitation Continuous Camera System */}
                            <motion.div
                                animate={{ y: activeChapter === 4 ? 0 : cameraY }}
                                transition={isCrafting ? { ease: "linear", duration: 3.5 } : { type: "spring", bounce: 0, duration: 0.6 }}
                                style={{ width: '100%' }}
                            >
                                <AnimatePresence mode="wait">
                                    {activeChapter === 4 ? (
                                        <motion.div
                                            key="rsvp-preview"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                            style={{ height: '800px', width: '100%', overflowY: 'auto', background: '#FDFBF7' }}
                                        >
                                            <RSVPForm wedding={{
                                                id: 'preview',
                                                groomName: formData.groomName || 'Groom',
                                                brideName: formData.brideName || 'Bride',
                                                themeId: 'default',
                                                invitationMessage: formData.invitationMessage || "Please join us for our special day!",
                                                allowCompanions: formData.allowCompanions || false,
                                                collectDietary: formData.collectDietary || false,
                                                events: formData.events || []
                                            }} />
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
                                            <InvitationCard 
                                                ref={cardRef}
                                                event={previewEvent} 
                                                theme={activeTheme || { id: 'default', name: 'Default', slug: 'default', category: 'traditional', thumbnailUrl: '', type: 'image' }} 
                                                groomName={displayGroomName} 
                                                brideName={displayBrideName} 
                                                groomParents={displayGroomParents}
                                                brideParents={displayBrideParents}
                                                customImage={templateUrl} 
                                                isRawPreview={false}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
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
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className={styles.chapterBody}>
                                        <div style={{ display: 'flex', flexDirection: isBrideFirst ? 'column-reverse' : 'column', gap: '1.5rem', position: 'relative' }}>
                                            <button 
                                                onClick={() => updateFormData({ nameOrder: isBrideFirst ? 'groom_first' : 'bride_first' })}
                                                className={styles.swapButton}
                                                style={{ position: 'absolute', top: '-1.5rem', right: '0', zIndex: 10 }}
                                                type="button"
                                                title="Swap Order"
                                            >
                                                <ArrowDownUp size={14} color="#6B7280" />
                                            </button>
                                            
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
                                        </div>
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
                                    style={{ overflow: 'hidden' }}
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
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className={styles.chapterBody}>
                                        <div className={styles.timelineBuilder}>
                                            {(formData.events || []).map((event, index) => (
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
                                                        <div className={styles.timelineCardTitle}>{event.name}</div>
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
                                                                className={styles.timelineDeleteBtn}
                                                                onClick={() => removeEvent(event.id)}
                                                                title="Delete Event"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className={clsx(styles.studioInputGroup, styles.split)}>
                                                        <div>
                                                            <label className={styles.studioLabel}>Event Name</label>
                                                            <Input
                                                                label="Event Name"
                                                                hideLabel
                                                                value={event.name}
                                                                onFocus={() => { handleFocus(event.id); setActivePreviewEventId(event.id); }}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                                                            />
                                                        </div>
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
                                                    </div>

                                                    <div className={clsx(styles.studioInputGroup, styles.split)}>
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
                                            ))}
                                        </div>

                                        <button className={styles.addCeremonyBtn} onClick={handleAddCeremony}>
                                            <Plus size={16} /> Add Ceremony Card
                                        </button>
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
                                    style={{ overflow: 'hidden' }}
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
                                                    <option value="Reception">Reception Suite</option>
                                                    <option value="Sangeet">Sangeet Party</option>
                                                    <option value="Haldi">Haldi Ritual</option>
                                                    <option value="Mehendi">Mehendi Night</option>
                                                    <option value="Engagement">Engagement Ring Ceremony</option>
                                                    <option value="Other">Special Event</option>
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
                            Everything you shared is in place. We'll now craft your invitation with care, just as your guests will experience it.
                        </p>
                        <div className={styles.actionButtonRow}>
                            <button className={styles.actionBtnPrimary} onClick={handleFinish}>
                                Review Your Wedding Suite <ArrowRight size={18} />
                            </button>
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

// --- Confetti Particles Subcomponent ---
function WeddingCelebration() {
    const [particles] = useState(() => 
        Array.from({ length: 40 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 35;
            return {
                id: i,
                endX: 50 + Math.cos(angle) * distance,
                endY: 50 + Math.sin(angle) * distance + 10,
                size: 6 + Math.random() * 8,
                type: ['heart', 'petal', 'sparkle'][Math.floor(Math.random() * 3)],
                color: ['#B39D73', '#FDFBF7', '#FDA4AF', '#EBCDC3'][Math.floor(Math.random() * 4)],
                duration: 2.0 + Math.random() * 1.5,
                delay: Math.random() * 0.1,
                rotation: Math.random() * 360,
                endRotation: Math.random() * 360 + 180
            };
        })
    );

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0
        }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: '50vw',
                        y: '50vh',
                        rotate: p.rotation,
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        x: `${p.endX}vw`,
                        y: `${p.endY}vh`,
                        rotate: p.endRotation,
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1, 1, 0.8]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{
                        position: 'absolute',
                        color: p.color,
                        opacity: 0.9
                    }}
                >
                    {p.type === 'heart' && <Heart size={p.size} fill="currentColor" stroke="none" />}
                    {p.type === 'petal' && (
                        <div style={{
                            width: p.size,
                            height: p.size * 0.7,
                            background: 'currentColor',
                            borderRadius: '50% 0 50% 0',
                            transform: 'rotate(45deg)'
                        }} />
                    )}
                    {p.type === 'sparkle' && (
                        <div style={{
                            width: p.size * 2,
                            height: p.size * 2,
                            background: 'currentColor',
                            clipPath: 'polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)'
                        }} />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
