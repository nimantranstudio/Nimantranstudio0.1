'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Check, Info, LockOpen, MapPin, Phone, RotateCcw, Send, Sparkles } from 'lucide-react';
import { FlowerPetalDrift } from '@/components/ui/FlowerPetalDrift';
import type { WebsiteTemplateProps } from '../types';
import { WebsiteTemplateFonts } from '../shared/fonts';
import { useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import {
    TemplateAudioToggle,
    TemplateCalendarModal,
    TemplateLightbox,
    type ChromeThemeVars,
    type GallerySlide,
} from '../shared/TemplateChrome';
import { InteractiveCeremonyGate, RoyalScratchDateFrame } from './RoyalInteractiveWidgets';
import styles from './royal-heritage.module.css';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const CHROME_THEME: ChromeThemeVars = {
    bg: '#FBF7F0',
    surface: '#FFFDF9',
    ink: '#2A1A16',
    muted: '#735B50',
    accent: '#5B1620',
    border: 'rgba(176, 137, 66, 0.42)',
    fontDisplay: "'Cinzel', Georgia, serif",
    fontSans: "'Jost', sans-serif",
};

const DEFAULT_GALLERY: GallerySlide[] = [
    {
        src: '/website-templates/royal-heritage/palace-hero.webp',
        alt: 'Sunlit Rajasthani sandstone palace archway adorned with white jasmine garlands and brass diyas',
        caption: 'The Royal Courtyard — Carved sandstone arches dressed in fresh mogra garlands',
    },
    {
        src: '/website-templates/royal-heritage/palace-reflect.webp',
        alt: 'Twilight heritage palace pavilion beside a tranquil candlelit reflecting pool',
        caption: 'Evening Pavilion — Floating brass diyas illuminating the palace waters at dusk',
    },
];

function CuspedArchCrest() {
    return (
        <svg
            viewBox="0 0 240 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.coverArchSvg}
            aria-hidden="true"
        >
            <path
                d="M8 38 H64 C78 38 86 24 98 20 C108 16 115 8 120 4 C125 8 132 16 142 20 C154 24 162 38 176 38 H232"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <circle cx="120" cy="18" r="3" fill="currentColor" />
            <circle cx="84" cy="32" r="2" fill="currentColor" opacity="0.65" />
            <circle cx="156" cy="32" r="2" fill="currentColor" opacity="0.65" />
        </svg>
    );
}

function RoyalHeroStage({
    data,
    heroSrc,
    reduceMotion,
}: {
    data: ReturnType<typeof useWeddingTemplateData>;
    heroSrc: string;
    reduceMotion: boolean | null;
}) {
    const heroTrackRef = useRef<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: heroTrackRef,
        offset: ['start start', 'end start'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 110,
        damping: 26,
        mass: 0.25,
    });

    const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.32, 1.48]);
    const contentOpacity = useTransform(smoothProgress, [0, 0.45, 0.72], [1, 0.96, 0]);
    const contentY = useTransform(smoothProgress, [0, 0.65], [0, -48]);

    return (
        <section ref={heroTrackRef} className={styles.heroZoomTrack}>
            <div className={styles.heroStickyViewport}>
                {/* Full-Screen Zooming Palace Backdrop */}
                <motion.div
                    className={styles.heroBgMedia}
                    style={reduceMotion ? undefined : { scale: imageScale }}
                >
                    <img
                        src={heroSrc}
                        alt={`${data.coupleNames} royal palace celebration`}
                        className={styles.heroFullscreenImg}
                    />
                </motion.div>

                {/* Calibrated Royal Vignette Scrim */}
                <div className={styles.heroVignette} aria-hidden="true" />

                {/* Floating Top Crest & Navigation */}
                <header className={styles.topBar}>
                    <span className={styles.monogramCrest}>
                        {data.groomInitial}
                        {data.hasBride ? ` · ${data.brideInitial}` : ''}
                    </span>
                    <nav className={styles.topNavLinks} aria-label="Invitation sections">
                        {data.events.length > 0 && (
                            <a href="#ceremonies-section" className={styles.topNavLink}>
                                Ceremonies
                            </a>
                        )}
                        <a href="#venue-section" className={styles.topNavLink}>
                            Palace &amp; Venue
                        </a>
                        <a href="#rsvp-section" className={styles.topNavLink}>
                            RSVP
                        </a>
                    </nav>
                </header>

                {/* Centered Royal Invitation Overlay */}
                <motion.div
                    className={styles.heroCenterStage}
                    style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
                >
                    <p className={styles.blessingVerse}>
                        With the blessings of the divine &amp; the warmth of our families
                    </p>

                    <div className={styles.coupleDisplay}>
                        <h1 className={styles.personDisplayName}>{data.groomName}</h1>
                        {data.hasBride && (
                            <>
                                <div className={styles.ampersandRow} aria-hidden="true">
                                    <span className={styles.ampersandRule} />
                                    <span className={styles.ampersandGlyph}>&amp;</span>
                                    <span className={styles.ampersandRule} />
                                </div>
                                <h1 className={styles.personDisplayName}>{data.brideName}</h1>
                            </>
                        )}
                    </div>

                    {(data.groomParentsFormatted || data.brideParentsFormatted) && (
                        <div className={styles.lineageGrid}>
                            {data.groomParentsFormatted && (
                                <div className={styles.lineageItem}>
                                    <span className={styles.lineageRelation}>Son of</span>
                                    <span className={styles.lineageParents}>
                                        {data.groomParentsFormatted}
                                    </span>
                                </div>
                            )}
                            {data.brideParentsFormatted && (
                                <div className={styles.lineageItem}>
                                    <span className={styles.lineageRelation}>Daughter of</span>
                                    <span className={styles.lineageParents}>
                                        {data.brideParentsFormatted}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {(data.formattedPrimaryDate || data.venueCity) && (
                        <RoyalScratchDateFrame
                            formattedDate={data.formattedPrimaryDate}
                            formattedTime={data.formattedPrimaryTime}
                            venueCity={data.venueCity}
                            onSaveDate={data.openPrimaryCalendar}
                            reduceMotion={reduceMotion}
                        />
                    )}

                    <div className={styles.heroActions}>
                        <a href="#rsvp-section" className={styles.heroPrimaryCta}>
                            Confirm Presence
                        </a>
                        {data.events.length > 0 && (
                            <a href="#ceremonies-section" className={styles.heroSecondaryCta}>
                                View Ceremonies
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Subtle Scroll-Zoom Cue */}
                <div className={styles.scrollCue} aria-hidden="true">
                    <span className={styles.scrollCueLabel}>Scroll to Enter</span>
                    <span className={styles.scrollCueLine} />
                </div>
            </div>
        </section>
    );
}

/**
 * Design 1: The Royal Heritage
 * Inspired by luxury Indian royal palace architecture (Udaipur / Jaipur sandstone & marble darbars).
 * Preserves 100% of WebsiteTemplateProps field bindings and RSVP API behavior.
 */
export default function RoyalHeritage({ wedding, isPreview = false }: WebsiteTemplateProps) {
    const reduceMotion = useReducedMotion();
    const data = useWeddingTemplateData(wedding, isPreview);
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const [openGates, setOpenGates] = useState<Record<string, boolean>>({});

    const toggleGate = (key: string) => {
        setOpenGates((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const allGatesOpen =
        data.events.length > 0 &&
        data.events.every((evt, idx) => Boolean(openGates[evt.id || String(idx)]));

    const handleToggleAllGates = () => {
        if (allGatesOpen) {
            setOpenGates({});
            return;
        }
        data.events.forEach((evt, idx) => {
            const key = evt.id || String(idx);
            setTimeout(() => {
                setOpenGates((prev) => ({ ...prev, [key]: true }));
            }, idx * 120);
        });
    };

    const gallerySlides: GallerySlide[] = useMemo(() => {
        if (data.customGalleryImages.length > 0) {
            return data.customGalleryImages.map((src, idx) => ({
                src,
                alt: `${data.coupleNames} wedding celebration moment ${idx + 1}`,
            }));
        }
        return DEFAULT_GALLERY;
    }, [data.customGalleryImages, data.coupleNames]);

    const revealProps = reduceMotion
        ? {}
        : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: '-60px' },
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
          };

    const defaultProclamation = `With the blessings of the Almighty and our elders, we joyfully invite you to grace the auspicious wedding celebrations of ${data.groomName}${data.hasBride ? ` and ${data.brideName}` : ''}.`;

    return (
        <div className={clsx(styles.root, isPreview && styles.previewRoot)}>
            <WebsiteTemplateFonts />
            <div className={styles.ambientBackdrop} aria-hidden="true" />

            <TemplateAudioToggle
                audioUrl={data.audioUrl}
                autoPlayTrigger={data.isCoverOpen}
                disabled={isPreview}
                theme={CHROME_THEME}
            />

            <TemplateCalendarModal
                eventData={data.activeCalendarEvent}
                onClose={data.closeCalendarModal}
                theme={CHROME_THEME}
            />

            <TemplateLightbox
                slides={gallerySlides}
                activeIndex={lightboxIdx}
                onClose={() => setLightboxIdx(null)}
                onSelectIndex={setLightboxIdx}
            />

            {data.step === 'SUCCESS' && !reduceMotion && <FlowerPetalDrift />}

            <AnimatePresence mode="wait">
                {!data.isCoverOpen ? (
                    <motion.section
                        key="rh-cover"
                        className={styles.coverOverlay}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={
                            reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: -28, scale: 0.985, filter: 'blur(4px)' }
                        }
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className={styles.coverOuterShell}>
                            <div className={styles.coverInnerFrame}>
                                <CuspedArchCrest />
                                <span className={styles.coverKicker}>Shubh Vivah · Royal Invitation</span>

                                <div className={styles.coverSealMedallion} aria-hidden="true">
                                    <div className={styles.coverSealInner}>
                                        <span>{data.groomInitial}</span>
                                        {data.hasBride && (
                                            <>
                                                <span className={styles.coverSealDiamond}>✦</span>
                                                <span>{data.brideInitial}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h1 className={styles.coverCoupleTitle}>{data.coupleNames}</h1>

                                {data.shortPrimaryDate && (
                                    <p className={styles.coverDateLine}>
                                        {data.shortPrimaryDate}
                                        {data.venueCity ? ` · ${data.venueCity}` : ''}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className={styles.unveilBtn}
                                    onClick={() => data.setIsCoverOpen(true)}
                                >
                                    <span>Unveil Invitation</span>
                                    <span className={styles.btnIconCircle} aria-hidden="true">
                                        <ArrowRight size={15} strokeWidth={1.75} />
                                    </span>
                                </button>

                                <p className={styles.coverFootnote}>
                                    Together with their families, request the honour of your presence
                                </p>
                            </div>
                        </div>
                    </motion.section>
                ) : (
                    <motion.div
                        key="rh-main"
                        className={styles.mainContent}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* 1. FULL-SCREEN SCROLL-ZOOM PALACE HERO */}
                        <RoyalHeroStage
                            data={data}
                            heroSrc={gallerySlides[0]?.src || '/website-templates/royal-heritage/palace-hero.webp'}
                            reduceMotion={reduceMotion}
                        />

                        {/* 2. DARBAR PROCLAMATION & CHISELED COUNTDOWN */}
                        <motion.section className={styles.darbarBand} {...revealProps}>
                            <div className={styles.darbarInner}>
                                <div className={styles.darbarOrnament} aria-hidden="true">
                                    <span className={styles.darbarOrnamentLine} />
                                    <span>❖</span>
                                    <span className={styles.darbarOrnamentLine} />
                                </div>

                                <p className={styles.darbarQuote}>
                                    &ldquo;{data.invitationMessage || defaultProclamation}&rdquo;
                                </p>

                                {data.timeLeft.hasTarget && !data.timeLeft.isPast ? (
                                    <div className={styles.countdownRow} aria-label="Countdown to wedding">
                                        <div className={styles.countdownPillar}>
                                            <span className={styles.countdownDigits}>
                                                {String(data.timeLeft.days).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownUnit}>Days</span>
                                        </div>
                                        <div className={styles.countdownPillar}>
                                            <span className={styles.countdownDigits}>
                                                {String(data.timeLeft.hours).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownUnit}>Hours</span>
                                        </div>
                                        <div className={styles.countdownPillar}>
                                            <span className={styles.countdownDigits}>
                                                {String(data.timeLeft.minutes).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownUnit}>Minutes</span>
                                        </div>
                                        <div className={styles.countdownPillar}>
                                            <span className={styles.countdownDigits}>
                                                {String(data.timeLeft.seconds).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownUnit}>Seconds</span>
                                        </div>
                                    </div>
                                ) : data.timeLeft.isPast ? (
                                    <p className={styles.celebratedBanner}>
                                        Celebrating the Auspicious Union Together
                                    </p>
                                ) : null}
                            </div>
                        </motion.section>

                        {/* 3. INTERACTIVE ROYAL PALACE DOUBLE-DOOR CEREMONIES */}
                        {data.events.length > 0 && (
                            <section id="ceremonies-section" className={styles.ceremoniesSection}>
                                <motion.div className={styles.sectionHeadingBlock} {...revealProps}>
                                    <div className={styles.ceremoniesCrownMotif} aria-hidden="true">
                                        <span className={styles.ceremoniesCrownLine} />
                                        <Sparkles size={15} strokeWidth={1.75} />
                                        <span className={styles.ceremoniesCrownLine} />
                                    </div>
                                    <h2 className={styles.sectionTitle}>The Royal Celebrations</h2>
                                    <p className={styles.sectionLead}>
                                        Tap each carved palace gate to swing open the doors &amp; unveil the ceremony details
                                    </p>

                                    <button
                                        type="button"
                                        className={styles.unveilAllGatesBtn}
                                        onClick={handleToggleAllGates}
                                    >
                                        {allGatesOpen ? (
                                            <>
                                                <RotateCcw size={14} strokeWidth={1.85} />
                                                <span>Close All Palace Gates</span>
                                            </>
                                        ) : (
                                            <>
                                                <LockOpen size={14} strokeWidth={1.85} />
                                                <span>Unveil All Palace Gates</span>
                                            </>
                                        )}
                                    </button>
                                </motion.div>

                                <div className={styles.pavilionGrid}>
                                    {data.events.map((evt, idx) => {
                                        const gateKey = evt.id || String(idx);
                                        return (
                                            <InteractiveCeremonyGate
                                                key={gateKey}
                                                evt={evt}
                                                index={idx}
                                                romanNumeral={ROMAN_NUMERALS[idx] || String(idx + 1)}
                                                isOpen={Boolean(openGates[gateKey])}
                                                onToggle={() => toggleGate(gateKey)}
                                                onSaveDate={data.openEventCalendar}
                                                reduceMotion={reduceMotion}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* 4. PALACE GALLERY & VENUE HOSPITALITY */}
                        <section id="venue-section" className={styles.heritageShowcaseSection}>
                            <div className={styles.showcaseContainer}>
                                <motion.div className={styles.sectionHeadingBlock} {...revealProps}>
                                    <h2 className={styles.sectionTitle}>The Setting &amp; Hospitality</h2>
                                    <p className={styles.sectionLead}>
                                        Where timeless heritage meets the joy of two families uniting
                                    </p>
                                </motion.div>

                                <div className={styles.galleryMosaic}>
                                    {gallerySlides.slice(0, 2).map((slide, idx) => (
                                        <motion.button
                                            key={slide.src + idx}
                                            type="button"
                                            className={styles.galleryFrameBtn}
                                            onClick={() => setLightboxIdx(idx)}
                                            aria-label={`View full image: ${slide.alt}`}
                                            {...revealProps}
                                        >
                                            <div className={styles.galleryImgWrap}>
                                                <img
                                                    src={slide.src}
                                                    alt={slide.alt}
                                                    loading="lazy"
                                                    className={styles.galleryImg}
                                                />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {(data.hasVenue || data.rsvpContact || data.formattedPrimaryDate) && (
                                    <motion.div className={styles.venueBanner} {...revealProps}>
                                        <div>
                                            <h3 className={styles.venueHeading}>Primary Celebration Venue</h3>
                                            <p className={styles.venueAddress}>
                                                {data.hasVenue ? data.venueLocation : 'Venue details will be shared shortly'}
                                            </p>
                                            {data.rsvpContact && (
                                                <p className={styles.conciergeLine}>
                                                    Family Hospitality Desk:{' '}
                                                    <a
                                                        href={`tel:${data.rsvpContact.replace(/\s+/g, '')}`}
                                                        className={styles.conciergeLink}
                                                    >
                                                        <Phone
                                                            size={13}
                                                            strokeWidth={1.75}
                                                            style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }}
                                                        />
                                                        {data.rsvpContact}
                                                    </a>
                                                </p>
                                            )}
                                        </div>

                                        <div className={styles.venueBannerActions}>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.primaryCta}
                                                    onClick={() => window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')}
                                                >
                                                    <MapPin size={15} strokeWidth={1.75} />
                                                    <span>Open Maps</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className={styles.secondaryCta}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={15} strokeWidth={1.75} />
                                                <span>Add to Calendar</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </section>

                        {/* 5. THE ROYAL GUEST REGISTER (RSVP) */}
                        <section id="rsvp-section" className={styles.rsvpSection}>
                            <motion.div className={styles.sectionHeadingBlock} {...revealProps}>
                                <h2 className={styles.sectionTitle}>Confirm Your Presence</h2>
                                <p className={styles.sectionLead}>
                                    Kindly share your attendance details so our families may welcome you warmly
                                </p>
                            </motion.div>

                            <motion.div className={styles.ledgerShell} {...revealProps}>
                                <div className={styles.ledgerInner}>
                                    {data.step === 'ALREADY_REGISTERED' ? (
                                        <div className={styles.confirmationBlock}>
                                            <div className={styles.confirmationBadge}>
                                                <Info size={32} strokeWidth={1.75} />
                                            </div>
                                            <h3 className={styles.confirmationTitle}>Response Already Recorded</h3>
                                            <p className={styles.confirmationBody}>
                                                You have already shared your RSVP for {data.coupleNames}&apos;s wedding celebration. Our families look forward to welcoming you!
                                            </p>
                                            <div className={styles.confirmationActions}>
                                                <button
                                                    type="button"
                                                    className={styles.secondaryCta}
                                                    onClick={data.openPrimaryCalendar}
                                                >
                                                    <Calendar size={15} strokeWidth={1.75} />
                                                    <span>Add to Calendar</span>
                                                </button>
                                                {data.googleMapsLink && (
                                                    <button
                                                        type="button"
                                                        className={styles.primaryCta}
                                                        onClick={() => window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        <MapPin size={15} strokeWidth={1.75} />
                                                        <span>Get Directions</span>
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={data.handleResetAndInvite}
                                                className={styles.textActionLink}
                                            >
                                                Submit another response or update RSVP
                                            </button>
                                        </div>
                                    ) : data.step === 'SUCCESS' ? (
                                        <div className={styles.confirmationBlock}>
                                            <div className={styles.confirmationBadge}>
                                                <Check size={34} strokeWidth={2.2} />
                                            </div>
                                            <h3 className={styles.confirmationTitle}>
                                                Thank You, {data.guestName}!
                                            </h3>
                                            <p className={styles.confirmationBody}>
                                                {data.status === 'declined'
                                                    ? 'Your warm blessings and wishes mean the world to our families.'
                                                    : data.status === 'maybe'
                                                    ? 'Thank you for letting us know. We dearly hope to celebrate together with you!'
                                                    : `Your attendance has been recorded${data.formattedPrimaryDate ? ` for ${data.formattedPrimaryDate}` : ''}. We cannot wait to celebrate with you!`}
                                            </p>
                                            <div className={styles.confirmationActions}>
                                                <button
                                                    type="button"
                                                    className={styles.secondaryCta}
                                                    onClick={data.openPrimaryCalendar}
                                                >
                                                    <Calendar size={15} strokeWidth={1.75} />
                                                    <span>Add to Calendar</span>
                                                </button>
                                                {data.googleMapsLink && (
                                                    <button
                                                        type="button"
                                                        className={styles.primaryCta}
                                                        onClick={() => window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        <MapPin size={15} strokeWidth={1.75} />
                                                        <span>Get Directions</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <form id="rsvp-form" className={styles.rsvpForm} onSubmit={data.handleSubmit} noValidate>
                                            <div className={styles.fieldGroup}>
                                                <div className={styles.fieldLabelRow}>
                                                    <span className={styles.fieldLabel}>Will you be attending?</span>
                                                </div>
                                                <div className={styles.attendanceTabs} role="radiogroup" aria-label="Attendance">
                                                    {(
                                                        [
                                                            { id: 'attending', label: 'Joyfully Attending' },
                                                            { id: 'maybe', label: 'Will Try to Join' },
                                                            { id: 'declined', label: 'Sending Blessings' },
                                                        ] as const
                                                    ).map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={data.status === opt.id}
                                                            data-active={data.status === opt.id}
                                                            className={styles.attendanceTab}
                                                            onClick={() => data.setStatus(opt.id)}
                                                        >
                                                            {data.status === opt.id && (
                                                                <motion.span
                                                                    layoutId="rh-rsvp-pill"
                                                                    className={styles.attendancePillBg}
                                                                    transition={{ type: 'spring', bounce: 0.12, duration: 0.35 }}
                                                                />
                                                            )}
                                                            <span className={styles.attendanceTabLabel}>{opt.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.fieldGroup}>
                                                <div className={styles.fieldLabelRow}>
                                                    <label htmlFor="rsvp-guest-name" className={styles.fieldLabel}>
                                                        Your Full Name
                                                    </label>
                                                    {data.nameError && (
                                                        <span className={styles.errorInline}>Please enter your name</span>
                                                    )}
                                                </div>
                                                <input
                                                    id="rsvp-guest-name"
                                                    type="text"
                                                    placeholder="e.g. Rajeshwar Singh / The Sharma Family"
                                                    className={clsx(styles.inputField, data.nameError && styles.inputFieldError)}
                                                    value={data.guestName}
                                                    onChange={(e) => {
                                                        data.setGuestName(e.target.value);
                                                        if (e.target.value.trim()) data.setNameError(false);
                                                    }}
                                                />
                                            </div>

                                            <div className={styles.twoColFields}>
                                                <div className={styles.fieldGroup}>
                                                    <span className={styles.fieldLabel}>Total Guests</span>
                                                    <div className={styles.stepperBox}>
                                                        <button
                                                            type="button"
                                                            className={styles.stepperBtn}
                                                            onClick={data.decrementGuests}
                                                            disabled={data.adultCount <= 1}
                                                            aria-label="Decrease guest count"
                                                        >
                                                            −
                                                        </button>
                                                        <span className={styles.stepperCount}>{data.adultCount}</span>
                                                        <button
                                                            type="button"
                                                            className={styles.stepperBtn}
                                                            onClick={data.incrementGuests}
                                                            disabled={data.adultCount >= 10}
                                                            aria-label="Increase guest count"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className={styles.fieldGroup}>
                                                    <label htmlFor="rh-rsvp-phone" className={styles.fieldLabel}>
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        id="rh-rsvp-phone"
                                                        type="tel"
                                                        placeholder="e.g. 98765 43210"
                                                        className={styles.inputField}
                                                        value={data.phone}
                                                        onChange={(e) => data.setPhone(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.fieldGroup}>
                                                <label htmlFor="rh-rsvp-message" className={styles.fieldLabel}>
                                                    Wishes for the Couple (Optional)
                                                </label>
                                                <textarea
                                                    id="rh-rsvp-message"
                                                    placeholder="Share your blessings or a personal note..."
                                                    className={styles.textareaField}
                                                    value={data.message}
                                                    onChange={(e) => data.setMessage(e.target.value)}
                                                />
                                            </div>

                                            {data.formattedRsvpDeadline && (
                                                <p className={styles.deadlineNote}>
                                                    Kindly confirm your presence by <strong>{data.formattedRsvpDeadline}</strong>
                                                </p>
                                            )}

                                            {data.submitError && <div className={styles.errorAlert}>{data.submitError}</div>}

                                            <button type="submit" className={styles.submitBtn} disabled={data.isSubmitting}>
                                                <Send size={16} strokeWidth={1.75} />
                                                <span>
                                                    {data.isSubmitting ? 'Recording Response…' : 'Confirm My Presence'}
                                                </span>
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </section>

                        {/* 6. CLOSING ROYAL FOOTER */}
                        <footer className={styles.footer}>
                            <div className={styles.footerMonogram}>
                                {data.groomInitial}
                                {data.hasBride ? ` ✦ ${data.brideInitial}` : ''}
                            </div>
                            <p className={styles.footerNote}>
                                Your gracious presence and heartfelt blessings are the greatest gift as we begin our new journey together.
                            </p>
                            <p className={styles.footerSignoff}>With warm regards, {data.coupleNames}</p>

                            <Link href="/" className={styles.studioCredit}>
                                <span>crafted with love on</span>
                                <img src="/logo.png" alt="Nimantran Studio" className={styles.studioLogo} />
                            </Link>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

