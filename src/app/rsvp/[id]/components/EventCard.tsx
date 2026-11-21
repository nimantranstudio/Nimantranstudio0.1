'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../rsvp.module.css';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDisplayTime } from '@/lib/format-date';
import { AddToCalendarModal } from './AddToCalendarModal';

/** Per-wedding display options (Wedding.siteOptions). All off by default. */
export interface WeddingSiteOptions {
    /** List the itinerary in date + time order instead of the stored order. */
    sortEventsByDate?: boolean;
    /** Label the maps button "Get Directions". */
    eventGetDirections?: boolean;
    /** Show an "Add to Calendar" button on every event card. */
    eventAddToCalendar?: boolean;
}

export function readSiteOptions(raw: unknown): WeddingSiteOptions {
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as WeddingSiteOptions) : {};
}

/** Start of an event in local time from "YYYY-MM-DD" / "DD-MM-YYYY" plus "HH:MM" / "h:mm AM". */
export function parseEventStart(date?: string, time?: string): Date | null {
    const d = (date || '').trim();
    if (!d) return null;
    let y: number;
    let m: number;
    let day: number;
    let match = d.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
        [y, m, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    } else if ((match = d.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) {
        [day, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
    } else {
        const parsed = new Date(d);
        if (Number.isNaN(parsed.getTime())) return null;
        [y, m, day] = [parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate()];
    }
    let hh = 0;
    let mm = 0;
    const t = (time || '').trim().match(/^(\d{1,2})[:.](\d{2})\s*([ap]\.?m\.?)?/i);
    if (t) {
        hh = Number(t[1]) % 24;
        mm = Number(t[2]);
        const ampm = t[3]?.toLowerCase().replace(/\./g, '');
        if (ampm === 'pm' && hh < 12) hh += 12;
        if (ampm === 'am' && hh === 12) hh = 0;
    }
    const out = new Date(y, m - 1, day, hh, mm);
    return Number.isNaN(out.getTime()) ? null : out;
}

/** Events in date + time order; events without a readable date keep their order at the end. */
export function sortEventsByDate<T extends { date?: string; time?: string }>(events: T[]): T[] {
    return events
        .map((e, i) => ({ e, i, t: parseEventStart(e.date, e.time)?.getTime() }))
        .sort((a, b) => {
            if (a.t === undefined && b.t === undefined) return a.i - b.i;
            if (a.t === undefined) return 1;
            if (b.t === undefined) return -1;
            return a.t - b.t || a.i - b.i;
        })
        .map(({ e }) => e);
}

export interface WeddingEventItem {
    id: string;
    name: string;
    eventName?: string;
    date?: string;
    time?: string;
    venue?: string;
    venueName?: string;
    address?: string;
    description?: string;
    eventType?: string;
    mapLink?: string;
}

interface EventCardProps {
    event: WeddingEventItem;
    coupleNames: string;
    index: number;
    options?: WeddingSiteOptions;
}

export const EventCard: React.FC<EventCardProps> = ({ event, coupleNames, index, options = {} }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const eventTitle = event.eventName || event.name || 'Ceremony';
    const venueText = event.venue || event.venueName || event.address || 'Venue details to follow';
    
    // Formatting date
    let formattedDate = 'Date to be announced';
    if (event.date && event.date.trim()) {
        try {
            const d = new Date(event.date);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });
            } else {
                formattedDate = event.date;
            }
        } catch {
            formattedDate = event.date;
        }
    }

    const handleOpenMaps = () => {
        if (event.mapLink && event.mapLink.startsWith('http')) {
            window.open(event.mapLink, '_blank');
            return;
        }
        if (venueText && venueText !== 'Venue details to follow') {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueText)}`, '_blank');
        }
    };

    const hasVenueLocation = venueText && venueText.trim() && venueText !== 'Venue details to follow';

    // Per-event calendar entry (only built when the wedding turns the button on).
    const eventStart = options.eventAddToCalendar ? parseEventStart(event.date, event.time) : null;
    const calendarData = eventStart
        ? {
              title: `${eventTitle} — ${coupleNames}`,
              description: [event.description, typeof window !== 'undefined' ? `Invitation: ${window.location.href}` : '']
                  .filter(Boolean)
                  .join('\n\n'),
              location: hasVenueLocation ? venueText : '',
              startDate: eventStart,
              endDate: new Date(eventStart.getTime() + 3 * 60 * 60 * 1000),
          }
        : null;
    const showActions = Boolean(hasVenueLocation || calendarData);

    return (
        <motion.div
            className={styles.timelineCard}
            initial={{ opacity: 0, y: 16, scale: 0.98, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(index * 0.08, 0.3),
            }}
        >
            <div className={styles.eventCardBody}>
                {/* Event Title */}
                <h3 className={styles.eventCardTitle}>{eventTitle}</h3>

                {/* Description Quote if provided */}
                {event.description && (
                    <p className={styles.eventCardDesc}>{event.description}</p>
                )}

                {/* Date & Time details */}
                <div className={styles.eventDetailsList}>
                    <div className={styles.eventDetailRow}>
                        <Calendar size={15} className={styles.eventDetailIcon} />
                        <span className={styles.eventDetailText}>{formattedDate}</span>
                    </div>

                    {event.time && (
                        <div className={styles.eventDetailRow}>
                            <Clock size={15} className={styles.eventDetailIcon} />
                            <span className={styles.eventDetailText}>
                                {/* Stored as 24h ("15:00"); guests read 12h. formatDisplayTime
                                    returns the value untouched if it already carries am/pm. */}
                                {`${formatDisplayTime(event.time)} onwards`}
                            </span>
                        </div>
                    )}

                    {venueText && (
                        <div className={styles.eventDetailRow}>
                            <MapPin size={15} className={styles.eventDetailIcon} />
                            <span className={styles.eventDetailText}>{venueText}</span>
                        </div>
                    )}
                </div>

                {/* Location (and, when enabled, calendar) actions */}
                {showActions && (
                    <div
                        className={`${styles.eventActionButtons} ${calendarData && hasVenueLocation ? styles.eventActionPair : ''}`}
                    >
                        {hasVenueLocation && (
                            <motion.button
                                type="button"
                                onClick={handleOpenMaps}
                                className={styles.eventSecondaryBtn}
                                whileTap={{ scale: 0.96 }}
                            >
                                <MapPin size={14} /> {options.eventGetDirections ? 'Get Directions' : 'View Location on Maps'}
                            </motion.button>
                        )}
                        {calendarData && (
                            <motion.button
                                type="button"
                                onClick={() => setShowCalendar(true)}
                                className={styles.eventSecondaryBtn}
                                whileTap={{ scale: 0.96 }}
                            >
                                <Calendar size={14} /> Add to Calendar
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
            {calendarData && (
                <AddToCalendarModal
                    isOpen={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    eventData={calendarData}
                />
            )}
        </motion.div>
    );
};
