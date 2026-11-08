'use client';

import React from 'react';
import { RSVPForm } from '@/app/rsvp/[id]/RSVPForm';
import styles from './hero-image.module.css';

interface HeroMobileScreenProps {
    onInteract?: (isInteracting: boolean) => void;
}

const DEMO_WEDDING_DATA = {
    id: 'demo-hero',
    slug: 'aarav-weds-ananya',
    themeId: 'cmnkf7nv40000g2h3gyu2r9uq',
    groomName: 'Aarav',
    brideName: 'Ananya',
    groomParents: 'Mr. & Mrs. Sharma',
    brideParents: 'Mr. & Mrs. Kapoor',
    invitationMessage: 'Together with their families, Aarav & Ananya invite you to share in the joy of their wedding celebration.',
    rsvpContact: '+91 98765 43210',
    rsvpDeadline: new Date('2026-12-20'),
    events: [
        {
            id: 'evt_mehendi',
            weddingId: 'demo-hero',
            name: 'Mehendi Ceremony',
            eventType: 'Mehendi',
            date: '27-12-2026',
            time: '04:00 PM',
            venue: 'The Royal Palms Resort, Pune',
            mapLink: 'https://maps.google.com',
            description: 'Hands full of mehendi, hearts full of love.',
            allowCompanions: true,
            collectDietary: true,
        },
        {
            id: 'evt_sangeet',
            weddingId: 'demo-hero',
            name: 'Sangeet Night',
            eventType: 'Sangeet',
            date: '27-12-2026',
            time: '08:00 PM',
            venue: 'Grand Imperial Ballroom, Pune',
            mapLink: 'https://maps.google.com',
            description: 'An evening of rhythm, music, and celebration.',
            allowCompanions: true,
            collectDietary: true,
        },
        {
            id: 'evt_wedding',
            weddingId: 'demo-hero',
            name: 'Wedding Ceremony',
            eventType: 'Wedding',
            date: '28-12-2026',
            time: '07:00 PM',
            venue: 'The Palace Lawns, Pune',
            mapLink: 'https://maps.google.com',
            description: 'The auspicious union of two souls and families.',
            allowCompanions: true,
            collectDietary: true,
        },
    ],
};

export const HeroMobileScreen: React.FC<HeroMobileScreenProps> = ({ onInteract }) => {
    return (
        <div
            className={styles.websitePhoneFrame}
            onMouseEnter={() => onInteract?.(true)}
            onMouseLeave={() => onInteract?.(false)}
        >
            {/* Apple Physical Side Hardware Buttons */}
            <div className={styles.phoneButtonAction} aria-hidden="true" />
            <div className={styles.phoneButtonVolumeUp} aria-hidden="true" />
            <div className={styles.phoneButtonVolumeDown} aria-hidden="true" />
            <div className={styles.phoneButtonPower} aria-hidden="true" />

            {/* Apple Precision Dynamic Island */}
            <div className={styles.dynamicIsland} aria-hidden="true">
                <div className={styles.dynamicIslandSensor} />
                <div className={styles.dynamicIslandLens} />
            </div>

            {/* Native High-DPI Razor-Sharp Screen */}
            <div className={styles.websitePhoneScreen}>
                <div className={styles.phoneScreenScrollArea}>
                    <RSVPForm wedding={DEMO_WEDDING_DATA as any} isPreview={true} />
                </div>

                {/* Apple Home Indicator Bar */}
                <div className={styles.phoneHomeIndicator} aria-hidden="true" />
            </div>
        </div>
    );
};


