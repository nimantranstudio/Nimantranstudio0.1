'use client';

import { useWeddingStore } from '@/store/wedding-store';
import Image from 'next/image';
import { Input } from '@/components/form/Input';
import { EventRepeater } from '@/components/form/EventRepeater';
import styles from './details.module.css';
import formStyles from '@/components/form/Form.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronRight, ChevronDown, CheckCircle, Sun, Music, Leaf, Circle, Wine, MoreHorizontal, Clock, Info, ShieldCheck, MapPin, Calendar, Users, AlertCircle, Heart, Sparkles, ArrowRight, ChevronUp, Trash2, Plus, ChevronLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { Theme } from '@/lib/constants/themes';
import { DEFAULT_EVENTS, type WeddingEvent } from '@/lib/schemas/wedding-form';

import Link from 'next/link';
import { LoginModal } from '@/components/auth/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';


export default function DetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formData, updateFormData, saveWedding, selectedThemeId, bundleImages, selectedPlan } = useWeddingStore();
    const [step, setStep] = useState(1); // 1: Couple, 2: Ceremony, 3: Events, 4: Summary
    const progressPercentage = (step / 4) * 100;
    const [expandedEventId, setExpandedEventId] = useState<string | null>(formData.events?.[0]?.id || null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Welcome Overlay State
    const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (searchParams.get('welcome') === 'true') {
            setShowWelcomeOverlay(true);
            setShowConfetti(true);
            
            // Auto dismiss after 5.5s
            const timer = setTimeout(() => {
                setShowWelcomeOverlay(false);
                // Clean up URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }, 5500);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const [activeTheme, setActiveTheme] = useState<Theme | null>(null);

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

    const themeName = activeTheme ? activeTheme.name : 'Choose Theme';

    const [isGroomFirst, setIsGroomFirst] = useState(true);

    const groomNameField = (
        <Input
            key="groom-name"
            label="Groom's Name"
            value={formData.groomName}
            onChange={(e) => {
                updateFormData({ groomName: e.target.value });
                if (errors.groomName) setErrors(e => ({ ...e, groomName: '' }));
            }}
            placeholder="First Name"
            error={errors.groomName}
            maxLength={25}
        />
    );

    const brideNameField = (
        <Input
            key="bride-name"
            label="Bride's Name"
            value={formData.brideName}
            onChange={(e) => {
                updateFormData({ brideName: e.target.value });
                if (errors.brideName) setErrors(e => ({ ...e, brideName: '' }));
            }}
            placeholder="First Name"
            error={errors.brideName}
            maxLength={25}
        />
    );

    const groomParentsField = (
        <Input
            key="groom-parents"
            label="Groom's Parents"
            value={formData.groomParents || ''}
            onChange={(e) => updateFormData({ groomParents: e.target.value })}
            placeholder="e.g. Mr. & Mrs. Sharma"
            maxLength={100}
        />
    );

    const brideParentsField = (
        <Input
            key="bride-parents"
            label="Bride's Parents"
            value={formData.brideParents || ''}
            onChange={(e) => updateFormData({ brideParents: e.target.value })}
            placeholder="e.g. Mr. & Mrs. Patel"
            maxLength={100}
        />
    );

    const handleLoginSuccess = async (phone: string) => {
        setShowLoginModal(false);
        useWeddingStore.getState().login(phone);

        setIsSaving(true);
        setSaveError(null);
        try {
            const result = await saveWedding();
            if (!result.success) {
                setSaveError("Background save failed, but you can still preview!");
            }
        } catch (err) {
            setSaveError("Connection issue, but preview is ready.");
        } finally {
            setIsSaving(false);
            router.push('/preview?processing=true');
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "15-Dec-2026";
        try {
            const date = new Date(dateStr);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch (e) {
            return dateStr;
        }
    };

    const handleNext = async () => {
        if (step === 1) {
            const newErrors: Record<string, string> = {};
            if (!formData.groomName?.trim()) newErrors.groomName = "Groom's name is required";
            if (!formData.brideName?.trim()) newErrors.brideName = "Bride's name is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setStep(2);
        } else if (step === 2) {
            const newErrors: Record<string, string> = {};
            if (!formData.primaryDate) newErrors.primaryDate = "Wedding date is required";
            if (!formData.primaryTime) newErrors.primaryTime = "Wedding time is required";
            if (!formData.defaultVenueName?.trim()) newErrors.defaultVenueName = "Venue address is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setStep(3);
        } else if (step === 3) {
            if (formData.events) {
                const newErrors: Record<string, string> = {};
                for (const event of formData.events) {
                    if (!event.date) {
                        newErrors[`${event.id}-date`] = "Date is required";
                    }
                    if (!event.time) {
                        newErrors[`${event.id}-time`] = "Time is required";
                    }
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                }
            }
            setErrors({});
            setStep(4);
        } else if (step === 4) {
            // Final step: RSVP -> Login and Save
            setShowLoginModal(true);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.back();
    };

    const STEPS = [
        { id: 1, label: 'The Couple', icon: <Heart size={20} strokeWidth={2.5} /> },
        { id: 2, label: 'Ceremony', icon: <MapPin size={20} strokeWidth={2.5} /> },
        { id: 3, label: 'Timeline', icon: <Calendar size={20} strokeWidth={2.5} /> },
        { id: 4, label: 'RSVP', icon: <Users size={20} strokeWidth={2.5} /> },
    ];

    return (
        <div className={styles.page}>
            <AnimatePresence>
                {showWelcomeOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.transitionOverlay}
                        style={{ zIndex: 10000 }}
                    >
                        {showConfetti && <WeddingCelebration />}

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className={styles.transitionContent}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                className={styles.transitionIconWrapper}
                            >
                                <Heart className={styles.transitionHeartOutline} size={48} strokeWidth={0.75} />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className={styles.transitionHeadline}
                            >
                                Great choice.
                            </motion.h2>

                            <motion.p
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                className={styles.transitionSupportingText}
                            >
                                Now let’s personalise your wedding invitation suite.
                            </motion.p>

                            <div className={styles.progressTrack}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3, ease: "easeInOut", delay: 1.5 }}
                                    className={styles.progressFill}
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 3, duration: 0.8 }}
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
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', href: '/themes' },
                            { label: `${themeName}${selectedPlan ? ` (${selectedPlan})` : ''}`, href: `/themes/${selectedThemeId}` },
                            { label: 'wedding details', active: true },
                        ]}
                    />
                </div>
            </header>

            <main className="container">


                <div className={styles.wizardContainer}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={styles.splitLayout}
                            >
                            <div className={styles.previewContainer}>
                                <div className={styles.invitePreview}>
                                    <div className={styles.previewInner}>
                                        <div className={styles.previewOrnament}>
                                            <Sparkles size={32} />
                                        </div>
                                        <div className={styles.previewIntro}>Together with their families</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.groomName || 'Groom Name') : (formData.brideName || 'Bride Name')}</div>
                                        <div className={styles.previewAmpersand}>&</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.brideName || 'Bride Name') : (formData.groomName || 'Groom Name')}</div>
                                        <div className={styles.previewDivider} />
                                        <div className={styles.previewDate}>{formatDate(formData.primaryDate || '')}</div>
                                        <div className={styles.previewVenue}>
                                            <span className={styles.previewVenueName}>{formData.defaultVenueName?.split(',')[0] || 'THE GRAND HOTEL'}</span>
                                            {formData.defaultVenueName?.split(',').slice(1).join(',') || 'JODHPUR, RAJASTHAN'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.formContent}>
                                    <div className={styles.sectionHeaderInner}>
                                        <div className={styles.stepHeaderContainer}>
                                            <div className={styles.stepHeaderInfo}>
                                                <div className={styles.stepBadge}>{step}</div>
                                                <span className={styles.stepStepText}>Step {step} of 4</span>
                                            </div>
                                            <div className={styles.stepTiming}>
                                                <Clock size={14} />
                                                <span>Takes 15 seconds</span>
                                            </div>
                                        </div>
                                        <div className={styles.sectionHeaderMain}>
                                            <h2 className={styles.sectionTitleMain}>About the Couple.</h2>
                                            <p className={styles.sectionSubtitleMain}>
                                                Introduce the beautiful couple. This will be the heart of your wedding identity.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.wizardCard}>
                                        <div className={formStyles.grid}>
                                            {isGroomFirst ? (
                                                <>
                                                    {groomNameField}
                                                    {brideNameField}
                                                    {groomParentsField}
                                                    {brideParentsField}
                                                </>
                                            ) : (
                                                <>
                                                    {brideNameField}
                                                    {groomNameField}
                                                    {brideParentsField}
                                                    {groomParentsField}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formFooter}>
                                    <div className={styles.footerProgressBarContainer}>
                                        <motion.div 
                                            className={styles.footerProgressBar}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {!!formData.groomName?.trim() && !!formData.brideName?.trim() && (
                                            <motion.div 
                                                key="note1"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={clsx(styles.formSuccessMessage, styles.footerMessage)}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <CheckCircle size={18} color="#D4AF37" />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                                                    animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    <span>Beautiful beginning made</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        Back
                                    </button>
                                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                        Continue Setup
                                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                        
                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={styles.splitLayout}
                            >
                            <div className={styles.previewContainer}>
                                <div className={styles.invitePreview}>
                                    <div className={styles.previewInner}>
                                        <div className={styles.previewOrnament}>
                                            <Sparkles size={32} />
                                        </div>
                                        <div className={styles.previewIntro}>Together with their families</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.groomName || 'Groom Name') : (formData.brideName || 'Bride Name')}</div>
                                        <div className={styles.previewAmpersand}>&</div>
                                        <div className={styles.previewName}>{isGroomFirst ? (formData.brideName || 'Bride Name') : (formData.groomName || 'Groom Name')}</div>
                                        <div className={styles.previewDivider} />
                                        <div className={styles.previewDate}>{formatDate(formData.primaryDate || '')}</div>
                                        <div className={styles.previewVenue}>
                                            <span className={styles.previewVenueName}>{formData.defaultVenueName?.split(',')[0] || 'THE GRAND HOTEL'}</span>
                                            {formData.defaultVenueName?.split(',').slice(1).join(',') || 'JODHPUR, RAJASTHAN'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.formContent}>
                                    <div className={styles.sectionHeaderInner}>
                                        <div className={styles.stepHeaderContainer}>
                                            <div className={styles.stepHeaderInfo}>
                                                <div className={styles.stepBadge}>{step}</div>
                                                <span className={styles.stepStepText}>Step {step} of 4</span>
                                            </div>
                                            <div className={styles.stepTiming}>
                                                <Clock size={14} />
                                                <span>Takes 20 seconds</span>
                                            </div>
                                        </div>
                                        <div className={styles.sectionHeaderMain}>
                                            <h2 className={styles.sectionTitleMain}>Ceremony Details.</h2>
                                            <p className={styles.sectionSubtitleMain}>
                                                Define the foundational venue and timing for your primary wedding ceremony.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.wizardCard}>
                                        <div className={formStyles.grid}>
                                            <Input
                                                label="Primary Wedding Date"
                                                type="date"
                                                value={formData.primaryDate || ''}
                                                onChange={(e) => {
                                                    updateFormData({ primaryDate: e.target.value });
                                                    if (errors.primaryDate) setErrors(errs => ({ ...errs, primaryDate: '' }));
                                                }}
                                                error={errors.primaryDate}
                                            />
                                            <Input
                                                label="Time"
                                                type="time"
                                                value={formData.primaryTime || ''}
                                                onChange={(e) => {
                                                    updateFormData({ primaryTime: e.target.value });
                                                    if (errors.primaryTime) setErrors(errs => ({ ...errs, primaryTime: '' }));
                                                }}
                                                error={errors.primaryTime}
                                            />
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <Input
                                                    label="Venue Address"
                                                    value={formData.defaultVenueName || ''}
                                                    onChange={(e) => {
                                                        updateFormData({ defaultVenueName: e.target.value });
                                                        if (errors.defaultVenueName) setErrors(errs => ({ ...errs, defaultVenueName: '' }));
                                                    }}
                                                    placeholder="e.g. The Grand Palace, 123 Royal Road, Jaipur"
                                                    type="textarea"
                                                    className={styles.textareaInput}
                                                    error={errors.defaultVenueName}
                                                    maxLength={500}
                                                />
                                            </div>

                                            <div style={{ gridColumn: 'span 2' }}>
                                                <div className={styles.mapFieldHeader}>
                                                    <label className={formStyles.label}>Venue Location (Google Maps)</label>
                                                    <a 
                                                        href="https://www.google.com/maps" 
                                                        target="_blank" 
                                                        className={styles.mapHelperLink}
                                                    >
                                                        Find Coordinates on Maps
                                                    </a>
                                                </div>
                                                <Input
                                                    label="Google Maps Link"
                                                    hideLabel
                                                    value={formData.primaryMapLink || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        updateFormData({ primaryMapLink: val });
                                                    }}
                                                    placeholder="e.g. https://www.google.com/maps/search/?api=1&query=26.9124,75.7873"
                                                    helperText="Guests will use this link for one-tap navigation from their invitation."
                                                />
                                            </div>

                                            <div style={{ gridColumn: 'span 2' }} className={formStyles.field}>
                                                <label className={formStyles.label}>Creating This Invite For</label>
                                                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                        <input 
                                                            type="radio" 
                                                            name="inviteFor" 
                                                            value="bride" 
                                                            checked={formData.inviteFor === 'bride'}
                                                            onChange={(e) => updateFormData({ inviteFor: e.target.value })}
                                                            style={{ accentColor: '#D4AF37', width: '1.25rem', height: '1.25rem' }}
                                                        />
                                                        Bride
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                        <input 
                                                            type="radio" 
                                                            name="inviteFor" 
                                                            value="groom" 
                                                            checked={formData.inviteFor === 'groom'}
                                                            onChange={(e) => updateFormData({ inviteFor: e.target.value })}
                                                            style={{ accentColor: '#D4AF37', width: '1.25rem', height: '1.25rem' }}
                                                        />
                                                        Groom
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                        <input 
                                                            type="radio" 
                                                            name="inviteFor" 
                                                            value="both" 
                                                            checked={!formData.inviteFor || formData.inviteFor === 'both'}
                                                            onChange={(e) => updateFormData({ inviteFor: e.target.value })}
                                                            style={{ accentColor: '#D4AF37', width: '1.25rem', height: '1.25rem' }}
                                                        />
                                                        Both
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formFooter}>
                                    <div className={styles.footerProgressBarContainer}>
                                        <motion.div 
                                            className={styles.footerProgressBar}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {!!formData.primaryDate && !!formData.primaryTime && !!formData.defaultVenueName?.trim() && (
                                            <motion.div 
                                                key="note2"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={clsx(styles.formSuccessMessage, styles.footerMessage)}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <CheckCircle size={18} color="#D4AF37" />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                                                    animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    <span>Your invite defined</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        Back
                                    </button>
                                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                        Continue Setup
                                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                        
                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={styles.splitLayout}
                            >
                            <div className={clsx(styles.previewContainer, styles.formSide)}>
                                <div className={styles.formContent} style={{ padding: '2rem' }}>
                                    <div className={styles.timelinePreviewArea}>
                                        <div className={styles.timelineLineContainer}>
                                            <div className={styles.timelineGoldLine} />
                                            {(formData.events || []).map((event) => (
                                                <div
                                                    key={`preview-${event.id}`}
                                                    className={clsx(
                                                        styles.timelineNodeWrapper,
                                                        expandedEventId === event.id && styles.timelineNodeEntryActive
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        styles.timelineNode,
                                                        (expandedEventId === event.id || !!event.date) && styles.timelineNodeActive,
                                                        event.name?.toLowerCase().includes('wedding') && styles.weddingNode
                                                    )}>
                                                        {event.name?.toLowerCase().includes('wedding') && <div className={styles.shimmerEffect} />}
                                                    </div>
                                                    <div className={clsx(
                                                        styles.miniEventCard,
                                                        expandedEventId === event.id && styles.miniEventActive,
                                                        (!event.date && !event.time) && styles.miniEventBlank,
                                                        event.name?.toLowerCase().includes('wedding') && styles.weddingHighlight
                                                    )}>
                                                        <div className={styles.miniEventName}>{event.name}</div>
                                                        <div className={styles.miniEventDetail}>
                                                            <span>{event.time || ''}</span>
                                                            <span>{event.date ? formatDateDisplay(event.date) : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.completionMessage}>
                                            “Your wedding celebration is beautifully coming together.”
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.formContent}>
                                    <div className={styles.sectionHeaderInner}>
                                        <div className={styles.stepHeaderContainer}>
                                            <div className={styles.stepHeaderInfo}>
                                                <div className={styles.stepBadge}>{step}</div>
                                                <span className={styles.stepStepText}>Step {step} of 4</span>
                                            </div>
                                            <div className={styles.stepTiming}>
                                                <Clock size={14} />
                                                <span>Takes 30 seconds</span>
                                            </div>
                                        </div>
                                        <div className={styles.sectionHeaderMain}>
                                            <h2 className={styles.sectionTitleMain}>Celebration Timeline.</h2>
                                            <p className={styles.sectionSubtitleMain}>
                                                Define the key ceremonies and moments of your wedding celebration.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.wizardCard}>
                                        <CelebrationTimeline
                                            errors={errors}
                                            setErrors={setErrors}
                                            expandedEventId={expandedEventId}
                                            setExpandedEventId={setExpandedEventId}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formFooter}>
                                    <div className={styles.footerProgressBarContainer}>
                                        <motion.div 
                                            className={styles.footerProgressBar}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {(formData.events || []).every(e => !!e.date && !!e.time) && (
                                            <motion.div 
                                                key="note3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={clsx(styles.formSuccessMessage, styles.footerMessage)}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <CheckCircle size={18} color="#D4AF37" />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                                                    animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    <span>Guests respond effortlessly</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        Back
                                    </button>
                                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                        Continue Setup
                                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                        
                        {step === 4 && (
                            <motion.div 
                                key="step4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={styles.splitLayout}
                            >
                            <div className={styles.rsvpPreviewContainer}>
                                <div className={styles.miniCard}>
                                    <div className={styles.miniCardTopText}>
                                        You are joyfully invited <br /> to the wedding of
                                    </div>
                                    <div className={styles.miniCardNames}>
                                        {formData.groomName || 'Rahul'} 
                                        <span className={styles.miniCardAmpersand}>&</span> 
                                        {formData.brideName || 'Anjalee'}
                                    </div>
                                    
                                    <div className={styles.miniCardMessageBox}>
                                        <p className={styles.miniCardMessageText}>
                                            {formData.invitationMessage || "We're so excited to celebrate our special day with our dearest friends and family! Please join us for an evening of love and laughter."}
                                        </p>
                                    </div>

                                    <div className={styles.miniCardRSVPLabel}>RSVP</div>
                                    
                                    <div className={styles.miniCardEventTitle}>
                                        THE {formData.eventType?.toUpperCase() || 'WEDDING'} CEREMONY
                                    </div>
                                    <div className={styles.miniCardDate}>
                                        {formData.primaryDate ? new Date(formData.primaryDate).toLocaleDateString('en-GB', { 
                                            weekday: 'long', 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        }) : 'Sunday, 15th of March 2026'}
                                        {' • '}
                                        {formData.primaryTime || '19:00'} onwards
                                    </div>

                                    <div className={styles.miniCardButton}>
                                        Respond to Invitation
                                    </div>

                                    <Link href="/" className={styles.miniCardFooter}>
                                        POWERED BY NIMANTRANSTUDIO
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.formContent}>
                                    <div className={styles.sectionHeaderInner}>
                                        <div className={styles.stepHeaderContainer}>
                                            <div className={styles.stepHeaderInfo}>
                                                <div className={styles.stepBadge}>{step}</div>
                                                <span className={styles.stepStepText}>Step {step} of 4</span>
                                            </div>
                                            <div className={styles.stepTiming}>
                                                <Clock size={14} />
                                                <span>Takes 15 seconds</span>
                                            </div>
                                        </div>
                                        <div className={styles.sectionHeaderMain}>
                                            <h2 className={styles.sectionTitleMain}>Personal Message.</h2>
                                            <p className={styles.sectionSubtitleMain}>
                                                Add a heart-touching message for your guests.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.wizardCard}>
                                        <Input
                                            label="Personal Welcome Message"
                                            value={formData.invitationMessage || ''}
                                            onChange={(e) => updateFormData({ invitationMessage: e.target.value })}
                                            placeholder="We're so excited to celebrate our special day with our dearest friends and family! Please join us for an evening of love and laughter."
                                            type="textarea"
                                            className={styles.textareaInput}
                                            maxLength={1000}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formFooter}>
                                    <div className={styles.footerProgressBarContainer}>
                                        <motion.div 
                                            className={styles.footerProgressBar}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {!!formData.invitationMessage?.trim() && (
                                            <motion.div 
                                                key="note4"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={clsx(styles.formSuccessMessage, styles.footerMessage)}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    <CheckCircle size={18} color="#D4AF37" />
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                                                    animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    <span>Invitation ready for sharing</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        Back
                                    </button>
                                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                        Finish & Preview
                                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                <LoginModal 
                    isOpen={showLoginModal} 
                    onClose={() => setShowLoginModal(false)}
                    onSuccess={handleLoginSuccess}
                />
            </main>
        </div>
    );
}

// --- Internal Components ---

function formatDateDisplay(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function CelebrationTimeline({ errors, setErrors, expandedEventId, setExpandedEventId }: any) {
    const { formData, updateFormData } = useWeddingStore();
    
    const updateEvent = (id: string, updates: Partial<WeddingEvent>) => {
        const newEvents = (formData.events || []).map(e => 
            e.id === id ? { ...e, ...updates } : e
        );
        updateFormData({ events: newEvents });
        
        // Clear errors for this field
        const keyPrefix = `${id}-`;
        const newErrors = { ...errors };
        Object.keys(updates).forEach(key => {
            delete newErrors[keyPrefix + key];
        });
        setErrors(newErrors);
    };

    return (
        <div className={styles.timelineList}>
            {(formData.events || []).map((event, index) => (
                <div key={event.id} className={clsx(styles.timelineItem, expandedEventId === event.id && styles.timelineItemExpanded)}>
                    <button 
                        className={styles.timelineHeader}
                        onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                    >
                        <div className={styles.timelineHeaderLeft}>
                            <div className={clsx(styles.timelineStatus, !!event.date && !!event.time && styles.statusComplete)}>
                                {!!event.date && !!event.time ? <CheckCircle size={14} /> : <Circle size={14} />}
                            </div>
                            <span className={styles.timelineEventName}>{event.name}</span>
                        </div>
                        <div className={styles.timelineHeaderRight}>
                            <span className={styles.timelineDateValue}>{event.date ? formatDateDisplay(event.date) : 'Set date'}</span>
                            <ChevronDown size={18} className={clsx(styles.chevron, expandedEventId === event.id && styles.chevronRotate)} />
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {expandedEventId === event.id && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={styles.timelineContent}
                            >
                                <div className={formStyles.grid}>
                                    <Input
                                        label="Date"
                                        type="date"
                                        value={event.date || ''}
                                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                                        error={errors[`${event.id}-date`]}
                                    />
                                    <Input
                                        label="Time"
                                        type="time"
                                        value={event.time || ''}
                                        onChange={(e) => updateEvent(event.id, { time: e.target.value })}
                                        error={errors[`${event.id}-time`]}
                                    />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Input
                                            label="Venue"
                                            value={event.venue || ''}
                                            onChange={(e) => updateEvent(event.id, { venue: e.target.value })}
                                            placeholder="Same as wedding venue or specify new"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}


function WeddingCelebration() {
    const particles = useRef(
        Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: -10 - Math.random() * 20,
            size: 8 + Math.random() * 12,
            type: ['heart', 'petal', 'sparkle', 'flake'][Math.floor(Math.random() * 4)],
            color: ['#D4AF37', '#FDFBF7', '#FDA4AF', '#EBCDC3'][Math.floor(Math.random() * 4)],
            duration: 4.0 + Math.random() * 2.0, // Slowed down fall speed
            delay: Math.random() * 0.8,
            rotation: Math.random() * 360,
            drift: (Math.random() - 0.5) * 40
        }))
    );

    return (
        <div className={styles.confettiContainer}>
            {particles.current.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: `${p.y}vh`, x: `${p.x}vw`, rotate: p.rotation, opacity: 0 }}
                    animate={{ 
                        y: '110vh', 
                        x: `${p.x + p.drift}vw`,
                        rotate: p.rotation + 360,
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                        duration: p.duration, 
                        delay: p.delay, 
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className={styles.particle}
                    style={{ 
                        width: p.size, 
                        height: p.size,
                        color: p.color
                    }}
                >
                    {p.type === 'heart' && <Heart size={p.size} fill="currentColor" />}
                    {p.type === 'petal' && <Leaf size={p.size} fill="currentColor" />}
                    {p.type === 'sparkle' && <Sparkles size={p.size} fill="currentColor" />}
                    {p.type === 'flake' && <Sun size={p.size} fill="currentColor" />}
                </motion.div>
            ))}
        </div>
    );
}
