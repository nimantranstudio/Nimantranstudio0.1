'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Download, ExternalLink } from 'lucide-react';
import styles from '../rsvp.module.css';

interface AddToCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventData: {
        title: string;
        description: string;
        location: string;
        startDate: Date;
        endDate: Date;
    };
}

export const AddToCalendarModal: React.FC<AddToCalendarModalProps> = ({
    isOpen,
    onClose,
    eventData,
}) => {
    const [deviceType, setDeviceType] = useState<'apple' | 'android' | 'other'>('other');

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            const ua = navigator.userAgent || '';
            if (/iPhone|iPad|iPod|Macintosh/i.test(ua)) {
                setDeviceType('apple');
            } else if (/Android/i.test(ua)) {
                setDeviceType('android');
            }
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Google Calendar URL Handler (Android & Web)
    const handleGoogleCalendar = () => {
        const formatUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const dates = `${formatUtc(eventData.startDate)}/${formatUtc(eventData.endDate)}`;

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: eventData.title,
            dates: dates,
            details: eventData.description,
            location: eventData.location,
        });

        const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    // Apple Calendar (.ics) Handler (iPhone, iPad, Mac)
    const handleAppleCalendar = () => {
        const formatUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const dtStamp = formatUtc(new Date());
        const dtStart = formatUtc(eventData.startDate);
        const dtEnd = formatUtc(eventData.endDate);
        const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}@nimantranstudio.in`;

        const cleanTitle = eventData.title.replace(/\n/g, ' ').trim();
        const cleanDesc = eventData.description.replace(/\n/g, '\\n').trim();
        const cleanLoc = eventData.location.replace(/\n/g, ', ').trim();

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Nimantran Studio//Wedding Invitation//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
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

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
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
            {isOpen && (
                <div className={styles.calendarModalOverlay} onClick={onClose}>
                    <motion.div
                        className={styles.calendarModalCard}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="calendar-modal-title"
                    >
                        {/* Header */}
                        <div className={styles.calendarModalHeader}>
                            <div className={styles.calendarModalTitleGroup}>
                                <div className={styles.calendarModalIconWrap}>
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <h3 id="calendar-modal-title" className={styles.calendarModalTitle}>
                                        Add to Calendar
                                    </h3>
                                    <p className={styles.calendarModalSubtitle}>
                                        Choose your calendar platform
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.calendarModalCloseBtn}
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Platform Options */}
                        <div className={styles.calendarOptionsList}>
                            {/* Google Calendar (Android / Web) */}
                            <button
                                type="button"
                                className={styles.calendarOptionItem}
                                onClick={handleGoogleCalendar}
                            >
                                <div className={styles.calendarOptionIconBox}>
                                    {/* Google Calendar SVG Icon */}
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="4" width="18" height="18" rx="4" fill="#4285F4" fillOpacity="0.12" stroke="#4285F4" strokeWidth="1.7" />
                                        <path d="M16 2v4M8 2v4M3 10h18" stroke="#4285F4" strokeWidth="1.7" strokeLinecap="round" />
                                        <circle cx="12" cy="15" r="2.2" fill="#EA4335" />
                                    </svg>
                                </div>
                                <div className={styles.calendarOptionTextBox}>
                                    <div className={styles.calendarOptionNameRow}>
                                        <span className={styles.calendarOptionName}>Google Calendar</span>
                                        {deviceType === 'android' && (
                                            <span className={styles.deviceBadge}>Your Device</span>
                                        )}
                                    </div>
                                    <span className={styles.calendarOptionDesc}>
                                        Android, Gmail & Web Calendar
                                    </span>
                                </div>
                                <ExternalLink size={16} className={styles.calendarOptionArrow} />
                            </button>

                            {/* Apple Calendar (iOS / Mac) */}
                            <button
                                type="button"
                                className={styles.calendarOptionItem}
                                onClick={handleAppleCalendar}
                            >
                                <div className={styles.calendarOptionIconBox}>
                                    {/* Apple Logo SVG */}
                                    <svg width="20" height="20" viewBox="0 0 170 170" fill="currentColor">
                                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.7-13.98-5.74-8.8-10.15-18.9-13.23-30.31-3.08-11.41-4.63-22.18-4.63-32.31 0-14.13 3.52-26.06 10.57-35.8 7.05-9.74 15.93-14.73 26.63-14.97 4.9.11 10.22 1.34 15.97 3.68 5.75 2.34 9.47 3.63 11.16 3.86 2.17-.33 6.09-1.74 11.75-4.23 5.66-2.49 10.78-3.63 15.36-3.41 12.83.65 23.05 5.44 30.65 14.37-11.09 6.74-16.52 16.09-16.3 28.05.22 9.57 3.81 17.5 10.77 23.8 6.96 6.3 15.22 9.89 24.78 10.76-2.17 6.31-4.78 12.61-7.85 18.91zM119.22 31.84c0-7.72 2.72-14.78 8.16-21.18 5.44-6.41 12.07-10.22 19.89-11.44.22 1.09.33 2.07.33 2.94 0 7.72-2.83 14.89-8.49 21.51-5.65 6.63-12.4 10.33-20.24 11.1-.22-.98-.35-1.97-.35-2.93z" />
                                    </svg>
                                </div>
                                <div className={styles.calendarOptionTextBox}>
                                    <div className={styles.calendarOptionNameRow}>
                                        <span className={styles.calendarOptionName}>Apple Calendar</span>
                                        {deviceType === 'apple' && (
                                            <span className={styles.deviceBadge}>Your Device</span>
                                        )}
                                    </div>
                                    <span className={styles.calendarOptionDesc}>
                                        iPhone, iPad & Mac (.ics)
                                    </span>
                                </div>
                                <Download size={16} className={styles.calendarOptionArrow} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
