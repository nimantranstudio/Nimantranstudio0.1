'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar, Check, Clock, Compass, Info, Leaf, MapPin, Phone, Send } from 'lucide-react';
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
import styles from './garden-of-love.module.css';

const CHROME_THEME: ChromeThemeVars = {
    bg: '#F6F5F0',
    surface: '#FCFBF8',
    ink: '#212D23',
    muted: '#566658',
    accent: '#2D4031',
    border: 'rgba(74, 97, 78, 0.36)',
    fontDisplay: "'Marcellus', Georgia, serif",
    fontSans: "'Manrope', sans-serif",
};

const DEFAULT_GARDEN_GALLERY: GallerySlide[] = [
    {
        src: '/website-templates/garden-of-love/garden-hero.webp',
        alt: 'Sunlit European glass conservatory at the end of a limestone garden walkway bordered by blush roses and olive trees',
        caption: 'The Secret Garden — Sunlit conservatory & blooming rose walk',
    },
    {
        src: '/website-templates/garden-of-love/garden-dinner.webp',
        alt: 'Intimate outdoor wedding dinner beneath ancient olive trees hung with warm fairy lights',
        caption: 'Al-Fresco Courtyard — Candlelit celebration beneath the olive grove',
    },
];

function OliveBranchCorner({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M12 148 C42 108, 86 62, 148 16"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
            />
            <path
                d="M46 112 C28 106, 24 88, 40 80 C52 84, 54 100, 46 112 Z"
                fill="currentColor"
                fillOpacity="0.18"
                stroke="currentColor"
                strokeWidth="1.05"
            />
            <path
                d="M66 90 C84 94, 98 82, 92 68 C78 66, 68 76, 66 90 Z"
                fill="currentColor"
                fillOpacity="0.16"
                stroke="currentColor"
                strokeWidth="1.05"
            />
            <path
                d="M88 66 C74 56, 72 38, 88 32 C98 38, 98 54, 88 66 Z"
                fill="currentColor"
                fillOpacity="0.18"
                stroke="currentColor"
                strokeWidth="1.05"
            />
            <path
                d="M112 44 C128 46, 140 36, 134 24 C122 22, 114 32, 112 44 Z"
                fill="currentColor"
                fillOpacity="0.15"
                stroke="currentColor"
                strokeWidth="1.05"
            />
        </svg>
    );
}

function PlaqueBotanicalSprig() {
    return (
        <svg
            viewBox="0 0 120 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.plaqueSprig}
            aria-hidden="true"
        >
            <path d="M12 16 H46 M74 16 H108" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path
                d="M60 6 C54 12, 54 20, 60 26 C66 20, 66 12, 60 6 Z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="1.1"
            />
            <path
                d="M48 16 C52 11, 56 12, 58 16 C54 19, 50 19, 48 16 Z"
                stroke="currentColor"
                strokeWidth="1"
            />
            <path
                d="M72 16 C68 11, 64 12, 62 16 C66 19, 70 19, 72 16 Z"
                stroke="currentColor"
                strokeWidth="1"
            />
        </svg>
    );
}

/**
 * Design 3: The Garden of Love
 * Aesthetic: Exclusive European botanical conservatory & secret garden destination wedding.
 * Preserves 100% of WebsiteTemplateProps dynamic field bindings and RSVP API behavior.
 */
export default function GardenOfLove({ wedding, isPreview = false }: WebsiteTemplateProps) {
    const reduceMotion = useReducedMotion();
    const data = useWeddingTemplateData(wedding, isPreview);
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const gallerySlides: GallerySlide[] = useMemo(() => {
        if (data.customGalleryImages.length > 0) {
            return data.customGalleryImages.map((src, idx) => ({
                src,
                alt: `${data.coupleNames} garden celebration photo ${idx + 1}`,
            }));
        }
        return DEFAULT_GARDEN_GALLERY;
    }, [data.customGalleryImages, data.coupleNames]);

    const heroGardenSrc =
        data.customGalleryImages[0] || '/website-templates/garden-of-love/garden-hero.webp';

    const revealProps = reduceMotion
        ? {}
        : {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: '-60px' },
              transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
          };

    const defaultGardenMessage = `Surrounded by blooming gardens and the warmth of those we cherish most, our families invite you to celebrate the joyful union of ${data.groomName}${data.hasBride ? ` and ${data.brideName}` : ''}.`;

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
                        key="gol-cover"
                        className={styles.coverOverlay}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={
                            reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: -22, scale: 0.985, filter: 'blur(4px)' }
                        }
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className={styles.coverCard}>
                            <OliveBranchCorner className={styles.swayingBranchLeft} />
                            <OliveBranchCorner className={styles.swayingBranchRight} />

                            <div className={styles.wreathBox} aria-hidden="true">
                                <img
                                    src="/website-templates/garden-of-love/botanical-crest.webp"
                                    alt=""
                                    className={styles.wreathImg}
                                />
                                <div className={styles.wreathMonogram}>
                                    <span>{data.groomInitial}</span>
                                    {data.hasBride && (
                                        <>
                                            <span className={styles.wreathAmp}>&amp;</span>
                                            <span>{data.brideInitial}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className={styles.coverSubscript}>Together with their families</p>
                            <h1 className={styles.coverCoupleTitle}>{data.coupleNames}</h1>

                            <p className={styles.coverDatePlace}>
                                {[data.shortPrimaryDate, data.venueCity].filter(Boolean).join(' · ') ||
                                    'Invite you to celebrate their wedding'}
                            </p>

                            <button
                                type="button"
                                className={styles.gardenOpenBtn}
                                onClick={() => data.setIsCoverOpen(true)}
                            >
                                <span>Open Invitation</span>
                                <ArrowRight size={15} strokeWidth={1.75} />
                            </button>
                        </div>
                    </motion.section>
                ) : (
                    <motion.div
                        key="gol-main"
                        className={styles.mainContent}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Conservatory Sticky Navigation */}
                        <header className={styles.gardenNavHeader}>
                            <div className={styles.gardenNavInner}>
                                <span className={styles.gardenNavCrest}>
                                    <Leaf size={15} strokeWidth={1.75} />
                                    <span>
                                        {data.groomInitial}
                                        {data.hasBride ? ` · ${data.brideInitial}` : ''}
                                    </span>
                                </span>

                                <nav className={styles.gardenNavLinks} aria-label="Invitation navigation">
                                    {data.events.length > 0 && (
                                        <a href="#ceremonies-section" className={styles.gardenNavLink}>
                                            Timeline
                                        </a>
                                    )}
                                    <a
                                        href="#garden-gallery"
                                        className={clsx(styles.gardenNavLink, styles.hideOnSmallMobile)}
                                    >
                                        Gallery
                                    </a>
                                    <a
                                        href="#venue-section"
                                        className={clsx(styles.gardenNavLink, styles.hideOnSmallMobile)}
                                    >
                                        Garden
                                    </a>
                                    <a href="#rsvp-section" className={styles.gardenNavLink}>
                                        RSVP
                                    </a>
                                </nav>
                            </div>
                        </header>

                        {/* 1. PANORAMIC ARCHED CONSERVATORY HERO + OVERLAPPING STATIONERY PLAQUE */}
                        <section className={styles.heroGardenSection}>
                            <div className={styles.heroArchFrame}>
                                <div className={styles.heroArchInner}>
                                    <motion.img
                                        src={heroGardenSrc}
                                        alt={`${data.coupleNames} garden wedding`}
                                        className={styles.heroGardenImg}
                                        initial={reduceMotion ? undefined : { scale: 1.05 }}
                                        animate={reduceMotion ? undefined : { scale: 1 }}
                                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                            </div>

                            <motion.div
                                className={styles.heroStationeryPlaque}
                                initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
                                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <PlaqueBotanicalSprig />
                                <p className={styles.plaqueIntro}>
                                    With joyful hearts &amp; the blessings of our families
                                </p>

                                <div className={styles.plaqueCoupleHeading}>
                                    <h1 className={styles.plaquePersonName}>{data.groomName}</h1>
                                    {data.hasBride && (
                                        <>
                                            <div className={styles.plaqueFloralAmp} aria-hidden="true">
                                                <span className={styles.plaqueAmpLine} />
                                                <span>&amp;</span>
                                                <span className={styles.plaqueAmpLine} />
                                            </div>
                                            <h1 className={styles.plaquePersonName}>{data.brideName}</h1>
                                        </>
                                    )}
                                </div>

                                {(data.groomParentsFormatted || data.brideParentsFormatted) && (
                                    <div className={styles.plaqueParentsGrid}>
                                        {data.groomParentsFormatted && (
                                            <div className={styles.plaqueParentCol}>
                                                <span className={styles.plaqueParentRole}>Son of</span>
                                                <span className={styles.plaqueParentName}>
                                                    {data.groomParentsFormatted}
                                                </span>
                                            </div>
                                        )}
                                        {data.brideParentsFormatted && (
                                            <div className={styles.plaqueParentCol}>
                                                <span className={styles.plaqueParentRole}>Daughter of</span>
                                                <span className={styles.plaqueParentName}>
                                                    {data.brideParentsFormatted}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(data.formattedPrimaryDate || data.venueCity) && (
                                    <p className={styles.plaqueDateBanner}>
                                        {[data.formattedPrimaryDate, data.venueCity].filter(Boolean).join('  ·  ')}
                                    </p>
                                )}

                                <div className={styles.plaqueActions}>
                                    <a href="#rsvp-section" className={styles.sagePrimaryBtn}>
                                        <span>Confirm Attendance</span>
                                        <ArrowRight size={14} strokeWidth={1.75} />
                                    </a>
                                    {data.events.length > 0 && (
                                        <a href="#ceremonies-section" className={styles.linenSecondaryBtn}>
                                            <span>Celebration Timeline</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </section>

                        {/* 2. GARDEN NOTE & BOTANICAL MEDALLION COUNTDOWN */}
                        <motion.section className={styles.sageMistSection} {...revealProps}>
                            <OliveBranchCorner className={styles.swayingBranchLeft} />
                            <OliveBranchCorner className={styles.swayingBranchRight} />

                            <div className={styles.sageMistInner}>
                                <span className={styles.gardenKicker}>Love in Full Bloom</span>
                                <p className={styles.gardenStoryQuote}>
                                    &ldquo;{data.invitationMessage || defaultGardenMessage}&rdquo;
                                </p>

                                {data.timeLeft.hasTarget && !data.timeLeft.isPast ? (
                                    <div className={styles.medallionCountdownRow} aria-label="Countdown to wedding">
                                        <div className={styles.medallionToken}>
                                            <span className={styles.medallionNum}>
                                                {String(data.timeLeft.days).padStart(2, '0')}
                                            </span>
                                            <span className={styles.medallionLabel}>Days</span>
                                        </div>
                                        <div className={styles.medallionToken}>
                                            <span className={styles.medallionNum}>
                                                {String(data.timeLeft.hours).padStart(2, '0')}
                                            </span>
                                            <span className={styles.medallionLabel}>Hours</span>
                                        </div>
                                        <div className={styles.medallionToken}>
                                            <span className={styles.medallionNum}>
                                                {String(data.timeLeft.minutes).padStart(2, '0')}
                                            </span>
                                            <span className={styles.medallionLabel}>Minutes</span>
                                        </div>
                                        <div className={styles.medallionToken}>
                                            <span className={styles.medallionNum}>
                                                {String(data.timeLeft.seconds).padStart(2, '0')}
                                            </span>
                                            <span className={styles.medallionLabel}>Seconds</span>
                                        </div>
                                    </div>
                                ) : data.timeLeft.isPast ? (
                                    <p className={styles.bloomedBanner}>
                                        Celebrating our wedding day surrounded by love
                                    </p>
                                ) : null}
                            </div>
                        </motion.section>

                        {/* 3. CENTRAL ALTERNATING BOTANICAL VINE TIMELINE */}
                        {data.events.length > 0 && (
                            <section id="ceremonies-section" className={styles.timelineSection}>
                                <motion.div className={styles.centeredSectionHead} {...revealProps}>
                                    <span className={styles.gardenKicker}>The Celebrations</span>
                                    <h2 className={styles.sectionTitle}>Garden Wedding Timeline</h2>
                                    <p className={styles.sectionSubtitle}>
                                        Follow each cherished moment of our festivities from welcome to reception
                                    </p>
                                </motion.div>

                                <div className={styles.vineTimelineWrap}>
                                    {data.events.map((evt, idx) => {
                                        const isEven = idx % 2 === 0;
                                        const cardMarkup = (
                                            <article className={styles.gardenEventCard}>
                                                <span className={styles.eventDatePill}>{evt.shortDateLabel}</span>
                                                <h3 className={styles.gardenEventTitle}>{evt.displayTitle}</h3>
                                                {evt.description && (
                                                    <p className={styles.gardenEventDesc}>{evt.description}</p>
                                                )}

                                                <div className={styles.gardenEventDetails}>
                                                    <div className={styles.gardenDetailLine}>
                                                        <Calendar
                                                            size={15}
                                                            strokeWidth={1.75}
                                                            className={styles.gardenDetailIcon}
                                                        />
                                                        <span className={styles.gardenDetailText}>
                                                            {evt.formattedDate}
                                                        </span>
                                                    </div>

                                                    {evt.formattedTime && (
                                                        <div className={styles.gardenDetailLine}>
                                                            <Clock
                                                                size={15}
                                                                strokeWidth={1.75}
                                                                className={styles.gardenDetailIcon}
                                                            />
                                                            <span className={styles.gardenDetailText}>
                                                                {evt.formattedTime}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className={styles.gardenDetailLine}>
                                                        <MapPin
                                                            size={15}
                                                            strokeWidth={1.75}
                                                            className={styles.gardenDetailIcon}
                                                        />
                                                        <span className={styles.gardenDetailText}>
                                                            {evt.venueText}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.gardenEventBtns}>
                                                    {evt.hasVenueLocation && (
                                                        <button
                                                            type="button"
                                                            className={styles.gardenChipBtn}
                                                            onClick={() => openMapsForVenue(evt.mapLink, evt.venueText)}
                                                        >
                                                            <Compass size={13} strokeWidth={1.75} />
                                                            <span>Directions</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className={styles.gardenChipBtn}
                                                        onClick={() => data.openEventCalendar(evt)}
                                                    >
                                                        <Calendar size={13} strokeWidth={1.75} />
                                                        <span>Save Date</span>
                                                    </button>
                                                </div>
                                            </article>
                                        );

                                        return (
                                            <motion.div
                                                key={evt.id || idx}
                                                className={styles.vineRow}
                                                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                                                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: '-40px' }}
                                                transition={{
                                                    duration: 0.52,
                                                    delay: Math.min(idx * 0.07, 0.28),
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                            >
                                                {isEven ? (
                                                    <>
                                                        <div className={styles.vineCardLeft}>{cardMarkup}</div>
                                                        <div className={styles.vineNodeCol} aria-hidden="true">
                                                            <span className={styles.vineLeafBadge}>
                                                                <Leaf size={15} strokeWidth={1.75} />
                                                            </span>
                                                        </div>
                                                        <div className={styles.vineSpacerRight} aria-hidden="true" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className={styles.vineSpacerLeft} aria-hidden="true" />
                                                        <div className={styles.vineNodeCol} aria-hidden="true">
                                                            <span className={styles.vineLeafBadge}>
                                                                <Leaf size={15} strokeWidth={1.75} />
                                                            </span>
                                                        </div>
                                                        <div className={styles.vineCardRight}>{cardMarkup}</div>
                                                    </>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* 4. MOMENTS IN BLOOM ARCHED GALLERY & CONSERVATORY VENUE */}
                        <section id="garden-gallery" className={styles.conservatorySection}>
                            <div className={styles.conservatoryContainer}>
                                <motion.div className={styles.centeredSectionHead} {...revealProps}>
                                    <span className={styles.gardenKicker}>The Setting</span>
                                    <h2 className={styles.sectionTitle}>Moments in the Conservatory</h2>
                                    <p className={styles.sectionSubtitle}>
                                        A glimpse of the gardens and sunlit spaces awaiting your arrival
                                    </p>
                                </motion.div>

                                <div className={styles.archedGalleryGrid}>
                                    {gallerySlides.slice(0, 2).map((slide, idx) => (
                                        <motion.button
                                            key={slide.src + idx}
                                            type="button"
                                            className={styles.archedGalleryBtn}
                                            onClick={() => setLightboxIdx(idx)}
                                            aria-label={`View full image: ${slide.alt}`}
                                            {...revealProps}
                                        >
                                            <div className={styles.archedGalleryInner}>
                                                <img
                                                    src={slide.src}
                                                    alt={slide.alt}
                                                    loading="lazy"
                                                    className={styles.archedGalleryImg}
                                                />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {(data.hasVenue || data.rsvpContact || data.formattedPrimaryDate) && (
                                    <motion.div id="venue-section" className={styles.conservatoryVenueCard} {...revealProps}>
                                        <div>
                                            <span className={styles.gardenKicker}>Venue &amp; Location</span>
                                            <h3 className={styles.venueCardTitle}>
                                                {data.venueCity ? `The Gardens — ${data.venueCity}` : 'Celebration Grounds'}
                                            </h3>
                                            <p className={styles.venueCardAddress}>
                                                {data.hasVenue
                                                    ? data.venueLocation
                                                    : 'Venue location details will be shared shortly.'}
                                            </p>
                                            {data.rsvpContact && (
                                                <p className={styles.venueCardPhone}>
                                                    Guest Concierge:{' '}
                                                    <a
                                                        href={`tel:${data.rsvpContact.replace(/\s+/g, '')}`}
                                                        className={styles.venueCardPhoneLink}
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

                                        <div className={styles.venueCardActions}>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.sagePrimaryBtn}
                                                    onClick={() =>
                                                        window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')
                                                    }
                                                >
                                                    <MapPin size={14} strokeWidth={1.75} />
                                                    <span>View on Map</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className={styles.linenSecondaryBtn}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={14} strokeWidth={1.75} />
                                                <span>Add to Calendar</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </section>

                        {/* 5. SAGE-DRENCHED GARDEN PAVILION RSVP */}
                        <section id="rsvp-section" className={styles.gardenRsvpSection}>
                            <motion.div className={styles.gardenRsvpCard} {...revealProps}>
                                <div className={styles.rsvpHeaderCenter}>
                                    <img
                                        src="/website-templates/garden-of-love/botanical-crest.webp"
                                        alt=""
                                        aria-hidden="true"
                                        className={styles.rsvpCrestThumb}
                                    />
                                    <span className={styles.gardenKicker}>Join Us in the Garden</span>
                                    <h2 className={styles.sectionTitle}>Kindly RSVP</h2>
                                    <p className={styles.sectionSubtitle}>
                                        Please let our families know if we will have the joy of welcoming you
                                    </p>
                                </div>

                                {data.step === 'ALREADY_REGISTERED' ? (
                                    <div className={styles.gardenConfirmation}>
                                        <div className={styles.gardenConfirmCircle}>
                                            <Info size={28} strokeWidth={1.75} />
                                        </div>
                                        <h3 className={styles.gardenConfirmTitle}>Response Already Saved</h3>
                                        <p className={styles.gardenConfirmCopy}>
                                            Thank you — your RSVP for {data.coupleNames}&apos;s wedding has already been recorded. We cannot wait to celebrate with you!
                                        </p>
                                        <div className={styles.gardenConfirmActions}>
                                            <button
                                                type="button"
                                                className={styles.linenSecondaryBtn}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={14} strokeWidth={1.75} />
                                                <span>Add to Calendar</span>
                                            </button>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.sagePrimaryBtn}
                                                    onClick={() =>
                                                        window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')
                                                    }
                                                >
                                                    <MapPin size={14} strokeWidth={1.75} />
                                                    <span>Get Directions</span>
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.gardenTextReset}
                                            onClick={data.handleResetAndInvite}
                                        >
                                            Update response or submit for another guest
                                        </button>
                                    </div>
                                ) : data.step === 'SUCCESS' ? (
                                    <div className={styles.gardenConfirmation}>
                                        <div className={styles.gardenConfirmCircle}>
                                            <Check size={30} strokeWidth={2} />
                                        </div>
                                        <h3 className={styles.gardenConfirmTitle}>
                                            Thank You, {data.guestName}!
                                        </h3>
                                        <p className={styles.gardenConfirmCopy}>
                                            {data.status === 'declined'
                                                ? 'Your warm blessings mean so much to us. Thank you for letting our families know.'
                                                : data.status === 'maybe'
                                                ? 'Thank you for letting us know — we dearly hope to welcome you to the garden!'
                                                : `Your attendance is confirmed${data.formattedPrimaryDate ? ` for ${data.formattedPrimaryDate}` : ''}. We look forward to celebrating under the blooms with you!`}
                                        </p>
                                        <div className={styles.gardenConfirmActions}>
                                            <button
                                                type="button"
                                                className={styles.linenSecondaryBtn}
                                                onClick={data.openPrimaryCalendar}
                                            >
                                                <Calendar size={14} strokeWidth={1.75} />
                                                <span>Add to Calendar</span>
                                            </button>
                                            {data.googleMapsLink && (
                                                <button
                                                    type="button"
                                                    className={styles.sagePrimaryBtn}
                                                    onClick={() =>
                                                        window.open(data.googleMapsLink!, '_blank', 'noopener,noreferrer')
                                                    }
                                                >
                                                    <MapPin size={14} strokeWidth={1.75} />
                                                    <span>Get Directions</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <form id="rsvp-form" className={styles.rsvpForm} onSubmit={data.handleSubmit} noValidate>
                                        <div className={styles.fieldWrap}>
                                            <span className={styles.fieldLabel}>Will you be joining us?</span>
                                            <div className={styles.attendancePills} role="radiogroup" aria-label="Attendance">
                                                {(
                                                    [
                                                        { id: 'attending', label: 'Joyfully Attending' },
                                                        { id: 'maybe', label: 'Will Try to Join' },
                                                        { id: 'declined', label: 'Sending Wishes' },
                                                    ] as const
                                                ).map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={data.status === opt.id}
                                                        data-active={data.status === opt.id}
                                                        className={styles.attendancePillBtn}
                                                        onClick={() => data.setStatus(opt.id)}
                                                    >
                                                        {data.status === opt.id && (
                                                            <motion.span
                                                                layoutId="gol-pill-fill"
                                                                className={styles.attendanceActiveFill}
                                                                transition={{ type: 'spring', bounce: 0.12, duration: 0.34 }}
                                                            />
                                                        )}
                                                        <span className={styles.attendancePillText}>{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.fieldWrap}>
                                            <div className={styles.fieldLabelLine}>
                                                <label htmlFor="rsvp-guest-name" className={styles.fieldLabel}>
                                                    Your Name
                                                </label>
                                                {data.nameError && (
                                                    <span className={styles.fieldError}>Please enter your name</span>
                                                )}
                                            </div>
                                            <input
                                                id="rsvp-guest-name"
                                                type="text"
                                                placeholder="Full name or family name"
                                                className={clsx(
                                                    styles.gardenInput,
                                                    data.nameError && styles.gardenInputError
                                                )}
                                                value={data.guestName}
                                                onChange={(e) => {
                                                    data.setGuestName(e.target.value);
                                                    if (e.target.value.trim()) data.setNameError(false);
                                                }}
                                            />
                                        </div>

                                        <div className={styles.twoColumnRow}>
                                            <div className={styles.fieldWrap}>
                                                <span className={styles.fieldLabel}>Number of Guests</span>
                                                <div className={styles.gardenStepper}>
                                                    <button
                                                        type="button"
                                                        className={styles.gardenStepperBtn}
                                                        onClick={data.decrementGuests}
                                                        disabled={data.adultCount <= 1}
                                                        aria-label="Decrease guests"
                                                    >
                                                        −
                                                    </button>
                                                    <span className={styles.gardenStepperCount}>{data.adultCount}</span>
                                                    <button
                                                        type="button"
                                                        className={styles.gardenStepperBtn}
                                                        onClick={data.incrementGuests}
                                                        disabled={data.adultCount >= 10}
                                                        aria-label="Increase guests"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.fieldWrap}>
                                                <label htmlFor="gol-rsvp-phone" className={styles.fieldLabel}>
                                                    Phone Number
                                                </label>
                                                <input
                                                    id="gol-rsvp-phone"
                                                    type="tel"
                                                    placeholder="e.g. 98765 43210"
                                                    className={styles.gardenInput}
                                                    value={data.phone}
                                                    onChange={(e) => data.setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.fieldWrap}>
                                            <label htmlFor="gol-rsvp-wishes" className={styles.fieldLabel}>
                                                Wishes for the Couple (Optional)
                                            </label>
                                            <textarea
                                                id="gol-rsvp-wishes"
                                                placeholder="Share your warm wishes or note..."
                                                className={styles.gardenTextarea}
                                                value={data.message}
                                                onChange={(e) => data.setMessage(e.target.value)}
                                            />
                                        </div>

                                        {data.formattedRsvpDeadline && (
                                            <p className={styles.deadlineNotice}>
                                                Kindly respond by <strong>{data.formattedRsvpDeadline}</strong>
                                            </p>
                                        )}

                                        {data.submitError && (
                                            <div className={styles.submitErrorBanner}>{data.submitError}</div>
                                        )}

                                        <button
                                            type="submit"
                                            className={styles.gardenSubmitBtn}
                                            disabled={data.isSubmitting}
                                        >
                                            <Send size={15} strokeWidth={1.75} />
                                            <span>{data.isSubmitting ? 'Saving RSVP…' : 'Confirm Attendance'}</span>
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </section>

                        {/* 6. BOTANICAL GARDEN FOOTER */}
                        <footer className={styles.footer}>
                            <div className={styles.footerMonogram}>
                                {data.groomInitial}
                                {data.hasBride ? ` ❀ ${data.brideInitial}` : ''}
                            </div>
                            <p className={styles.footerBlessing}>
                                &ldquo;Where love is planted, joy blooms in every season.&rdquo;
                            </p>
                            <p className={styles.footerNames}>With love, {data.coupleNames}</p>

                            <Link href="/" className={styles.studioBadge}>
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

