'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Calendar, Check, Info, MapPin, Phone, Plus, Send } from 'lucide-react';
import { FlowerPetalDrift } from '@/components/ui/FlowerPetalDrift';
import type { WebsiteTemplateProps } from '../types';
import { WebsiteTemplateFonts } from '../shared/fonts';
import { openMapsForVenue, useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import {
    TemplateAudioToggle,
    TemplateCalendarModal,
    TemplateLightbox,
    type ChromeThemeVars,
    type GallerySlide,
} from '../shared/TemplateChrome';
import styles from './modern-romance.module.css';

const CHROME_THEME: ChromeThemeVars = {
    bg: '#FAF8F6',
    surface: '#FFFFFF',
    ink: '#231D1E',
    muted: '#6E5D5F',
    accent: '#8C5A52',
    border: 'rgba(168, 116, 107, 0.36)',
    fontDisplay: "'Bodoni Moda', Georgia, serif",
    fontSans: "'Manrope', sans-serif",
};

const DEFAULT_EDITORIAL_GALLERY: GallerySlide[] = [
    {
        src: '/website-templates/modern-romance/editorial-still.webp',
        alt: 'Champagne silk ribbon and blush garden roses arranged on warm alabaster stone',
        caption: 'Atelier Still Life — Blush ranunculus & raw champagne silk',
    },
    {
        src: '/website-templates/modern-romance/editorial-table.webp',
        alt: 'Long candlelit travertine wedding reception table dressed in ivory linen and blush roses',
        caption: 'The Evening Table — Candlelit travertine & crystal stemware',
    },
    {
        src: '/website-templates/modern-romance/editorial-hero.webp',
        alt: 'Sun-drenched European villa terrace overlooking tranquil waters framed by white and blush roses',
        caption: 'Destination Terrace — Golden hour floral installation',
    },
];

function BotanicalLineSprig({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M18 128 C38 96, 56 64, 96 14"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
            <path
                d="M44 92 C28 86, 22 72, 34 62 C46 58, 52 74, 44 92 Z"
                stroke="currentColor"
                strokeWidth="1"
            />
            <path
                d="M58 72 C74 74, 84 62, 78 50 C68 46, 58 58, 58 72 Z"
                stroke="currentColor"
                strokeWidth="1"
            />
            <path
                d="M72 46 C58 38, 56 24, 68 18 C78 18, 80 32, 72 46 Z"
                stroke="currentColor"
                strokeWidth="1"
            />
            <circle cx="98" cy="13" r="3" stroke="currentColor" strokeWidth="1" />
        </svg>
    );
}

/**
 * Design 2: The Modern Romance
 * Aesthetic: Minimalist international destination wedding & couture editorial spread.
 * Preserves 100% of WebsiteTemplateProps dynamic field bindings and RSVP API behavior.
 */
export default function ModernRomance({ wedding, isPreview = false }: WebsiteTemplateProps) {
    const reduceMotion = useReducedMotion();
    const data = useWeddingTemplateData(wedding, isPreview);
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const gallerySlides: GallerySlide[] = useMemo(() => {
        if (data.customGalleryImages.length > 0) {
            return data.customGalleryImages.map((src, idx) => ({
                src,
                alt: `${data.coupleNames} celebration frame ${idx + 1}`,
            }));
        }
        return DEFAULT_EDITORIAL_GALLERY;
    }, [data.customGalleryImages, data.coupleNames]);

    const heroPortraitSrc =
        data.customGalleryImages[0] || '/website-templates/modern-romance/editorial-hero.webp';

    const revealProps = reduceMotion
        ? {}
        : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: '-60px' },
              transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
          };

    const defaultEditorialNote = `Together with our families, we invite you to share in an intimate celebration of love, laughter, and new beginnings as ${data.groomName}${data.hasBride ? ` and ${data.brideName}` : ''} unite in marriage.`;

    return (
        <div className={clsx(styles.root, isPreview && styles.previewRoot)}>
            <WebsiteTemplateFonts />

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
                        key="mr-cover"
                        className={styles.coverOverlay}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={
                            reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.985, filter: 'blur(5px)' }
                        }
                        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className={styles.coverSheet}>
                            <BotanicalLineSprig className={styles.floatingFloralTop} />
                            <BotanicalLineSprig className={styles.floatingFloralBottom} />

                            {data.numericPrimaryDate && (
                                <span className={styles.coverDateNumeric}>{data.numericPrimaryDate}</span>
                            )}

                            <div className={styles.coverMonogram} aria-hidden="true">
                                <span>{data.groomInitial}</span>
                                {data.hasBride && (
                                    <>
                                        <span className={styles.coverMonogramAmp}>&amp;</span>
                                        <span>{data.brideInitial}</span>
                                    </>
                                )}
                            </div>

                            <div className={styles.coverHairline} aria-hidden="true" />
                            <p className={styles.coverKicker}>The Wedding Celebration</p>
                            <h1 className={styles.coverCoupleNames}>{data.coupleNames}</h1>

                            <p className={styles.coverLocation}>
                                {[data.shortPrimaryDate, data.venueCity].filter(Boolean).join(' · ') ||
                                    'Request the pleasure of your company'}
                            </p>

                            <button
                                type="button"
                                className={styles.enterBtn}
                                onClick={() => data.setIsCoverOpen(true)}
                            >
                                <span>Enter Celebration</span>
                                <ArrowRight size={14} strokeWidth={1.75} />
                            </button>
                        </div>
                    </motion.section>
                ) : (
                    <motion.div
                        key="mr-main"
                        className={styles.mainContent}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Minimalist Editorial Masthead */}
                        <header className={styles.masthead}>
                            <div className={styles.mastheadInner}>
                                <span className={styles.mastheadBrand}>
                                    {data.groomInitial}
                                    {data.hasBride ? ` & ${data.brideInitial}` : ''}
                                </span>
                                <nav className={styles.mastheadNav} aria-label="Invitation sections">
                                    {data.events.length > 0 && (
                                        <a href="#ceremonies-section" className={styles.mastheadLink}>
                                            Itinerary
                                        </a>
                                    )}
                                    <a
                                        href="#editorial-gallery"
                                        className={clsx(styles.mastheadLink, styles.mastheadLinkHideMobile)}
                                    >
                                        Moments
                                    </a>
                                    <a
                                        href="#venue-section"
                                        className={clsx(styles.mastheadLink, styles.mastheadLinkHideMobile)}
                                    >
                                        Venue
                                    </a>
                                    <a href="#rsvp-section" className={styles.mastheadLink}>
                                        RSVP
                                    </a>
                                </nav>
                            </div>
                        </header>

                        {/* 1. ASYMMETRIC MAGAZINE COVER SPREAD HERO */}
                        <section className={styles.heroSpread}>
                            <div className={styles.heroEditorialCol}>
                                <div className={styles.issueMetaRow}>
                                    <span>Wedding Invitation</span>
                                    {data.numericPrimaryDate && (
                                        <>
                                            <span className={styles.issueRule} aria-hidden="true" />
                                            <span>{data.numericPrimaryDate}</span>
                                        </>
                                    )}
                                </div>

                                <h1 className={styles.coupleHeadline}>
                                    <span className={styles.editorialName}>{data.groomName}</span>
                                    {data.hasBride && (
                                        <>
                                            <span className={styles.editorialConjunction}>and</span>
                                            <span className={styles.editorialName}>{data.brideName}</span>
                                        </>
                                    )}
                                </h1>

                                {(data.groomParentsFormatted || data.brideParentsFormatted) && (
                                    <div className={styles.parentsEditorialRow}>
                                        {data.groomParentsFormatted && (
                                            <div className={styles.parentBlock}>
                                                <span className={styles.parentLabel}>Son of</span>
                                                <span className={styles.parentValue}>
                                                    {data.groomParentsFormatted}
                                                </span>
                                            </div>
                                        )}
                                        {data.brideParentsFormatted && (
                                            <div className={styles.parentBlock}>
                                                <span className={styles.parentLabel}>Daughter of</span>
                                                <span className={styles.parentValue}>
                                                    {data.brideParentsFormatted}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(data.formattedPrimaryDate || data.venueCity) && (
                                    <p className={styles.heroDateVenueLine}>
                                        {[data.formattedPrimaryDate, data.venueCity].filter(Boolean).join(' — ')}
                                    </p>
                                )}

                                <div className={styles.heroCtaGroup}>
                                    <a href="#rsvp-section" className={styles.solidPillBtn}>
                                        <span>RSVP Online</span>
                                        <ArrowRight size={14} strokeWidth={1.75} />
                                    </a>
                                    {data.events.length > 0 && (
                                        <a href="#ceremonies-section" className={styles.outlinePillBtn}>
                                            <span>View Schedule</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className={styles.heroPortraitCol}>
                                <div className={styles.portraitOffsetMat}>
                                    <div className={styles.portraitImgWrap}>
                                        <img
                                            src={heroPortraitSrc}
                                            alt={`${data.coupleNames} celebration`}
                                            className={styles.portraitImg}
                                        />
                                    </div>
                                    <div className={styles.portraitCaption}>
                                        <span>{data.coupleNames}</span>
                                        <span>{data.shortPrimaryDate || 'Celebration'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. EDITORIAL PULL-QUOTE & HAIRLINE COUNTDOWN */}
                        <motion.section className={styles.editorialQuoteBand} {...revealProps}>
                            <BotanicalLineSprig className={styles.floatingFloralTop} />
                            <div className={styles.editorialQuoteInner}>
                                <span className={styles.sectionEyebrow}>A Note From Our Families</span>
                                <p className={styles.pullQuoteText}>
                                    &ldquo;{data.invitationMessage || defaultEditorialNote}&rdquo;
                                </p>

                                {data.timeLeft.hasTarget && !data.timeLeft.isPast ? (
                                    <div className={styles.hairlineCountdown} aria-label="Countdown to celebration">
                                        <div className={styles.countdownCell}>
                                            <span className={styles.countdownNumber}>
                                                {String(data.timeLeft.days).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownLabel}>Days</span>
                                        </div>
                                        <div className={styles.countdownCell}>
                                            <span className={styles.countdownNumber}>
                                                {String(data.timeLeft.hours).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownLabel}>Hours</span>
                                        </div>
                                        <div className={styles.countdownCell}>
                                            <span className={styles.countdownNumber}>
                                                {String(data.timeLeft.minutes).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownLabel}>Minutes</span>
                                        </div>
                                        <div className={styles.countdownCell}>
                                            <span className={styles.countdownNumber}>
                                                {String(data.timeLeft.seconds).padStart(2, '0')}
                                            </span>
                                            <span className={styles.countdownLabel}>Seconds</span>
                                        </div>
                                    </div>
                                ) : data.timeLeft.isPast ? (
                                    <p className={styles.celebratedNote}>
                                        Celebrating our new chapter together
                                    </p>
                                ) : null}
                            </div>
                        </motion.section>

                        {/* 3. SOPHISTICATED EVENT TIMELINE — HORIZONTAL EDITORIAL INDEX */}
                        {data.events.length > 0 && (
                            <section id="ceremonies-section" className={styles.itinerarySection}>
                                <motion.div className={styles.editorialHeaderRow} {...revealProps}>
                                    <div>
                                        <span className={styles.sectionEyebrow}>The Itinerary</span>
                                        <h2 className={styles.sectionHeading}>Order of Events</h2>
                                    </div>
                                    <p className={styles.sectionSubcopy}>
                                        Each gathering thoughtfully curated for our closest family and friends.
                                    </p>
                                </motion.div>

                                <div className={styles.editorialTable}>
                                    {data.events.map((evt, idx) => (
                                        <motion.article
                                            key={evt.id || idx}
                                            className={styles.scheduleRow}
                                            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                                            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-40px' }}
                                            transition={{
                                                duration: 0.5,
                                                delay: Math.min(idx * 0.06, 0.24),
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >
                                            <div className={styles.scheduleDateCol}>
                                                <span className={styles.scheduleBigDay}>{evt.dayNumber}</span>
                                                <div className={styles.scheduleDateMeta}>
                                                    <span className={styles.scheduleMonthYear}>
                                                        {evt.monthShort
                                                            ? `${evt.monthShort}${evt.weekday ? ` · ${evt.weekday}` : ''}`
                                                            : evt.shortDateLabel}
                                                    </span>
                                                    <span className={styles.scheduleTime}>
                                                        {evt.formattedTime || evt.formattedDate}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.scheduleTitleCol}>
                                                <h3 className={styles.scheduleEventTitle}>{evt.displayTitle}</h3>
                                                {evt.description ? (
                                                    <p className={styles.scheduleEventDesc}>{evt.description}</p>
                                                ) : (
                                                    <p className={styles.scheduleEventDesc}>{evt.formattedDate}</p>
                                                )}
                                            </div>

                                            <div className={styles.scheduleVenueCol}>
                                                <p className={styles.scheduleVenueName}>{evt.venueText}</p>
                                                <div className={styles.scheduleActionRow}>
                                                    {evt.hasVenueLocation && (
                                                        <button
                                                            type="button"
                                                            className={styles.miniEditorialBtn}
                                                            onClick={() => openMapsForVenue(evt.mapLink, evt.venueText)}
                                                        >
                                                            <span>Map</span>
                                                            <ArrowUpRight size={13} strokeWidth={1.75} />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className={styles.miniEditorialBtn}
                                                        onClick={() => data.openEventCalendar(evt)}
                                                    >
                                                        <Plus size={13} strokeWidth={1.75} />
                                                        <span>Calendar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 4. EDITORIAL TRIPTYCH GALLERY & DESTINATION VENUE */}
                        <section id="editorial-gallery" className={styles.gallerySection}>
                            <div className={styles.galleryContainer}>
                                <motion.div className={styles.editorialHeaderRow} {...revealProps}>
                                    <div>
                                        <span className={styles.sectionEyebrow}>Visual Story</span>
                                        <h2 className={styles.sectionHeading}>Atmosphere &amp; Destination</h2>
                                    </div>
                                    <p className={styles.sectionSubcopy}>
                                        Select any photograph to view in full-screen gallery mode.
                                    </p>
                                </motion.div>

                                <div className={styles.triptychGrid}>
                                    {gallerySlides[0] && (
                                        <motion.button
                                            type="button"
                                            className={styles.galleryBtnFrame}
                                            onClick={() => setLightboxIdx(0)}
                                            aria-label={`Open gallery image: ${gallerySlides[0].alt}`}
                                            {...revealProps}
                                        >
                                            <div className={styles.triptychTallWrap}>
                                                <img
                                                    src={gallerySlides[0].src}
                                                    alt={gallerySlides[0].alt}
                                                    loading="lazy"
                                                    className={styles.galleryPhoto}
                                                />
                                            </div>
                                        </motion.button>
                                    )}

                                    <div className={styles.triptychRightStack}>
                                        {gallerySlides.slice(1, 3).map((slide, i) => (
                                            <motion.button
                                                key={slide.src + i}
                                                type="button"
                                                className={styles.galleryBtnFrame}
                                                onClick={() => setLightboxIdx(i + 1)}
                                                aria-label={`Open gallery image: ${slide.alt}`}
                                                {...revealProps}
                                            >
                                                <div className={styles.triptychWideWrap}>
                                                    <img
                                                        src={slide.src}
                                                        alt={slide.alt}
                                                        loading="lazy"
                                                        className={styles.galleryPhoto}
                                                    />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Destination & Concierge Card */}
                                {(data.hasVenue || data.rsvpContact || data.formattedPrimaryDate) && (
                                    <motion.div id="venue-section" className={styles.destinationCard} {...revealProps}>
                                        <div>
                                            <span className={styles.sectionEyebrow}>The Destination</span>
                                            <h3 className={styles.destinationTitle}>
                                                {data.venueCity || 'Celebration Venue'}
                                            </h3>
                                            <p className={styles.destinationAddress}>
                                                {data.hasVenue
                                                    ? data.venueLocation
                                                    : 'Detailed venue directions will be shared shortly.'}
                                            </p>
                                            {data.rsvpContact && (
                                                <p className={styles.destinationContact}>
                                                    Hospitality &amp; Guest Assistance:{' '}
                                                    <a
                                                        href={`tel:${data.rsvpContact.replace(/\s+/g, '')}`}
                                                        className={styles.destinationContactLink}
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

                                        <div className={styles.destinationActions}>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.solidPillBtn}
                                                    onClick={() =>
                                                        window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')
                                                    }
                                                >
                                                    <MapPin size={14} strokeWidth={1.75} />
                                                    <span>Directions</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className={styles.outlinePillBtn}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={14} strokeWidth={1.75} />
                                                <span>Save the Date</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </section>

                        {/* 5. MINIMALIST ATELIER RSVP */}
                        <section id="rsvp-section" className={styles.rsvpSection}>
                            <motion.div className={styles.rsvpSectionHeader} {...revealProps}>
                                <span className={styles.sectionEyebrow}>Répondez S&apos;il Vous Plaît</span>
                                <h2 className={styles.sectionHeading}>Kindly Respond</h2>
                            </motion.div>

                            <motion.div className={styles.rsvpAtelierBox} {...revealProps}>
                                {data.step === 'ALREADY_REGISTERED' ? (
                                    <div className={styles.confirmState}>
                                        <div className={styles.confirmIconRing}>
                                            <Info size={26} strokeWidth={1.6} />
                                        </div>
                                        <h3 className={styles.confirmTitle}>RSVP Received</h3>
                                        <p className={styles.confirmText}>
                                            We already have your response on file for {data.coupleNames}&apos;s celebration. We look forward to sharing this day with you.
                                        </p>
                                        <div className={styles.confirmBtnRow}>
                                            <button
                                                type="button"
                                                className={styles.outlinePillBtn}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={14} strokeWidth={1.75} />
                                                <span>Save Date</span>
                                            </button>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.solidPillBtn}
                                                    onClick={() =>
                                                        window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')
                                                    }
                                                >
                                                    <MapPin size={14} strokeWidth={1.75} />
                                                    <span>Open Maps</span>
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.resetLinkBtn}
                                            onClick={data.handleResetAndInvite}
                                        >
                                            Update response or submit for another guest
                                        </button>
                                    </div>
                                ) : data.step === 'SUCCESS' ? (
                                    <div className={styles.confirmState}>
                                        <div className={styles.confirmIconRing}>
                                            <Check size={28} strokeWidth={1.9} />
                                        </div>
                                        <h3 className={styles.confirmTitle}>Thank You, {data.guestName}</h3>
                                        <p className={styles.confirmText}>
                                            {data.status === 'declined'
                                                ? 'Thank you for letting us know. You will be missed and held close in our thoughts.'
                                                : data.status === 'maybe'
                                                ? 'Thank you for your note — we truly hope you will be able to join us.'
                                                : `Your RSVP is confirmed${data.formattedPrimaryDate ? ` for ${data.formattedPrimaryDate}` : ''}. We cannot wait to celebrate together.`}
                                        </p>
                                        <div className={styles.confirmBtnRow}>
                                            <button
                                                type="button"
                                                className={styles.outlinePillBtn}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={14} strokeWidth={1.75} />
                                                <span>Add to Calendar</span>
                                            </button>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.solidPillBtn}
                                                    onClick={() =>
                                                        window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')
                                                    }
                                                >
                                                    <MapPin size={14} strokeWidth={1.75} />
                                                    <span>View Venue Map</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <form id="rsvp-form" className={styles.rsvpForm} onSubmit={data.handleSubmit} noValidate>
                                        <div className={styles.fieldBlock}>
                                            <span className={styles.fieldLabel}>Attendance</span>
                                            <div className={styles.statusSegment} role="radiogroup" aria-label="Attendance">
                                                {(
                                                    [
                                                        { id: 'attending', label: 'Joyfully Attending' },
                                                        { id: 'maybe', label: 'Will Try to Join' },
                                                        { id: 'declined', label: 'Warm Wishes Only' },
                                                    ] as const
                                                ).map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={data.status === opt.id}
                                                        data-active={data.status === opt.id}
                                                        className={styles.statusOptionBtn}
                                                        onClick={() => data.setStatus(opt.id)}
                                                    >
                                                        {data.status === opt.id && (
                                                            <motion.span
                                                                layoutId="mr-status-bg"
                                                                className={styles.statusOptionActiveBg}
                                                                transition={{ type: 'spring', bounce: 0.1, duration: 0.32 }}
                                                            />
                                                        )}
                                                        <span className={styles.statusOptionText}>{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.fieldBlock}>
                                            <div className={styles.fieldTopRow}>
                                                <label htmlFor="rsvp-guest-name" className={styles.fieldLabel}>
                                                    Guest Name
                                                </label>
                                                {data.nameError && (
                                                    <span className={styles.fieldErrorTag}>Please enter your name</span>
                                                )}
                                            </div>
                                            <input
                                                id="rsvp-guest-name"
                                                type="text"
                                                placeholder="Full name or family name"
                                                className={clsx(
                                                    styles.underlineInput,
                                                    data.nameError && styles.underlineInputError
                                                )}
                                                value={data.guestName}
                                                onChange={(e) => {
                                                    data.setGuestName(e.target.value);
                                                    if (e.target.value.trim()) data.setNameError(false);
                                                }}
                                            />
                                        </div>

                                        <div className={styles.splitRow}>
                                            <div className={styles.fieldBlock}>
                                                <span className={styles.fieldLabel}>Number of Guests</span>
                                                <div className={styles.stepperRow}>
                                                    <button
                                                        type="button"
                                                        className={styles.stepperCircle}
                                                        onClick={data.decrementGuests}
                                                        disabled={data.adultCount <= 1}
                                                        aria-label="Decrease guests"
                                                    >
                                                        −
                                                    </button>
                                                    <span className={styles.stepperValue}>{data.adultCount}</span>
                                                    <button
                                                        type="button"
                                                        className={styles.stepperCircle}
                                                        onClick={data.incrementGuests}
                                                        disabled={data.adultCount >= 10}
                                                        aria-label="Increase guests"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.fieldBlock}>
                                                <label htmlFor="mr-rsvp-phone" className={styles.fieldLabel}>
                                                    Mobile Number
                                                </label>
                                                <input
                                                    id="mr-rsvp-phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    className={styles.underlineInput}
                                                    value={data.phone}
                                                    onChange={(e) => data.setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.fieldBlock}>
                                            <label htmlFor="mr-rsvp-note" className={styles.fieldLabel}>
                                                Personal Note (Optional)
                                            </label>
                                            <textarea
                                                id="mr-rsvp-note"
                                                placeholder="Leave a wish or note for the couple..."
                                                className={styles.underlineTextarea}
                                                value={data.message}
                                                onChange={(e) => data.setMessage(e.target.value)}
                                            />
                                        </div>

                                        {data.formattedRsvpDeadline && (
                                            <p className={styles.deadlineLine}>
                                                Please respond on or before <strong>{data.formattedRsvpDeadline}</strong>
                                            </p>
                                        )}

                                        {data.submitError && <div className={styles.errorBox}>{data.submitError}</div>}

                                        <button
                                            type="submit"
                                            className={styles.submitEditorialBtn}
                                            disabled={data.isSubmitting}
                                        >
                                            <Send size={14} strokeWidth={1.75} />
                                            <span>{data.isSubmitting ? 'Sending RSVP…' : 'Send Response'}</span>
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </section>

                        {/* 6. MINIMALIST FOOTER */}
                        <footer className={styles.footer}>
                            <div className={styles.footerInitials}>
                                {data.groomInitial}
                                {data.hasBride ? ` & ${data.brideInitial}` : ''}
                            </div>
                            <p className={styles.footerCaption}>
                                With love and gratitude — {data.coupleNames}
                            </p>
                            <Link href="/" className={styles.studioAttribution}>
                                <span>Designed with</span>
                                <img src="/logo.png" alt="Nimantran Studio" className={styles.studioLogo} />
                            </Link>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

