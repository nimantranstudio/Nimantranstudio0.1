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

    // Determine theme accent based on event type or name
    const lowerName = eventTitle.toLowerCase();
    let themeBadge = {
        label: 'Ceremony',
        tagClass: styles.tagGeneral,
        iconEmoji: '✨',
    };

    if (lowerName.includes('haldi')) {
        themeBadge = { label: 'Haldi', tagClass: styles.tagHaldi, iconEmoji: '🌼' };
    } else if (lowerName.includes('mehendi') || lowerName.includes('mehndi')) {
        themeBadge = { label: 'Mehendi', tagClass: styles.tagMehendi, iconEmoji: '🌿' };
    } else if (lowerName.includes('sangeet')) {
        themeBadge = { label: 'Sangeet', tagClass: styles.tagSangeet, iconEmoji: '🪕' };
    } else if (lowerName.includes('wedding') || lowerName.includes('phera') || lowerName.includes('shaadi') || lowerName.includes('varmala')) {
        themeBadge = { label: 'Wedding Ceremony', tagClass: styles.tagWedding, iconEmoji: '🪔' };
    } else if (lowerName.includes('reception')) {
        themeBadge = { label: 'Reception', tagClass: styles.tagReception, iconEmoji: '🥂' };
    } else if (lowerName.includes('cocktail')) {
        themeBadge = { label: 'Cocktail Night', tagClass: styles.tagCocktail, iconEmoji: '🍸' };
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
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.5,
                delay: Math.min(index * 0.08, 0.4),
            }}
        >
            {/* Step Number / Node Accent */}
            <div className={styles.timelineNode}>
                <span className={styles.timelineNodeNum}>{index + 1}</span>
            </div>

            <div className={styles.eventCardBody}>
                {/* Event Tag / Badge */}
                <div className={styles.eventCardHeader}>
                    <span className={`${styles.eventThemeTag} ${themeBadge.tagClass}`}>
                        <span className={styles.tagIcon}>{themeBadge.iconEmoji}</span>
                        {themeBadge.label}
                    </span>
                </div>

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
