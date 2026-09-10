'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../rsvp.module.css';

interface RoyalSanctuaryDoorsProps {
    targetDateStr?: string | null;
    targetTimeStr?: string | null;
    venueLocation?: string | null;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
}

function parseTargetDateTime(dateStr?: string | null, timeStr?: string | null): number | null {
    if (!dateStr || !dateStr.trim()) return null;

    let year: number;
    let month: number;
    let day: number;

    const trimmedDate = dateStr.trim();
    const isoMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
        year = parseInt(isoMatch[1], 10);
        month = parseInt(isoMatch[2], 10) - 1;
        day = parseInt(isoMatch[3], 10);
    } else {
        const parsed = new Date(trimmedDate);
        if (isNaN(parsed.getTime())) return null;
        year = parsed.getFullYear();
        month = parsed.getMonth();
        day = parsed.getDate();
    }

    let hours = 0;
    let minutes = 0;

    if (timeStr && timeStr.trim()) {
        const cleanTime = timeStr.trim();
        const match12 = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (match12) {
            let h = parseInt(match12[1], 10);
            const m = parseInt(match12[2], 10);
            const modifier = match12[3]?.toUpperCase();
            if (modifier === 'PM' && h < 12) h += 12;
            if (modifier === 'AM' && h === 12) h = 0;
            hours = h;
            minutes = m;
        } else {
            const match24 = cleanTime.match(/^(\d{1,2}):(\d{2})/);
            if (match24) {
                hours = parseInt(match24[1], 10);
                minutes = parseInt(match24[2], 10);
            }
        }
    }

    const targetDate = new Date(year, month, day, hours, minutes, 0, 0);
    return targetDate.getTime();
}

function formatFullWeddingDate(dateStr?: string | null): { fullDate: string; subText: string } {
    if (!dateStr || !dateStr.trim()) {
        return {
            fullDate: 'The Wedding Ceremony',
            subText: '',
        };
    }

    try {
        const d = new Date(dateStr.trim());
        if (isNaN(d.getTime())) {
            return {
                fullDate: dateStr,
                subText: dateStr.toUpperCase(),
            };
        }

        const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
        const dayNum = d.toLocaleDateString('en-GB', { day: 'numeric' });
        const monthLong = d.toLocaleDateString('en-GB', { month: 'long' });
        const yearNum = d.toLocaleDateString('en-GB', { year: 'numeric' });

        const fullDate = `${weekday}, ${dayNum} ${monthLong} ${yearNum}`;

        const num = d.getDate();
        let suffix = 'TH';
        if (num === 1 || num === 21 || num === 31) suffix = 'ST';
        else if (num === 2 || num === 22) suffix = 'ND';
        else if (num === 3 || num === 23) suffix = 'RD';

        const subText = `${monthLong.toUpperCase()} ${num}${suffix}, ${yearNum}`;

        return { fullDate, subText };
    } catch {
        return {
            fullDate: dateStr,
            subText: dateStr.toUpperCase(),
        };
    }
}



export const RoyalSanctuaryDoors: React.FC<RoyalSanctuaryDoorsProps> = ({
    targetDateStr,
    targetTimeStr,
    venueLocation,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    const { fullDate, subText } = formatFullWeddingDate(targetDateStr);

    const locationCity = venueLocation && venueLocation.trim()
        ? venueLocation.split(',')[0].trim().toUpperCase()
        : '';

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft => {
            const targetTimestamp = parseTargetDateTime(targetDateStr, targetTimeStr);

            if (!targetTimestamp) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isPast: false,
                };
            }

            const now = Date.now();
            const difference = targetTimestamp - now;

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds, isPast: false };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDateStr, targetTimeStr]);

    const handleToggleGates = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <section className={styles.sanctuarySection}>
            {/* Sanctuary Section Header */}
            <div className={styles.sanctuaryHeader}>
                <span className={styles.sanctuaryBadge}>JOIN THE CELEBRATION</span>
                <h2 className={styles.sanctuaryTitle}>Counting Down the Days</h2>
                <p className={styles.sanctuarySubtitle}>
                    {isOpen
                        ? 'Tap the card or sanctuary gates to close'
                        : 'Tap the sacred center ring to slide the golden sanctuary gates open'}
                </p>
            </div>

            {/* Stage Container */}
            <div className={styles.sanctuaryStageWrap}>
                {/* Blurred Temple Mandap Background Glow */}
                <div className={styles.sanctuaryTempleBg} />

                {/* Main Sliding Door & Inner Content Stage */}
                <div
                    className={styles.sanctuaryPerspectiveBox}
                    onClick={handleToggleGates}
                    role="button"
                    tabIndex={0}
                    aria-label={isOpen ? 'Sanctuary gates open. Click to close' : 'Click to open sanctuary gates'}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleToggleGates();
                        }
                    }}
                >
                    {/* ─── INNER CARD: WEDDING DATE & COUNTDOWN (Revealed When Open) ─── */}
                    <motion.div
                        className={styles.sanctuaryInnerCard}
                        initial={false}
                        animate={{
                            scale: isOpen ? 1 : 0.95,
                            opacity: isOpen ? 1 : 0.6,
                        }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                    >
                        <div className={styles.innerCardDateTag}>OUR WEDDING DATE</div>

                        <h3 className={styles.innerCardDateMain}>{fullDate}</h3>

                        {(subText || locationCity) && (
                            <div className={styles.innerCardDateSub}>
                                {subText}
                                {subText && locationCity ? ' • ' : ''}
                                {locationCity}
                            </div>
                        )}

                        <div className={styles.innerCardDivider} />

                        {/* 3 Countdown Boxes (Days, Hours, Minutes) */}
                        <div className={styles.sanctuaryTimerGrid}>
                            <div className={styles.sanctuaryTimerBox}>
                                <span className={styles.sanctuaryTimerNum}>
                                    {timeLeft ? String(timeLeft.days).padStart(2, '0') : '00'}
                                </span>
                                <span className={styles.sanctuaryTimerLabel}>DAYS</span>
                            </div>

                            <div className={styles.sanctuaryTimerBox}>
                                <span className={styles.sanctuaryTimerNum}>
                                    {timeLeft ? String(timeLeft.hours).padStart(2, '0') : '00'}
                                </span>
                                <span className={styles.sanctuaryTimerLabel}>HOURS</span>
                            </div>

                            <div className={styles.sanctuaryTimerBox}>
                                <span className={styles.sanctuaryTimerNum}>
                                    {timeLeft ? String(timeLeft.minutes).padStart(2, '0') : '00'}
                                </span>
                                <span className={styles.sanctuaryTimerLabel}>MINUTES</span>
                            </div>
                        </div>

                        {isOpen && (
                            <div className={styles.innerCardTapNotice}>
                                <span>✦ Tap to close gates ✦</span>
                            </div>
                        )}
                    </motion.div>

                    {/* ─── SLIDING ROYAL GATES (Left & Right Pocket Doors) ─── */}
                    <div className={styles.sanctuaryDoorsWrapper}>
                        {/* LEFT DOOR - Slides Out to Left */}
                        <motion.div
                            className={styles.sanctuaryDoorLeft}
                            initial={false}
                            animate={{
                                x: isOpen ? '-102%' : '0%',
                                opacity: isOpen ? 0.3 : 1,
                            }}
                            transition={{
                                type: 'spring',
                                damping: 24,
                                stiffness: 100,
                                mass: 0.9,
                            }}
                        >
                            <div className={styles.doorInnerBorder} />
                            <div className={styles.doorWatermarkLeft}>
                                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                                    <circle cx="50" cy="50" r="40" stroke="rgba(212, 175, 55, 0.22)" strokeWidth="1" />
                                    <circle cx="50" cy="50" r="28" stroke="rgba(212, 175, 55, 0.16)" strokeWidth="1" strokeDasharray="3 3" />
                                    <path d="M50 15 L50 85 M15 50 L85 50" stroke="rgba(212, 175, 55, 0.14)" strokeWidth="1" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* RIGHT DOOR - Slides Out to Right */}
                        <motion.div
                            className={styles.sanctuaryDoorRight}
                            initial={false}
                            animate={{
                                x: isOpen ? '102%' : '0%',
                                opacity: isOpen ? 0.3 : 1,
                            }}
                            transition={{
                                type: 'spring',
                                damping: 24,
                                stiffness: 100,
                                mass: 0.9,
                            }}
                        >
                            <div className={styles.doorInnerBorder} />
                            <div className={styles.doorWatermarkRight}>
                                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                                    <circle cx="50" cy="50" r="40" stroke="rgba(212, 175, 55, 0.22)" strokeWidth="1" />
                                    <circle cx="50" cy="50" r="28" stroke="rgba(212, 175, 55, 0.16)" strokeWidth="1" strokeDasharray="3 3" />
                                    <path d="M50 15 L50 85 M15 50 L85 50" stroke="rgba(212, 175, 55, 0.14)" strokeWidth="1" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* CENTER GOLDEN SEAM */}
                        <motion.div
                            className={styles.doorCenterSeam}
                            animate={{ opacity: isOpen ? 0 : 1, scaleY: isOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* SACRED GOLDEN CENTER SEAL (PERFECTLY CENTERED INSET CONTAINER) */}
                        <AnimatePresence>
                            {!isOpen && (
                                <div className={styles.sacredSealContainer}>
                                    <motion.div
                                        className={styles.sacredSealWrap}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.6, opacity: 0 }}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                                    >
                                        {/* Concentric Gold Rings */}
                                        <div className={styles.sealOuterRing} />
                                        <div className={styles.sealMiddleRing} />

                                        {/* Center Open Disk */}
                                        <div className={styles.sealCenterDisk}>
                                            <span className={styles.sealOpenText}>OPEN</span>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};
