'use client';

import React, { useState, useEffect } from 'react';
import styles from './rsvp.module.css';
import { Calendar, MapPin, Check, Info, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { FloatingFlowers } from '@/components/ui/FloatingFlowers';
import { MandalaBackground } from '@/components/ui/MandalaBackground';
import { FlowerPetalDrift } from '@/components/ui/FlowerPetalDrift';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './components/CountdownTimer';
import { RoyalSanctuaryDoors } from './components/RoyalSanctuaryDoors';
import { BackgroundAudioPlayer } from './components/BackgroundAudioPlayer';
import { EventCard, WeddingEventItem } from './components/EventCard';
import { GaneshaIcon } from './components/GaneshaIcon';
import { RoyalCoverScreen } from './components/RoyalCoverScreen';

interface RSVPFormProps {
    wedding: any;
    isPreview?: boolean;
}

type Step = 'INVITE' | 'SUCCESS' | 'ALREADY_REGISTERED';

// Motion animation variants adhering to Emil Kowalski & Impeccable luxury animation guidelines (Refined Smooth Cinematic Reveal)
const slowContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.32,
            delayChildren: 0.15,
        },
    },
};

const slowItemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const coupleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.32,
            delayChildren: 0.1,
        },
    },
};

const ampersandVariants = {
    hidden: { opacity: 0, scale: 0.75, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const flourishVariants = {
    hidden: { opacity: 0, scale: 0.88, filter: 'blur(4px)' },
    visible: {
        opacity: 0.65,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const dividerVariants = {
    hidden: { opacity: 0, scaleX: 0.4, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        scaleX: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export const RSVPForm = ({ wedding, isPreview = false }: RSVPFormProps) => {
    const [step, setStep] = useState<Step>('INVITE');
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPetals, setShowSuccessPetals] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Form state
    const [status, setStatus] = useState<'attending' | 'maybe' | 'declined'>('attending');
    const [guestName, setGuestName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [phone, setPhone] = useState('');
    const [adultCount, setAdultCount] = useState(1);
    const [stepperDir, setStepperDir] = useState<'up' | 'down'>('up');
    const [message, setMessage] = useState('');

    const handleIncrementGuests = () => {
        setStepperDir('up');
        setAdultCount((prev) => Math.min(10, prev + 1));
    };

    const handleDecrementGuests = () => {
        setStepperDir('down');
        setAdultCount((prev) => Math.max(1, prev - 1));
    };

    const coupleNames = [wedding.groomName, wedding.brideName].filter(Boolean).join(' & ');

    // Helper to format parent names dynamically
    const formatParentName = (name?: string | null) => {
        if (!name || !name.trim()) return '';
        const trimmed = name.trim();
        if (
            trimmed.toLowerCase().startsWith('mr') ||
            trimmed.toLowerCase().startsWith('smt') ||
            trimmed.toLowerCase().startsWith('shri') ||
            trimmed.toLowerCase().startsWith('dr')
        ) {
            return trimmed;
        }
        return `Mr. & Mrs. ${trimmed}`;
    };

    const groomParentsFormatted = formatParentName(wedding.groomParents);
    const brideParentsFormatted = formatParentName(wedding.brideParents);

    // Find primary wedding event or date dynamically
    const eventsList: WeddingEventItem[] = wedding.events || [];
    const mainWeddingEvent =
        eventsList.find(
            (e) =>
                e.name?.toLowerCase().includes('wedding') ||
                e.eventType === 'Wedding' ||
                e.name?.toLowerCase().includes('shaadi') ||
                e.name?.toLowerCase().includes('phera')
        ) ||
        eventsList.find((e) => e.date && e.date.trim()) ||
        eventsList[0];

    const primaryDateStr =
        mainWeddingEvent?.date ||
        (wedding as any).primaryDate ||
        (wedding as any).weddingDate ||
        (wedding as any).date ||
        null;

    const primaryTimeStr =
        mainWeddingEvent?.time ||
        (wedding as any).primaryTime ||
        (wedding as any).time ||
        null;

    const formattedPrimaryDate = primaryDateStr
        ? (() => {
              try {
                  const d = new Date(primaryDateStr);
                  if (isNaN(d.getTime())) return primaryDateStr;
                  return d.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                  });
              } catch {
                  return primaryDateStr;
              }
          })()
        : null;

    const footerDateFormatted = primaryDateStr
        ? (() => {
              try {
                  const d = new Date(primaryDateStr);
                  if (isNaN(d.getTime())) return primaryDateStr.toUpperCase();
                  return d.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                  }).toUpperCase();
              } catch {
                  return primaryDateStr.toUpperCase();
              }
          })()
        : '';

    const venueLocation =
        mainWeddingEvent?.venue ||
        mainWeddingEvent?.venueName ||
        mainWeddingEvent?.address ||
        (wedding as any).venue ||
        (wedding as any).address ||
        null;

    const hasVenue = Boolean(venueLocation && venueLocation.trim() && venueLocation !== 'Venue details to follow');

    useEffect(() => {
        if (isPreview) return;
        const eventId = wedding.events?.[0]?.id || wedding.id;

        // Reset if user has ?reset=true or ?preview=true in query params
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (
                params.get('reset') === 'true' ||
                params.get('preview') === 'true' ||
                params.get('test') === 'true' ||
                params.get('test') === '1'
            ) {
                if (params.get('reset') === 'true' && eventId) {
                    localStorage.removeItem(`rsvp_submitted_${eventId}`);
                }
                if (params.get('opened') === 'true') {
                    setIsCoverOpen(true);
                }
                setStep('INVITE');
                return;
            }

            if (params.get('opened') === 'true') {
                setIsCoverOpen(true);
            }
        }

        if (eventId) {
            const hasSubmitted = localStorage.getItem(`rsvp_submitted_${eventId}`);
            if (hasSubmitted) {
                setStep('ALREADY_REGISTERED');
                setIsCoverOpen(true);
            }
        }
    }, [wedding, isPreview]);

    const handleResetAndInvite = () => {
        const eventId = wedding.events?.[0]?.id || wedding.id;
        if (eventId) localStorage.removeItem(`rsvp_submitted_${eventId}`);
        setStep('INVITE');
        setIsCoverOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!guestName.trim()) {
            setNameError(true);
            const input = document.getElementById('rsvp-guest-name');
            if (input) input.focus();
            return;
        }
        setNameError(false);

        setIsSubmitting(true);
        setSubmitError(null);

        const data = {
            guestName: guestName.trim(),
            status,
            adultCount: Number(adultCount) || 1,
            childCount: 0,
            phone: phone.trim(),
            message: message.trim(),
        };

        try {
            const response = await fetch(`/api/rsvp/${wedding.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const eventId = wedding.events?.[0]?.id || wedding.id;
                if (eventId) localStorage.setItem(`rsvp_submitted_${eventId}`, 'true');
                setShowSuccessPetals(true);
                setTimeout(() => setStep('SUCCESS'), 350);
            } else {
                setSubmitError('Something went wrong while saving your RSVP. Please try again.');
            }
        } catch {
            setSubmitError('Could not connect to the server. Please check your network and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenMaps = () => {
        if (!venueLocation) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueLocation)}`, '_blank');
    };

    const renderDecorations = () => (
        <>
            <MandalaBackground isPreview={isPreview} />
            <FloatingFlowers isPreview={isPreview} />
        </>
    );

    // ─── STEP: ALREADY REGISTERED ──────────────────────────────────────────
    if (step === 'ALREADY_REGISTERED') {
        return (
            <div className={clsx(styles.wrapper, isPreview && styles.previewWrapper)}>
                {renderDecorations()}
                {!isPreview && (
                    <BackgroundAudioPlayer
                        audioUrl={wedding.audioUrl || wedding.musicUrl || '/music/shubha-aagaman.m4a'}
                        autoPlayTrigger={true}
                    />
                )}

                <motion.div
                    className={clsx(styles.websiteCard, isPreview && styles.previewCard)}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                >
                    <div className={styles.successContent}>
                        <div className={styles.successIcon} style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}>
                            <Info size={40} color="#D97706" />
                        </div>
                        <h2 className={styles.successTitle}>Already Registered</h2>
                        <p className={styles.successText}>
                            You have already shared your response for {coupleNames}&apos;s wedding. We have safely recorded your details and can&apos;t wait to celebrate!
                        </p>

                        {hasVenue && (
                            <div className={styles.actionButtons} style={{ marginTop: '1.25rem' }}>
                                <button className={styles.actionBtn} onClick={handleOpenMaps}>
                                    <MapPin size={16} /> Open Venue in Maps
                                </button>
                            </div>
                        )}

                        <div className={styles.buttonWrapper} style={{ marginTop: '1.5rem' }}>
                            <button type="button" onClick={handleResetAndInvite} className={styles.backButton}>
                                View Wedding Invitation & Form
                            </button>
                        </div>
                    </div>

                    <Link href="/" className={styles.poweredByCard}>
                        crafted with love on
                        <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    // ─── STEP: SUCCESS CONFIRMATION ─────────────────────────────────────────
    if (step === 'SUCCESS') {
        const successMessage =
            status === 'declined'
                ? 'Your warm blessings and wishes mean the world to the couple.'
                : status === 'maybe'
                ? 'We hope you can make it — crossing our fingers to see you there!'
                : 'Your presence has been confirmed. We cannot wait to celebrate these joyous moments with you!';

        return (
            <div className={clsx(styles.wrapper, isPreview && styles.previewWrapper)}>
                {renderDecorations()}
                {showSuccessPetals && <FlowerPetalDrift />}
                {!isPreview && (
                    <BackgroundAudioPlayer
                        audioUrl={wedding.audioUrl || wedding.musicUrl || '/music/shubha-aagaman.m4a'}
                        autoPlayTrigger={true}
                    />
                )}

                <motion.div
                    className={clsx(styles.websiteCard, isPreview && styles.previewCard)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.55 }}
                >
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>
                            <Check size={42} strokeWidth={3} />
                        </div>

                        <h2 className={styles.successTitle}>Thank You, {guestName}!</h2>
                        <p className={styles.successText}>{successMessage}</p>

                        {status !== 'declined' && formattedPrimaryDate && (
                            <div className={styles.seeYouBadge}>
                                <span>See you on {formattedPrimaryDate}!</span>
                            </div>
                        )}

                        <div className={styles.successDivider} />

                        {hasVenue && (
                            <div className={styles.actionButtons}>
                                <button className={styles.actionBtn} onClick={handleOpenMaps}>
                                    <MapPin size={16} /> Open Venue in Maps
                                </button>
                            </div>
                        )}
                    </div>

                    <Link href="/" className={styles.poweredByCard}>
                        crafted with love on
                        <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    // ─── STEP: FULL WEDDING INVITATION WEBSITE ──────────────────────────────
    return (
        <div className={clsx(styles.wrapper, isPreview && styles.previewWrapper)}>
            {renderDecorations()}
            {showSuccessPetals && <FlowerPetalDrift />}
            {!isPreview && (
                <BackgroundAudioPlayer
                    audioUrl={wedding.audioUrl || wedding.musicUrl || '/music/shubha-aagaman.m4a'}
                    autoPlayTrigger={isCoverOpen}
                />
            )}

            <AnimatePresence mode="wait">
                {!isCoverOpen ? (
                    <RoyalCoverScreen
                        key="royal-cover-screen"
                        wedding={wedding}
                        onOpen={() => setIsCoverOpen(true)}
                        isPreview={isPreview}
                    />
                ) : (
                    <motion.div
                        key="rsvp-invitation-card"
                        className={clsx(styles.websiteCard, isPreview && styles.previewCard)}
                        initial={{ opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.65 }}
                    >
                        {/* 1. DETAILED ROYAL INVITATION HERO SECTION (Slow Progressive Text Stagger Reveal) */}
                        <motion.header
                            className={styles.heroDetailedSection}
                            variants={slowContainerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Top-Left Botanical Corner Flourish */}
                            <motion.div variants={flourishVariants} className={styles.cornerFlourishTL} aria-hidden="true">
                                <svg width="64" height="64" viewBox="0 0 60 60" fill="none">
                                    <path d="M6 6 C20 6 48 18 54 54 C40 30 24 16 6 6 Z" stroke="rgba(197, 160, 89, 0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 6 C16 18 24 34 28 46" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </motion.div>

                            {/* Top-Right Botanical Corner Flourish */}
                            <motion.div variants={flourishVariants} className={styles.cornerFlourishTR} aria-hidden="true">
                                <svg width="64" height="64" viewBox="0 0 60 60" fill="none">
                                    <path d="M54 6 C40 6 12 18 6 54 C20 30 36 16 54 6 Z" stroke="rgba(197, 160, 89, 0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M54 6 C44 18 36 34 32 46" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </motion.div>

                            {/* Divine Blessing Inscription (Individual line reveals) */}
                            <motion.div variants={slowContainerVariants} className={styles.heroBlessingText}>
                                <motion.p variants={slowItemVariants}>With the blessings of the divine</motion.p>
                                <motion.p variants={slowItemVariants}>and the love of our families</motion.p>
                            </motion.div>

                            {/* Together We Invite Pre-header */}
                            <motion.div variants={slowItemVariants} className={styles.heroInviteTag}>
                                TOGETHER WE INVITE YOU TO CELEBRATE
                            </motion.div>

                            {/* Vertical Royal Lineage & Couple Block */}
                            <motion.div variants={coupleContainerVariants} className={styles.heroVerticalCoupleBlock}>
                                {/* 1. Groom & Parental Lineage */}
                                <motion.div variants={slowItemVariants} className={styles.heroPersonBlock}>
                                    <h1 className={styles.heroPersonName}>{wedding.groomName}</h1>
                                    {wedding.groomParents && (
                                        <div className={styles.heroPersonLineage}>
                                            <span className={styles.heroPersonRole}>Son of</span>
                                            <span className={styles.heroPersonParents}>{groomParentsFormatted}</span>
                                        </div>
                                    )}
                                </motion.div>

                                {/* 2. Central Elegant Ampersand Divider */}
                                <motion.div variants={ampersandVariants} className={styles.heroVerticalAmpersandWrap}>
                                    <span className={styles.heroAmpersand}>&amp;</span>
                                </motion.div>

                                {/* 3. Bride & Parental Lineage */}
                                <motion.div variants={slowItemVariants} className={styles.heroPersonBlock}>
                                    <h1 className={styles.heroPersonName}>{wedding.brideName}</h1>
                                    {wedding.brideParents && (
                                        <div className={styles.heroPersonLineage}>
                                            <span className={styles.heroPersonRole}>Daughter of</span>
                                            <span className={styles.heroPersonParents}>{brideParentsFormatted}</span>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>

                            {/* Auspicious Occasions Note */}
                            <motion.div variants={slowItemVariants} className={styles.heroOccasionsText}>
                                On the following auspicious occasions
                            </motion.div>

                            {/* Diamond Hairline Divider 2 (Placed below Auspicious Occasions) */}
                            <motion.div variants={dividerVariants} className={styles.heroDiamondDivider}>
                                <span className={styles.diamondLine} />
                                <span className={styles.diamondSymbol}>◆</span>
                                <span className={styles.diamondLine} />
                            </motion.div>

                            {/* 2. INTERACTIVE ROYAL SANCTUARY GATES & COUNTDOWN SECTION (Reveals after Auspicious Occasions line) */}
                            <motion.div variants={slowItemVariants} style={{ width: '100%' }}>
                                <RoyalSanctuaryDoors
                                    targetDateStr={primaryDateStr}
                                    targetTimeStr={primaryTimeStr}
                                    venueLocation={venueLocation}
                                />
                            </motion.div>
                        </motion.header>

                        {/* Personal Invitation Message if provided */}
                        {wedding.invitationMessage && wedding.invitationMessage.trim() && (
                            <motion.div
                                className={styles.quoteCard}
                                style={{ marginTop: '1rem', marginBottom: '2.5rem' }}
                                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <p className={styles.quoteText}>
                                    &ldquo;{wedding.invitationMessage}&rdquo;
                                </p>
                            </motion.div>
                        )}

                        <motion.div
                            className={styles.ornamentDivider}
                            initial={{ opacity: 0, scale: 0.88, filter: 'blur(4px)' }}
                            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.ornamentLine} />
                            <span>✦ ❦ ✦</span>
                            <div className={styles.ornamentLine} />
                        </motion.div>

                        {/* 3. CELEBRATIONS & CEREMONY TIMELINE */}
                        <motion.section
                            className={styles.eventsSection}
                            variants={slowContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <motion.div variants={slowItemVariants} className={styles.sectionHeaderWrap}>
                                <span className={styles.sectionSubHead}>THE CELEBRATIONS</span>
                                <h2 className={styles.sectionTitle}>Wedding Itinerary</h2>
                                <p className={styles.sectionSubtitle}>
                                    Join us in each step of our sacred and joyous celebration
                                </p>
                            </motion.div>

                            <div className={styles.eventsTimeline}>
                                {eventsList.length > 0 ? (
                                    eventsList.map((evt, idx) => (
                                        <EventCard
                                            key={evt.id || idx}
                                            event={evt}
                                            coupleNames={coupleNames}
                                            index={idx}
                                        />
                                    ))
                                ) : primaryDateStr || venueLocation ? (
                                    <EventCard
                                        event={{
                                            id: 'primary-event',
                                            name: mainWeddingEvent?.name || (wedding as any).eventType || 'Wedding Ceremony',
                                            date: primaryDateStr || '',
                                            time: primaryTimeStr || '',
                                            venue: venueLocation || '',
                                            description: (wedding as any).description || '',
                                        }}
                                        coupleNames={coupleNames}
                                        index={0}
                                    />
                                ) : null}
                            </div>
                        </motion.section>

                        {/* 4. INTERACTIVE RSVP FORM */}
                        <motion.section
                            id="rsvp-section"
                            className={styles.rsvpSection}
                            variants={slowContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <motion.div variants={slowItemVariants} className={styles.sectionHeaderWrap}>
                                <span className={styles.sectionSubHead}>JOIN THE CELEBRATION</span>
                                <h2 className={styles.sectionTitle}>Confirm Your Presence</h2>
                                <p className={styles.sectionSubtitle}>
                                    Please let us know if you can join our celebration
                                </p>
                            </motion.div>

                            <form id="rsvp-form" className={styles.form} onSubmit={handleSubmit} noValidate>
                                {/* Attendance Segmented Tabs */}
                                <motion.div variants={slowItemVariants} className={styles.field}>
                                    <label className={styles.fieldLabel}>
                                        <span>Will you be attending?</span>
                                    </label>
                                    <div className={styles.segmentedControl}>
                                        {(
                                            [
                                                { id: 'attending', label: "I'll be there 🎉" },
                                                { id: 'maybe', label: 'Will try 🤞' },
                                                { id: 'declined', label: 'Sending wishes 💛' },
                                            ] as const
                                        ).map((opt) => (
                                            <motion.button
                                                key={opt.id}
                                                type="button"
                                                className={styles.segmentedTab}
                                                data-active={status === opt.id}
                                                onClick={() => setStatus(opt.id)}
                                                whileTap={{ scale: 0.96 }}
                                            >
                                                {status === opt.id && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className={styles.segmentedPill}
                                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                                    />
                                                )}
                                                <span className={styles.segmentedLabel}>{opt.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                    <div className={styles.feedbackMessage}>
                                        {status === 'attending' && "Can't wait to celebrate with you 🎉"}
                                        {status === 'maybe' && 'Hope you can make it 🤍'}
                                        {status === 'declined' && 'Your warm wishes mean so much 💛'}
                                    </div>
                                </motion.div>

                                {/* Guest Name */}
                                <motion.div variants={slowItemVariants} className={styles.field}>
                                    <label htmlFor="rsvp-guest-name" className={styles.fieldLabel}>
                                        <span>Your Full Name</span>
                                        {nameError && <span className={styles.fieldErrorText}>Name is required</span>}
                                    </label>
                                    <input
                                        id="rsvp-guest-name"
                                        type="text"
                                        placeholder="e.g. Rahul Patil / The Sharma Family"
                                        className={clsx(styles.input, nameError && styles.inputError)}
                                        value={guestName}
                                        onChange={(e) => {
                                            setGuestName(e.target.value);
                                            if (e.target.value.trim()) setNameError(false);
                                        }}
                                    />
                                </motion.div>

                                {/* Number of Guests & Phone */}
                                <motion.div variants={slowItemVariants} className={styles.row}>
                                    <div className={styles.field}>
                                        <label className={styles.fieldLabel}>
                                            <span>Total Guests</span>
                                        </label>
                                        <div className={styles.stepperWrap}>
                                            <motion.button
                                                type="button"
                                                className={styles.stepperBtn}
                                                onClick={handleDecrementGuests}
                                                disabled={adultCount <= 1}
                                                whileTap={{ scale: 0.92 }}
                                            >
                                                -
                                            </motion.button>
                                            <div className={styles.stepperValueBox}>
                                                <AnimatePresence mode="popLayout" initial={false}>
                                                    <motion.span
                                                        key={adultCount}
                                                        className={styles.stepperValue}
                                                        initial={{ y: stepperDir === 'up' ? 12 : -12, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: stepperDir === 'up' ? -12 : 12, opacity: 0 }}
                                                        transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
                                                    >
                                                        {adultCount}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </div>
                                            <motion.button
                                                type="button"
                                                className={styles.stepperBtn}
                                                onClick={handleIncrementGuests}
                                                whileTap={{ scale: 0.92 }}
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className={styles.field}>
                                        <label className={styles.fieldLabel}>
                                            <span>Phone Number</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="e.g. 9876543210"
                                            className={styles.input}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </motion.div>

                                {/* RSVP Deadline */}
                                {wedding.rsvpDeadline && (
                                    <motion.p variants={slowItemVariants} className={styles.deadlineNotice}>
                                        Kindly confirm your attendance by{' '}
                                        <strong>
                                            {new Date(wedding.rsvpDeadline).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </strong>
                                    </motion.p>
                                )}

                                {submitError && <div className={styles.errorMessage}>{submitError}</div>}

                                <motion.div variants={slowItemVariants}>
                                    <motion.button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={isSubmitting}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {isSubmitting ? (
                                            <span className={styles.submittingWrap}>
                                                <span className={styles.spinner} /> Sending Response…
                                            </span>
                                        ) : (
                                            <>
                                                <Sparkles size={18} /> Confirm My Attendance
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.section>

                        <motion.div
                            className={styles.ornamentDivider}
                            initial={{ opacity: 0, scale: 0.88, filter: 'blur(4px)' }}
                            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.ornamentLine} />
                            <span>✦ ❦ ✦</span>
                            <div className={styles.ornamentLine} />
                        </motion.div>

                        {/* 5. BRAND FOOTER & SIGNATURE */}
                        <motion.footer
                            className={styles.websiteFooter}
                            variants={slowContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-40px' }}
                        >
                            <motion.p variants={slowItemVariants} className={styles.footerThanks}>
                                We look forward to celebrating this unforgettable occasion with you!
                            </motion.p>

                            {/* Couple Names & Date Signature */}
                            <motion.div variants={slowItemVariants} className={styles.footerSignatureBlock}>
                                <h3 className={styles.footerSignatureNames}>
                                    {wedding.groomName} {wedding.brideName ? `& ${wedding.brideName}` : ''}
                                </h3>
                                {footerDateFormatted ? (
                                    <>
                                        <div className={styles.footerSignatureDivider} />
                                        <span className={styles.footerSignatureDate}>
                                            {footerDateFormatted}
                                        </span>
                                    </>
                                ) : null}
                            </motion.div>

                            <motion.div variants={slowItemVariants}>
                                <Link href="/" className={styles.poweredByCard}>
                                    crafted with love on
                                    <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                                </Link>
                            </motion.div>
                        </motion.footer>
            </motion.div>
        )}
    </AnimatePresence>
</div>
);
};
