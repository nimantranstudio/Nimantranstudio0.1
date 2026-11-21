'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { WebsiteTemplateProps } from '../types';
import { useWeddingTemplateData } from '../shared/useWeddingTemplateData';
import './midnight-velour.css';

const ASSET_BASE = '/website-templates/midnight-velour/assets';

const DRINK_OPTIONS = [
    'Champagne',
    'White wine',
    'Red wine',
    'Vodka',
    'Whiskey',
    'Martini',
    'I do not drink alcohol',
];

export default function MidnightVelourTemplate({
    wedding,
    isPreview = false,
}: WebsiteTemplateProps) {
    const {
        brideName,
        groomName,
        primaryDateStr,
        venueLocation,
        events,
        step,
        guestName,
        setGuestName,
        setStatus,
        handleSubmit,
    } = useWeddingTemplateData(wedding, isPreview);

    const isDefaultSample = useMemo(() => {
        const pair = `${brideName} ${groomName}`.toLowerCase();
        return (
            !wedding ||
            pair.includes('anjali') ||
            pair.includes('rahul') ||
            pair.includes('aarav') ||
            pair.includes('meera') ||
            pair.includes('priya')
        );
    }, [wedding, brideName, groomName]);

    const displayBride = isDefaultSample
        ? 'Laura'
        : brideName.split(' ')[0] || 'Laura';
    const displayGroom = isDefaultSample
        ? 'Stephan'
        : groomName.split(' ')[0] || 'Stephan';

    // Format primary date as DD.MM.YYYY (defaulting to 19.09.2026 for replica fidelity)
    const formattedDateDot = useMemo(() => {
        if (isDefaultSample || !primaryDateStr) return '19.09.2026';
        const d = new Date(primaryDateStr);
        if (Number.isNaN(d.getTime())) return '19.09.2026';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
    }, [isDefaultSample, primaryDateStr]);

    const formattedNextDayDot = useMemo(() => {
        if (isDefaultSample || !primaryDateStr) return '20.09.2026';
        const d = new Date(primaryDateStr);
        if (Number.isNaN(d.getTime())) return '20.09.2026';
        d.setDate(d.getDate() + 1);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
    }, [isDefaultSample, primaryDateStr]);

    // Preloader & Golden Stage Curtain state
    const [preloaderFading, setPreloaderFading] = useState(false);
    const [preloaderHidden, setPreloaderHidden] = useState(false);
    const [curtainsOpen, setCurtainsOpen] = useState(false);
    const [curtainsRemoved, setCurtainsRemoved] = useState(false);
    const [dotCount, setDotCount] = useState(1);

    // Animate Loading... dots
    useEffect(() => {
        if (preloaderHidden) return;
        const interval = setInterval(() => {
            setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
        }, 500);
        return () => clearInterval(interval);
    }, [preloaderHidden]);

    // Trigger preloader fade and golden curtain opening sequence
    const triggerOpeningSequence = () => {
        if (preloaderFading) return;
        setPreloaderFading(true);
        setTimeout(() => {
            setPreloaderHidden(true);
        }, 600);
        setTimeout(() => {
            setCurtainsOpen(true);
        }, 1000);
        setTimeout(() => {
            setCurtainsRemoved(true);
        }, 4200);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            triggerOpeningSequence();
        }, 2200);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Live Countdown Timer (#rec2225136933)
    const targetTimestamp = useMemo(() => {
        if (!isDefaultSample && primaryDateStr) {
            const parsed = new Date(primaryDateStr).getTime();
            if (!Number.isNaN(parsed) && parsed > Date.now()) {
                return parsed;
            }
        }
        const defaultTarget = new Date('2026-12-19T00:00:00').getTime();
        if (defaultTarget > Date.now()) {
            return defaultTarget;
        }
        return Date.now() + 95 * 24 * 60 * 60 * 1000;
    }, [isDefaultSample, primaryDateStr]);

    const [countdown, setCountdown] = useState({
        days: 95,
        hours: 12,
        minutes: 34,
        seconds: 56,
    });

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, targetTimestamp - now);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setCountdown({ days, hours, minutes, seconds });
        };
        updateTimer();
        const id = setInterval(updateTimer, 1000);
        return () => clearInterval(id);
    }, [targetTimestamp]);

    // IntersectionObserver for scroll reveal animations (.mv-anim)
    const rootRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const elements = Array.from(root.querySelectorAll<HTMLElement>('.mv-anim'));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        const delay = Number(el.dataset.delay || '0');
                        if (delay > 0) {
                            setTimeout(() => {
                                el.classList.add('is-visible');
                            }, delay);
                        } else {
                            el.classList.add('is-visible');
                        }
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // RSVP local state (wired to useWeddingTemplateData)
    const [attendanceChoice, setAttendanceChoice] = useState<string>('Yes, I will');
    const [selectedDrinks, setSelectedDrinks] = useState<string[]>(['Champagne']);

    const handleAttendanceChange = (val: string) => {
        setAttendanceChoice(val);
        if (val === 'Unfortunately, I can not :(') {
            setStatus('declined');
        } else if (val === 'I will tell you a bit later') {
            setStatus('maybe');
        } else {
            setStatus('attending');
        }
    };

    const toggleDrink = (drink: string) => {
        setSelectedDrinks((prev) =>
            prev.includes(drink) ? prev.filter((d) => d !== drink) : [...prev, drink]
        );
    };

    const onRsvpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName.trim()) return;
        handleSubmit(e);
    };

    const scrollToInvitationCard = () => {
        const el = document.getElementById('mv-dear-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Custom events fallback if user customized events
    const hasCustomEvents = !isDefaultSample && events && events.length > 0;

    return (
        <div className="mv-root" ref={rootRef}>
            {/* ================================================================
                RECORD 10: PRELOADER & PARTING GOLDEN CURTAINS (#rec2225137013)
               ================================================================ */}
            {!preloaderHidden && (
                <div
                    className={`mv-preloader ${preloaderFading ? 'is-fading' : ''}`}
                    onClick={triggerOpeningSequence}
                    title="Click to enter"
                >
                    <img
                        src={`${ASSET_BASE}/preloader-logo.png`}
                        alt="Monogram"
                        className="mv-preloader-logo"
                    />
                    <div className="mv-preloader-text">
                        Loading
                        <span className="mv-preloader-dots">{'.'.repeat(dotCount)}</span>
                    </div>
                </div>
            )}

            {!curtainsRemoved && (
                <div className="mv-curtain-overlay" aria-hidden="true">
                    <div
                        className={`mv-curtain mv-left-curtain ${
                            curtainsOpen ? 'open-left' : ''
                        }`}
                    />
                    <div
                        className={`mv-curtain mv-right-curtain ${
                            curtainsOpen ? 'open-right' : ''
                        }`}
                    />
                </div>
            )}

            {/* ================================================================
                RECORD 1: HERO VIDEO SECTION (#rec2225136913)
               ================================================================ */}
            <section className="mv-record mv-rec-hero">
                <div className="mv-stage mv-rec-hero">
                    <div className="mv-hero-video-wrap">
                        <video
                            className="mv-hero-video"
                            src={`${ASSET_BASE}/hero-video.mp4`}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>

                    <div className="mv-hero-top-gradient" />
                    <div className="mv-hero-bottom-gradient" />

                    <div
                        className="mv-hero-names mv-anim mv-anim-fadein"
                        data-delay="350"
                    >
                        {displayBride} &amp; {displayGroom}
                    </div>

                    <div
                        className="mv-hero-date mv-anim mv-anim-fadein"
                        data-delay="350"
                    >
                        {formattedDateDot}
                    </div>

                    <div
                        className="mv-hero-scroll-text mv-anim mv-anim-fadein"
                        data-delay="350"
                        onClick={scrollToInvitationCard}
                    >
                        Scroll down
                    </div>

                    <div
                        className="mv-hero-scroll-arrow"
                        onClick={scrollToInvitationCard}
                        role="button"
                        aria-label="Scroll down"
                    >
                        <svg
                            role="presentation"
                            width="100%"
                            height="100%"
                            viewBox="0 0 25 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.5 1.99997L12.5 13L23.5 1.99997"
                                stroke="#E2CD96"
                                strokeWidth="3"
                            />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ================================================================
                RECORD 2: DEAR FRIENDS AND FAMILY CARD (#rec2225136923)
               ================================================================ */}
            <section id="mv-dear-section" className="mv-record mv-rec-dear">
                <div className="mv-stage mv-rec-dear">
                    <div
                        className="mv-dear-card mv-anim mv-anim-fadeinup"
                        data-delay="350"
                    />
                    <h2
                        className="mv-dear-title mv-anim mv-anim-fadeinup"
                        data-delay="350"
                    >
                        Dear friends and family
                    </h2>
                    <p
                        className="mv-dear-p1 mv-anim mv-anim-fadeinup"
                        data-delay="350"
                    >
                        This autumn, a very special and happy event is going to happen -
                        our wedding!
                    </p>
                    <p
                        className="mv-dear-p2 mv-anim mv-anim-fadeinup"
                        data-delay="350"
                    >
                        We can’t imagine this day without our closest people. So, we’re
                        very excited to invite you to join and share this wonderful day
                        with us.
                    </p>
                    <img
                        src={`${ASSET_BASE}/floral-dear.png`}
                        alt=""
                        className="mv-dear-floral mv-anim mv-anim-fadeinleft"
                        data-delay="350"
                    />
                </div>
            </section>

            {/* ================================================================
                RECORD 3: COUNTDOWN (#rec2225136933)
               ================================================================ */}
            <section className="mv-record mv-rec-countdown">
                <div className="mv-stage mv-rec-countdown">
                    <div
                        className="mv-countdown-title mv-anim mv-anim-fadein"
                        data-delay="300"
                    >
                        Let&apos;s enjoy this event in
                    </div>

                    <div
                        className="mv-countdown-box mv-anim mv-anim-fadein"
                        data-delay="300"
                    >
                        <div className="mv-countdown-unit">
                            <div className="mv-countdown-number">{countdown.days}</div>
                            <div className="mv-countdown-label">Days</div>
                        </div>
                        <div className="mv-countdown-colon">:</div>
                        <div className="mv-countdown-unit">
                            <div className="mv-countdown-number">{countdown.hours}</div>
                            <div className="mv-countdown-label">Hours</div>
                        </div>
                        <div className="mv-countdown-colon">:</div>
                        <div className="mv-countdown-unit">
                            <div className="mv-countdown-number">{countdown.minutes}</div>
                            <div className="mv-countdown-label">Minutes</div>
                        </div>
                        <div className="mv-countdown-colon">:</div>
                        <div className="mv-countdown-unit">
                            <div className="mv-countdown-number">{countdown.seconds}</div>
                            <div className="mv-countdown-label">Seconds</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================================
                RECORD 4: EVENT TIMELINE (#rec2225136953)
               ================================================================ */}
            <section className="mv-record mv-rec-timeline">
                <div className="mv-stage mv-rec-timeline">
                    <img
                        src={`${ASSET_BASE}/floral-timeline-top.png`}
                        alt=""
                        className="mv-timeline-floral-top mv-anim mv-anim-fadeinright"
                        data-delay="300"
                    />

                    <img
                        src={`${ASSET_BASE}/couple-timeline-arch.png`}
                        alt={`${displayBride} & ${displayGroom}`}
                        className="mv-timeline-arch-img"
                    />

                    <div className="mv-timeline-card" />

                    <h2
                        className="mv-timeline-heading mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        Event timeline
                    </h2>

                    <div
                        className="mv-timeline-date1 mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        {formattedDateDot}
                    </div>

                    {hasCustomEvents ? (
                        <div
                            className="mv-timeline-list1 mv-anim mv-anim-fadeinup"
                            data-delay="300"
                        >
                            {events.map((ev, idx) => (
                                <div key={ev.id || idx} style={{ marginBottom: '10px' }}>
                                    <div>
                                        {ev.formattedTime || ev.time || '12:00'} - {ev.displayTitle}
                                    </div>
                                    {ev.venue && (
                                        <div
                                            style={{
                                                fontSize: '15px',
                                                lineHeight: 1.3,
                                                opacity: 0.85,
                                            }}
                                        >
                                            at {ev.venue}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div
                                className="mv-timeline-list1 mv-anim mv-anim-fadeinup"
                                data-delay="300"
                            >
                                12:00 - Wedding ceremony
                                <br />
                                13:30 - Transfer
                                <br />
                                14:00 - Cocktail hour
                                <br />
                                15:00 - Newly wed’s first dance
                                <br />
                                15:30 - Dinner
                                <br />
                                17:00 - Party
                                <br />
                                21:00 - Closing
                            </div>

                            <div
                                className="mv-timeline-sub1a mv-anim mv-anim-fadeinup"
                                data-delay="300"
                            >
                                at The Heerenhuys
                            </div>

                            <div
                                className="mv-timeline-sub1b mv-anim mv-anim-fadeinup"
                                data-delay="300"
                            >
                                at the Sebastian restaurant
                            </div>

                            <div
                                className="mv-timeline-date2 mv-anim mv-anim-fadeinup"
                                data-delay="300"
                            >
                                {formattedNextDayDot}
                            </div>

                            <div
                                className="mv-timeline-list2 mv-anim mv-anim-fadeinup"
                                data-delay="300"
                            >
                                11:00 - Meeting at the hotel
                                <br />
                                12:00 - Pool party
                            </div>

                            <div
                                className="mv-timeline-sub2a mv-anim mv-anim-fadeinup"
                                data-delay="300"
                            >
                                Mijnsherenlaan 9, 3081 GA
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ================================================================
                RECORD 5: DRESS CODE & ORGANIZATIONAL ASPECTS (#rec2225136963)
               ================================================================ */}
            <section className="mv-record mv-rec-dress">
                <div className="mv-stage mv-rec-dress">
                    <h2
                        className="mv-dress-heading mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        Dress code
                    </h2>

                    <p
                        className="mv-dress-subtitle mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        We would be grateful if you respect the color palette of our
                        wedding while choosing your outfit
                    </p>

                    {/* 5 Dress code color swatches */}
                    <div
                        className="mv-swatch mv-swatch-1 mv-anim mv-anim-fadeinleft"
                        data-delay="300"
                    />
                    <div
                        className="mv-swatch mv-swatch-2 mv-anim mv-anim-fadeinleft"
                        data-delay="500"
                    />
                    <div
                        className="mv-swatch mv-swatch-3 mv-anim mv-anim-fadeinleft"
                        data-delay="700"
                    />
                    <div
                        className="mv-swatch mv-swatch-4 mv-anim mv-anim-fadeinleft"
                        data-delay="900"
                    />
                    <div
                        className="mv-swatch mv-swatch-5 mv-anim mv-anim-fadeinleft"
                        data-delay="1100"
                    />

                    {/* 7 Outfit Inspiration Photos */}
                    <div
                        className="mv-dress-photo mv-dress-wide"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-wide.png')`,
                        }}
                    />
                    <div
                        className="mv-dress-photo mv-dress-1 mv-anim mv-anim-fadeinleft"
                        data-delay="500"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-1.png')`,
                        }}
                    />
                    <div
                        className="mv-dress-photo mv-dress-2 mv-anim mv-anim-fadeinleft"
                        data-delay="300"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-2.png')`,
                        }}
                    />
                    <div
                        className="mv-dress-photo mv-dress-3 mv-anim mv-anim-fadeinright"
                        data-delay="300"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-3.png')`,
                        }}
                    />
                    <div
                        className="mv-dress-photo mv-dress-4 mv-anim mv-anim-fadeinright"
                        data-delay="500"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-4.png')`,
                        }}
                    />
                    <div
                        className="mv-dress-photo mv-dress-5 mv-anim mv-anim-fadeinup"
                        data-delay="300"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-5.png')`,
                        }}
                    />
                    <div
                        className="mv-dress-photo mv-dress-6 mv-anim mv-anim-fadeinup"
                        data-delay="500"
                        style={{
                            backgroundImage: `url('${ASSET_BASE}/dress-6.png')`,
                        }}
                    />

                    {/* Let's celebrate! + Floral */}
                    <div
                        className="mv-celebrate-heading mv-anim mv-anim-fadein"
                        data-delay="300"
                    >
                        Let ’s celebrate!
                    </div>

                    <img
                        src={`${ASSET_BASE}/floral-celebrate-right.png`}
                        alt=""
                        className="mv-celebrate-floral-right mv-anim mv-anim-fadeinleft"
                        data-delay="300"
                    />

                    {/* Organizational aspects card */}
                    <div className="mv-org-card" />

                    <h2
                        className="mv-org-heading mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        Organizational aspects
                    </h2>

                    <p
                        className="mv-org-p1 mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        Even though we like flowers, we won’t have enough time to enjoy
                        their beauty as leaving for our honeymoon right after the wedding.
                        Instead, we’d be happy if you bring a bottle of your favorite wine
                        with a tiny note to remind us about this day.
                    </p>

                    <p
                        className="mv-org-p2 mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        If you want to prepare a surprise for us or have any questions
                        about the event, don’t hesitate to contact our organizer Victoria{' '}
                        <strong style={{ fontWeight: 700 }}>+31600000000</strong>
                    </p>

                    <img
                        src={`${ASSET_BASE}/floral-org-bottom.png`}
                        alt=""
                        className="mv-org-floral-bottom mv-anim mv-anim-fadeinright"
                        data-delay="300"
                    />
                </div>
            </section>

            {/* ================================================================
                RECORD 6: RSVP FORM CARD (#rec2225136973)
               ================================================================ */}
            <section className="mv-record mv-rec-rsvp">
                <div className="mv-stage mv-rec-rsvp">
                    <img
                        src={`${ASSET_BASE}/couple-rsvp-arch.png`}
                        alt={`${displayBride} & ${displayGroom}`}
                        className="mv-rsvp-arch-img"
                    />

                    <div className="mv-rsvp-card" />

                    <h2
                        className="mv-rsvp-heading mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        Please confirm
                        <br />
                        your attendance
                    </h2>

                    <div
                        className="mv-rsvp-form-wrap mv-anim mv-anim-fadeinup"
                        data-delay="300"
                    >
                        {step === 'SUCCESS' ? (
                            <div className="mv-rsvp-success">
                                Thank you, <strong>{guestName}</strong>! Your response (
                                <em>{attendanceChoice}</em>) has been saved.
                            </div>
                        ) : (
                            <form onSubmit={onRsvpSubmit}>
                                <div className="mv-form-group">
                                    <label
                                        htmlFor="mv-guest-name"
                                        className="mv-form-label"
                                    >
                                        Your name
                                    </label>
                                    <input
                                        id="mv-guest-name"
                                        type="text"
                                        className="mv-form-input"
                                        placeholder="Name Surname"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mv-form-group">
                                    <div className="mv-form-label">Will you come?</div>
                                    <div className="mv-radio-list">
                                        {[
                                            'Yes, I will',
                                            'Unfortunately, I can not :(',
                                            'I will tell you a bit later',
                                        ].map((option) => (
                                            <label
                                                key={option}
                                                className="mv-choice-item"
                                            >
                                                <input
                                                    type="radio"
                                                    name="mv-attendance"
                                                    value={option}
                                                    checked={attendanceChoice === option}
                                                    onChange={() =>
                                                        handleAttendanceChange(option)
                                                    }
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mv-form-group">
                                    <div className="mv-form-label">
                                        What would you like to drink?
                                    </div>
                                    <div className="mv-checkbox-list">
                                        {DRINK_OPTIONS.map((drink) => (
                                            <label key={drink} className="mv-choice-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDrinks.includes(
                                                        drink
                                                    )}
                                                    onChange={() => toggleDrink(drink)}
                                                />
                                                <span>{drink}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="mv-submit-btn">
                                    SUBMIT
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ================================================================
                RECORD 7 & 8: THE LOCATION & GOOGLE MAP (#rec2225136983 & #rec2225136993)
               ================================================================ */}
            <section className="mv-record mv-rec-location-title">
                <div className="mv-stage mv-rec-location-title">
                    <h2
                        className="mv-location-heading mv-anim mv-anim-fadein"
                        data-delay="300"
                    >
                        The location
                    </h2>
                </div>
            </section>

            <section className="mv-rec-map">
                <iframe
                    title={
                        !isDefaultSample && venueLocation
                            ? venueLocation
                            : 'La Perle du Lac'
                    }
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.4956791642067!2d6.149449776152988!3d46.22048777109638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c652572e5488b%3A0x1a0ae55abcf0f170!2sLa%20Perle%20du%20Lac!5e0!3m2!1sru!2sru!4v1745688894013!5m2!1sru!2sru"
                    className="mv-map-iframe"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>

            {/* ================================================================
                RECORD 9: FOOTER (#rec2225137003)
               ================================================================ */}
            <footer className="mv-record mv-rec-footer">
                <div className="mv-stage mv-rec-footer">
                    <div
                        className="mv-footer-hope mv-anim mv-anim-fadein"
                        data-delay="350"
                    >
                        Hope to see you there
                    </div>
                    <div
                        className="mv-footer-names mv-anim mv-anim-fadein"
                        data-delay="350"
                    >
                        {displayBride} and {displayGroom}
                    </div>
                    <img
                        src={`${ASSET_BASE}/footer-icon.png`}
                        alt=""
                        className="mv-footer-icon mv-anim mv-anim-fadein"
                        data-delay="350"
                    />
                </div>
            </footer>
        </div>
    );
}
