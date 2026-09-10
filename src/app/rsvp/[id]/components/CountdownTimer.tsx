'use client';

import React, { useEffect, useState } from 'react';
import styles from '../rsvp.module.css';

interface CountdownTimerProps {
    targetDateStr?: string | null;
    targetTimeStr?: string | null;
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
    // Try matching YYYY-MM-DD
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
        // Match 12-hour format e.g. "07:30 PM", "7:00PM", "11:00 AM"
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
            // Match 24-hour format e.g. "14:15", "21:04", "09:30"
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

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDateStr, targetTimeStr }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

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

    if (!timeLeft) {
        return (
            <div className={styles.countdownContainer}>
                <div className={styles.countdownTitle}>Counting Down To The Big Day</div>
                <div className={styles.countdownGrid}>
                    {['DAYS', 'HOURS', 'MINUTES'].map((label) => (
                        <div key={label} className={styles.countdownBox}>
                            <span className={styles.countdownNum}>--</span>
                            <span className={styles.countdownLabel}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (timeLeft.isPast) {
        return (
            <div className={styles.countdownContainer}>
                <div className={styles.countdownPassedBox}>
                    <span className={styles.passedEmoji}>✨💍✨</span>
                    <p className={styles.passedTitle}>Celebrating Together!</p>
                    <p className={styles.passedSub}>Thank you for being part of our cherished memories.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.countdownContainer}>
            <div className={styles.countdownHeader}>
                <span className={styles.countdownBadge}>JOIN US IN</span>
            </div>

            <div className={styles.countdownGrid}>
                <div className={styles.countdownBox}>
                    <span className={styles.countdownNum}>{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>DAYS</span>
                </div>
                <div className={styles.countdownColon}>:</div>
                <div className={styles.countdownBox}>
                    <span className={styles.countdownNum}>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>HOURS</span>
                </div>
                <div className={styles.countdownColon}>:</div>
                <div className={styles.countdownBox}>
                    <span className={styles.countdownNum}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className={styles.countdownLabel}>MINS</span>
                </div>
            </div>
        </div>
    );
};
