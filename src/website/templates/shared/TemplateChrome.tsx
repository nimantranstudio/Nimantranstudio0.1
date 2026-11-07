'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Download, ExternalLink, Volume2, VolumeX, X } from 'lucide-react';
import type { CalendarEventPayload } from './useWeddingTemplateData';
import styles from './TemplateChrome.module.css';

export interface ChromeThemeVars {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    border: string;
    fontDisplay: string;
    fontSans: string;
}

function toStyleVars(theme: ChromeThemeVars): React.CSSProperties {
    return {
        ['--tc-bg' as string]: theme.bg,
        ['--tc-surface' as string]: theme.surface,
        ['--tc-ink' as string]: theme.ink,
        ['--tc-muted' as string]: theme.muted,
        ['--tc-accent' as string]: theme.accent,
        ['--tc-border' as string]: theme.border,
        ['--tc-font-display' as string]: theme.fontDisplay,
        ['--tc-font-sans' as string]: theme.fontSans,
    };
}

export function TemplateAudioToggle({
    audioUrl = '/music/shubha-aagaman.m4a',
    autoPlayTrigger,
    disabled = false,
    theme,
}: {
    audioUrl?: string;
    autoPlayTrigger?: boolean;
    disabled?: boolean;
    theme: ChromeThemeVars;
}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const manuallyMutedRef = useRef(false);

    const togglePlay = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const audio = audioRef.current;
        if (!audio) return;

        if (!audio.paused && !audio.muted) {
            manuallyMutedRef.current = true;
            audio.pause();
            audio.muted = true;
            setIsPlaying(false);
        } else {
            manuallyMutedRef.current = false;
            audio.muted = false;
            audio
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        }
    }, []);

    useEffect(() => {
        const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
        if (disabled || isEmbedded) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.muted = true;
            }
            setIsPlaying(false);
            return;
        }

        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0.52;
        audio.loop = true;

        const attemptPlay = () => {
            if (!audioRef.current || manuallyMutedRef.current) return;
            audioRef.current.muted = false;
            const p = audioRef.current.play();
            if (p !== undefined) {
                p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        };

        const onFirstGesture = (e: Event) => {
            if (
                e.target &&
                buttonRef.current &&
                (buttonRef.current === e.target || buttonRef.current.contains(e.target as Node))
            ) {
                return;
            }
            if (!manuallyMutedRef.current && audioRef.current && audioRef.current.paused) {
                attemptPlay();
            }
        };

        const events = ['click', 'touchstart', 'pointerdown', 'keydown'];
        events.forEach((evt) => window.addEventListener(evt, onFirstGesture, { capture: true, passive: true }));

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, onFirstGesture, { capture: true }));
            audio.pause();
        };
    }, [disabled]);

    useEffect(() => {
        const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
        if (disabled || isEmbedded) return;
        if (autoPlayTrigger && !manuallyMutedRef.current && audioRef.current && audioRef.current.paused) {
            audioRef.current.muted = false;
            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        }
    }, [autoPlayTrigger, disabled]);

    return (
        <div className={styles.audioWrap} style={toStyleVars(theme)}>
            <audio
                ref={audioRef}
                loop
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                <source src={audioUrl} type="audio/mp4" />
                <source src="/music/shubha-aagaman.mp4" type="video/mp4" />
                <source src="/music/with-tanpura-drone.m4a" type="audio/mp4" />
            </audio>
            <button
                ref={buttonRef}
                type="button"
                onClick={togglePlay}
                className={styles.audioBtn}
                aria-label={isPlaying ? 'Mute invitation music' : 'Play invitation music'}
            >
                {isPlaying ? (
                    <>
                        <span className={styles.eqBars} aria-hidden="true">
                            <span className={styles.eqBar} style={{ animationDelay: '0ms' }} />
                            <span className={styles.eqBar} style={{ animationDelay: '180ms' }} />
                            <span className={styles.eqBar} style={{ animationDelay: '340ms' }} />
                        </span>
                        <Volume2 size={15} strokeWidth={1.75} className={styles.audioIcon} />
                    </>
                ) : (
                    <>
                        <VolumeX size={15} strokeWidth={1.75} className={styles.audioIcon} />
                        <span>Music</span>
                    </>
                )}
            </button>
        </div>
    );
}

export function TemplateCalendarModal({
    eventData,
    onClose,
    theme,
}: {
    eventData: CalendarEventPayload | null;
    onClose: () => void;
    theme: ChromeThemeVars;
}) {
    const [deviceType, setDeviceType] = useState<'apple' | 'android' | 'other'>('other');

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            const ua = navigator.userAgent || '';
            if (/iPhone|iPad|iPod|Macintosh/i.test(ua)) setDeviceType('apple');
            else if (/Android/i.test(ua)) setDeviceType('android');
        }
    }, []);

    useEffect(() => {
        if (!eventData) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [eventData, onClose]);

    const handleGoogle = () => {
        if (!eventData) return;
        const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: eventData.title,
            dates: `${fmt(eventData.startDate)}/${fmt(eventData.endDate)}`,
            details: eventData.description,
            location: eventData.location,
        });
        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank', 'noopener,noreferrer');
        onClose();
    };

    const handleAppleIcs = () => {
        if (!eventData) return;
        const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}@nimantranstudio.in`;
        const cleanTitle = eventData.title.replace(/\n/g, ' ').trim();
        const cleanDesc = eventData.description.replace(/\n/g, '\\n').trim();
        const cleanLoc = eventData.location.replace(/\n/g, ', ').trim();

        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Nimantran Studio//Wedding Invitation//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${fmt(new Date())}`,
            `DTSTART:${fmt(eventData.startDate)}`,
            `DTEND:${fmt(eventData.endDate)}`,
            `SUMMARY:${cleanTitle}`,
            `DESCRIPTION:${cleanDesc}`,
            `LOCATION:${cleanLoc}`,
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            `DESCRIPTION:Reminder: ${cleanTitle}`,
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n');

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        onClose();
    };

    return (
        <AnimatePresence>
            {eventData && (
                <motion.div
                    className={styles.backdrop}
                    style={toStyleVars(theme)}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className={styles.dialog}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ns-cal-modal-title"
                    >
                        <div className={styles.dialogHeader}>
                            <div>
                                <h3 id="ns-cal-modal-title" className={styles.dialogTitle}>
                                    Save to Calendar
                                </h3>
                                <p className={styles.dialogSub}>{eventData.title}</p>
                            </div>
                            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                                <X size={16} strokeWidth={1.75} />
                            </button>
                        </div>

                        <div className={styles.optionList}>
                            <button type="button" className={styles.optionBtn} onClick={handleGoogle}>
                                <span className={styles.optionIcon}>
                                    <Calendar size={18} strokeWidth={1.75} />
                                </span>
                                <span className={styles.optionBody}>
                                    <span className={styles.optionNameRow}>
                                        <span className={styles.optionName}>Google Calendar</span>
                                        {deviceType === 'android' && <span className={styles.deviceTag}>Recommended</span>}
                                    </span>
                                    <span className={styles.optionDesc}>Android, Gmail & Web Calendar</span>
                                </span>
                                <ExternalLink size={15} strokeWidth={1.75} />
                            </button>

                            <button type="button" className={styles.optionBtn} onClick={handleAppleIcs}>
                                <span className={styles.optionIcon}>
                                    <Download size={18} strokeWidth={1.75} />
                                </span>
                                <span className={styles.optionBody}>
                                    <span className={styles.optionNameRow}>
                                        <span className={styles.optionName}>Apple & Outlook Calendar</span>
                                        {deviceType === 'apple' && <span className={styles.deviceTag}>Recommended</span>}
                                    </span>
                                    <span className={styles.optionDesc}>Downloads .ics file for iPhone, iPad & Mac</span>
                                </span>
                                <Download size={15} strokeWidth={1.75} />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export interface GallerySlide {
    src: string;
    alt: string;
    caption?: string;
}

export function TemplateLightbox({
    slides,
    activeIndex,
    onClose,
    onSelectIndex,
}: {
    slides: GallerySlide[];
    activeIndex: number | null;
    onClose: () => void;
    onSelectIndex: (idx: number) => void;
}) {
    const isOpen = activeIndex !== null && slides[activeIndex] !== undefined;

    useEffect(() => {
        if (!isOpen || activeIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && slides.length > 1) {
                onSelectIndex((activeIndex + 1) % slides.length);
            }
            if (e.key === 'ArrowLeft' && slides.length > 1) {
                onSelectIndex((activeIndex - 1 + slides.length) % slides.length);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, activeIndex, slides.length, onClose, onSelectIndex]);

    const current = activeIndex !== null ? slides[activeIndex] : null;

    return (
        <AnimatePresence>
            {isOpen && current && activeIndex !== null && (
                <motion.div
                    className={styles.lightboxBackdrop}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery image viewer"
                >
                    <div className={styles.lightboxTopBar} onClick={(e) => e.stopPropagation()}>
                        <span>
                            {activeIndex + 1} / {slides.length}
                        </span>
                        <button type="button" className={styles.lightboxClose} onClick={onClose} aria-label="Close viewer">
                            <X size={18} strokeWidth={1.75} />
                        </button>
                    </div>

                    <motion.div
                        key={current.src}
                        className={styles.lightboxStage}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <img src={current.src} alt={current.alt} className={styles.lightboxImg} />
                    </motion.div>

                    {current.caption && <p className={styles.lightboxCaption}>{current.caption}</p>}

                    {slides.length > 1 && (
                        <>
                            <button
                                type="button"
                                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectIndex((activeIndex - 1 + slides.length) % slides.length);
                                }}
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={20} strokeWidth={1.75} />
                            </button>
                            <button
                                type="button"
                                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectIndex((activeIndex + 1) % slides.length);
                                }}
                                aria-label="Next image"
                            >
                                <ChevronRight size={20} strokeWidth={1.75} />
                            </button>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

