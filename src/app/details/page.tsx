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
                                                    label="Address"
                                                    value={formData.defaultVenueName || ''}
                                                    onChange={(e) => {
                                                        updateFormData({ defaultVenueName: e.target.value });
                                                        if (errors.defaultVenueName) setErrors(errs => ({ ...errs, defaultVenueName: '' }));
                                                    }}
                                                    placeholder="e.g. The Grand Palace, 123 Royal Road, Jaipur"
                                                    type="textarea"
                                                    error={errors.defaultVenueName}
                                                    maxLength={500}
                                                />

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
                                    <div className={styles.miniCardIcon}>
                                        <Calendar size={28} />
                                    </div>
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

                                    <div className={styles.miniCardDivider} />
                                    
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
                                        <ArrowRight size={18} />
                                    </div>

                                    <div className={styles.miniCardFooter}>
                                        POWERED BY NIMANTRANSTUDIO
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSide}>
                                <div className={styles.formContent}>
                                    <div className={styles.sectionHeaderInner}>
                                        <div className={styles.stepHeaderContainer}>
                                            <div className={styles.stepHeaderInfo}>
                                                <div className={styles.stepBadge}>4</div>
                                                <span className={styles.stepStepText}>Step 4 of 4</span>
                                            </div>
                                            <div className={styles.stepTiming}>
                                                <Clock size={14} />
                                                <span>Takes 30 seconds</span>
                                            </div>
                                        </div>
                                        <div className={styles.sectionHeaderMain}>
                                            <h1 className={styles.rsvpTitle} style={{ marginTop: 0 }}>Host Your Event</h1>
                                            <p className={styles.rsvpSubtitle}>
                                                Create a beautiful, distraction-free RSVP link to share with your loved ones via WhatsApp
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.wizardCard}>
                                        <div className={formStyles.grid}>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <Input
                                                    label="EVENT NAME"
                                                    value={`${formData.groomName || 'Rahul'} and ${formData.brideName || 'Anjalee'}'s Wedding`}
                                                    readOnly
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <Input
                                                    label="WELCOME MESSAGE"
                                                    placeholder="Ex: We can't wait to celebrate with you!"
                                                    type="textarea"
                                                    value={formData.invitationMessage || ''}
                                                    onChange={(e) => updateFormData({ invitationMessage: e.target.value })}
                                                />
                                            </div>
                                            <Input
                                                label="DATE"
                                                type="date"
                                                value={formData.primaryDate || ''}
                                                onChange={(e) => updateFormData({ primaryDate: e.target.value })}
                                            />
                                            <Input
                                                label="TIME"
                                                type="time"
                                                value={formData.primaryTime || ''}
                                                onChange={(e) => updateFormData({ primaryTime: e.target.value })}
                                            />
                                            <div className={formStyles.field}>
                                                <label className={formStyles.label}>EVENT TYPE</label>
                                                <select 
                                                    className={styles.selectInput}
                                                    value={formData.eventType || 'Wedding'}
                                                    onChange={(e) => updateFormData({ eventType: e.target.value })}
                                                >
                                                    <option value="Wedding">Wedding</option>
                                                    <option value="Reception">Reception</option>
                                                    <option value="Sangeet">Sangeet</option>
                                                    <option value="Engagement">Engagement</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <Input
                                                label="RSVP DEADLINE (OPTIONAL)"
                                                type="date"
                                                value={formData.rsvpDeadline || ''}
                                                onChange={(e) => updateFormData({ rsvpDeadline: e.target.value })}
                                            />
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
                                                    <span>Ready to share</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button className={styles.backBtn} onClick={handleBack}>
                                        Back
                                    </button>
                                    <button className={styles.continueBtn} onClick={handleNext} disabled={isSaving}>
                                        {isSaving ? 'Finalizing...' : 'Finalize & Preview'}
                                        <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </main>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </div >
    );
}

// --- Helpers ---
function formatDateDisplay(dateStr?: string) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthStr = date.toLocaleString('default', { month: 'short' });
    return `${day}-${monthStr}-${year}`;
}

function getDefaultWelcomeMessage(eventName: string): string {
    const name = eventName.toLowerCase();
    if (name.includes('haldi')) return "Bless the couple with showers of yellow health and happiness";
    if (name.includes('mehendi')) return "Join at the mehendi event, with the \"Hands full of mehendi , hearts full of love\"";
    if (name.includes('sangeet')) return "Join us to turn up the volume \"Naach. gaana aur full-on hungama!\"";
    if (name.includes('wedding')) return "We are pleased to invite you to the wedding of";
    if (name.includes('reception')) return "We are pleased to invite you to the reception of";
    return "";
}

function getDefaultHeading(eventName: string): string {
    const name = eventName.toLowerCase();
    if (name.includes('haldi')) return "Haldi Ceremony";
    if (name.includes('mehendi')) return "Mehendi Ceremony";
    if (name.includes('sangeet')) return "Sangeet Ceremoney";
    if (name.includes('wedding')) return "Wedding Ceremony";
    if (name.includes('reception')) return "Reception Ceremony";
    return `${eventName} Ceremony`;
}

// --- Sub Components ---

function CelebrationTimeline({ errors, setErrors, expandedEventId, setExpandedEventId }: { errors: Record<string, string>, setErrors: any, expandedEventId: string | null, setExpandedEventId: any }) {
    const { formData, updateFormData, addEvent, removeEvent, updateEvent } = useWeddingStore();

    const toggleEvent = (id: string) => {
        setExpandedEventId(expandedEventId === id ? null : id);
    };

    return (
        <div className={styles.eventTimelineContainer}>
            <div className={styles.eventTimelineSection}>
                {(formData.events || []).map((event, index) => (
                    <div
                        key={event.id}
                        className={clsx(
                            styles.eventCard,
                            expandedEventId === event.id && styles.eventCardActive
                        )}
                    >
                        <div
                            className={styles.eventCardHeader}
                            onClick={() => toggleEvent(event.id)}
                        >
                            <div className={styles.eventCardTitle}>{event.name}</div>
                            <div className={styles.eventCardToggle}>
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        {expandedEventId === event.id && (
                            <div className={styles.eventCardBody}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className={styles.eventFieldRow}>
                                        <Input
                                            label="Date"
                                            type="date"
                                            value={event.date || ''}
                                            onChange={(e) => {
                                                updateEvent(event.id, { date: e.target.value });
                                                setErrors((prev: any) => ({ ...prev, [`${event.id}-date`]: '' }));
                                            }}
                                            error={errors[`${event.id}-date`]}
                                        />
                                        <Input
                                            label="Time"
                                            type="time"
                                            value={event.time || ''}
                                            onChange={(e) => {
                                                updateEvent(event.id, { time: e.target.value });
                                                setErrors((prev: any) => ({ ...prev, [`${event.id}-time`]: '' }));
                                            }}
                                            error={errors[`${event.id}-time`]}
                                        />
                                    </div>

                                    <Input
                                        label="Venue"
                                        value={event.venue || ''}
                                        onChange={(e) => updateEvent(event.id, { venue: e.target.value, isCustomVenue: !!e.target.value })}
                                        placeholder="Inherits from Global if empty"
                                        type="textarea"
                                    />

                                    <button
                                        className={styles.removeEventBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeEvent(event.id);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Remove Event
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}


            </div>
        </div>
    );
}

function ArchitectureSummary() {
    const { formData } = useWeddingStore();
    return (
        <div className={styles.summaryScroll}>
            <div className={styles.summaryHeader}>
                <ShieldCheck size={28} color="#059669" />
                <h2 style={{ margin: 0 }}>Global Wedding Identity</h2>
            </div>

            <div className={styles.summaryList}>
                <div className={styles.summaryItem}>
                    <Users size={18} />
                    <span>{formData.brideName} & {formData.groomName}</span>
                </div>
                <div className={styles.summaryItem}>
                    <Calendar size={18} />
                    <span>{formatDateDisplay(formData.primaryDate)} (Default Date)</span>
                </div>
                <div className={styles.summaryItem}>
                    <MapPin size={18} />
                    <span>{formData.defaultVenueName} (Default Venue)</span>
                </div>
            </div>

            <div className={styles.eventsTimeline}>
                {(formData.events || []).map((e, i) => (
                    <div key={e.id} className={styles.summaryEventCard}>
                        <div className={styles.eventTimeInfo}>
                            <div style={{ fontWeight: 700 }}>{e.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                {formatDateDisplay(e.date || formData.primaryDate)} @ {e.time || 'TBD'}
                            </div>
                        </div>
                        <div className={styles.inheritanceBadge}>
                            {!e.date && !e.isCustomVenue ? 'INHERITED' : 'CUSTOMIZED'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Confetti Particles Component ---
function WeddingCelebration() {
    const [particles] = useState(() => 
        Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            size: 8 + Math.random() * 12,
            type: ['heart', 'petal', 'sparkle', 'flake'][Math.floor(Math.random() * 4)],
            color: ['#D4AF37', '#FDFBF7', '#FDA4AF', '#EBCDC3'][Math.floor(Math.random() * 4)],
            duration: 4.0 + Math.random() * 2.0,
            delay: Math.random() * 0.8,
            rotation: Math.random() * 360,
            drift: (Math.random() - 0.5) * 40
        }))
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
                        x: `${p.x}vw`,
                        y: `${p.y}vh`,
                        rotate: p.rotation,
                        opacity: 1,
                        scale: 0.5
                    }}
                    animate={{
                        y: '110vh',
                        x: `${p.x + p.drift}vw`,
                        rotate: p.rotation + 720,
                        opacity: [1, 1, 0],
                        scale: [0.8, 1, 0.7]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        color: p.color,
                        filter: p.size < 12 ? 'blur(1px)' : 'none',
                        opacity: 0.8
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
                            width: 2,
                            height: p.size,
                            background: 'currentColor',
                            boxShadow: `0 0 ${p.size / 2}px currentColor`
                        }} />
                    )}
                    {p.type === 'flake' && (
                        <div style={{
                            width: p.size / 2,
                            height: p.size / 2,
                            background: 'currentColor',
                            borderRadius: '2px'
                        }} />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
