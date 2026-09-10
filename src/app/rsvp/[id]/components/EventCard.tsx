'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '../rsvp.module.css';
import { Calendar, Clock, MapPin } from 'lucide-react';

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
}

export const EventCard: React.FC<EventCardProps> = ({ event, coupleNames, index }) => {
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

    return (
        <motion.div
            className={styles.timelineCard}
            initial={{ opacity: 0, y: 22, scale: 0.98, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(index * 0.16, 0.5),
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
                                {event.time.includes('AM') || event.time.includes('PM')
                                    ? event.time
                                    : `${event.time} onwards`}
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

                {/* View Location Action (only if venue is specified) */}
                {hasVenueLocation && (
                    <div className={styles.eventActionButtons}>
                        <motion.button
                            type="button"
                            onClick={handleOpenMaps}
                            className={styles.eventSecondaryBtn}
                            whileTap={{ scale: 0.96 }}
                        >
                            <MapPin size={14} /> View Location on Maps
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
