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
                        {/* 1. DETAILED ROYAL INVITATION HERO SECTION (Exact Match to Reference Screenshot) */}
                <header className={styles.heroDetailedSection}>
                    {/* Top-Left Botanical Corner Flourish */}
                    <div className={styles.cornerFlourishTL} aria-hidden="true">
                        <svg width="64" height="64" viewBox="0 0 60 60" fill="none">
                            <path d="M6 6 C20 6 48 18 54 54 C40 30 24 16 6 6 Z" stroke="rgba(197, 160, 89, 0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6 C16 18 24 34 28 46" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Top-Right Botanical Corner Flourish */}
                    <div className={styles.cornerFlourishTR} aria-hidden="true">
                        <svg width="64" height="64" viewBox="0 0 60 60" fill="none">
                            <path d="M54 6 C40 6 12 18 6 54 C20 30 36 16 54 6 Z" stroke="rgba(197, 160, 89, 0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M54 6 C44 18 36 34 32 46" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Divine Blessing Inscription */}
                    <div className={styles.heroBlessingText}>
                        <p>With the blessings of the divine</p>
                        <p>and the love of our families</p>
                    </div>

                    {/* Together We Invite Pre-header */}
                    <div className={styles.heroInviteTag}>
                        TOGETHER WE INVITE YOU TO CELEBRATE
                    </div>

                    {/* Vertical Royal Lineage & Couple Block */}
                    <div className={styles.heroVerticalCoupleBlock}>
                        {/* 1. Groom & Parental Lineage */}
                        <div className={styles.heroPersonBlock}>
                            <h1 className={styles.heroPersonName}>{wedding.groomName}</h1>
                            {wedding.groomParents && (
                                <div className={styles.heroPersonLineage}>
                                    <span className={styles.heroPersonRole}>Son of</span>
                                    <span className={styles.heroPersonParents}>{groomParentsFormatted}</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Central Elegant Ampersand Divider */}
                        <div className={styles.heroVerticalAmpersandWrap}>
                            <span className={styles.heroAmpersand}>&amp;</span>
                        </div>

                        {/* 3. Bride & Parental Lineage */}
                        <div className={styles.heroPersonBlock}>
                            <h1 className={styles.heroPersonName}>{wedding.brideName}</h1>
                            {wedding.brideParents && (
                                <div className={styles.heroPersonLineage}>
                                    <span className={styles.heroPersonRole}>Daughter of</span>
                                    <span className={styles.heroPersonParents}>{brideParentsFormatted}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Auspicious Occasions Note */}
                    <div className={styles.heroOccasionsText}>
                        On the following auspicious occasions
                    </div>

                    {/* Diamond Hairline Divider 2 (Placed below Auspicious Occasions) */}
                    <div className={styles.heroDiamondDivider}>
                        <span className={styles.diamondLine} />
                        <span className={styles.diamondSymbol}>◆</span>
                        <span className={styles.diamondLine} />
                    </div>
                </header>

                {/* 2. INTERACTIVE ROYAL SANCTUARY GATES & COUNTDOWN SECTION */}
                <RoyalSanctuaryDoors
                    targetDateStr={primaryDateStr}
                    targetTimeStr={primaryTimeStr}
                    venueLocation={venueLocation}
                />

                {/* Personal Invitation Message if provided */}
                {wedding.invitationMessage && wedding.invitationMessage.trim() && (
                    <div className={styles.quoteCard} style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
                        <p className={styles.quoteText}>
                            &ldquo;{wedding.invitationMessage}&rdquo;
                        </p>
                    </div>
                )}

                <div className={styles.ornamentDivider}>
                    <div className={styles.ornamentLine} />
                    <span>✦ ❦ ✦</span>
                    <div className={styles.ornamentLine} />
                </div>

                {/* 3. CELEBRATIONS & CEREMONY TIMELINE */}
                <section className={styles.eventsSection}>
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionSubHead}>THE CELEBRATIONS</span>
                        <h2 className={styles.sectionTitle}>Wedding Itinerary</h2>
                        <p className={styles.sectionSubtitle}>
                            Join us in each step of our sacred and joyous celebration
                        </p>
                    </div>

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
                </section>

                <div className={styles.ornamentDivider}>
                    <div className={styles.ornamentLine} />
                    <span>✦ ❦ ✦</span>
                    <div className={styles.ornamentLine} />
                </div>

                {/* 4. INTERACTIVE RSVP FORM */}
                <section id="rsvp-section" className={styles.rsvpSection}>
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionSubHead}>JOIN THE CELEBRATION</span>
                        <h2 className={styles.sectionTitle}>Confirm Your Presence</h2>
                        <p className={styles.sectionSubtitle}>
                            Please let us know if you can join our celebration
                        </p>
                    </div>

                    <form id="rsvp-form" className={styles.form} onSubmit={handleSubmit} noValidate>
                        {/* Attendance Segmented Tabs */}
                        <div className={styles.field}>
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
                        </div>

                        {/* Guest Name */}
                        <div className={styles.field}>
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
                        </div>

                        {/* Number of Guests & Phone */}
                        <div className={styles.row}>
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
                        </div>

                        {/* Warm Wishes */}
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>
                                <span>Send Your Blessings & Warm Wishes</span>
                            </label>
                            <textarea
                                placeholder="Write a heartfelt message for the couple…"
                                className={clsx(styles.input, styles.textarea)}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* RSVP Deadline */}
                        {wedding.rsvpDeadline && (
                            <p className={styles.deadlineNotice}>
                                Kindly confirm your attendance by{' '}
                                <strong>
                                    {new Date(wedding.rsvpDeadline).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </strong>
                            </p>
                        )}

                        {submitError && <div className={styles.errorMessage}>{submitError}</div>}

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
                    </form>
                </section>

                {/* 5. BRAND FOOTER & SIGNATURE */}
                <footer className={styles.websiteFooter}>
                    <div className={styles.footerSeal}>
                        <span>✦</span>
                    </div>
                    <p className={styles.footerThanks}>
                        We look forward to celebrating this unforgettable occasion with you!
                    </p>

                    {/* Couple Names & Date Signature */}
                    <div className={styles.footerSignatureBlock}>
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
                    </div>

                    <Link href="/" className={styles.poweredByCard}>
                        crafted with love on
                        <img src="/logo.png" alt="Nimantran Studio" className={styles.brandLogo} />
                    </Link>
                </footer>
            </motion.div>
        )}
    </AnimatePresence>
</div>
);
};
