'use client';

import { WeddingEvent } from '@/lib/schemas/wedding-form';
import { Theme } from '@/lib/constants/themes';
import styles from './Preview.module.css';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface InvitationCardProps {
    event: WeddingEvent;
    theme: Theme;
    groomName: string;
    brideName: string;
    isPlaceholder?: boolean;
    type?: 'image' | 'video';
    customImage?: string;
    onClick?: () => void;
}

export const InvitationCard = ({ event, theme, groomName, brideName, isPlaceholder, type, customImage, onClick, variant = 'default' }: InvitationCardProps & { variant?: 'default' | 'contract' | 'save-the-date' | string }) => {
    const eventNameLower = event.name?.toLowerCase() || '';

    // Determine layout type based on variant or event name
    let layoutType = variant;
    if (variant === 'default') {
        if (eventNameLower.includes('haldi')) layoutType = 'haldi';
        else if (eventNameLower.includes('sangeet')) layoutType = 'sangeet';
        else if (eventNameLower.includes('mehndi') || eventNameLower.includes('mehendi')) layoutType = 'mehndi';
        else if (eventNameLower.includes('reception')) layoutType = 'reception';
        else if (eventNameLower.includes('wedding') || eventNameLower.includes('marriage')) layoutType = 'wedding';
        else layoutType = 'wedding';
    }

    const isContract = layoutType === 'contract';
    const isSaveTheDate = layoutType === 'save-the-date';
    const isHaldi = layoutType === 'haldi';
    const isSangeet = layoutType === 'sangeet';
    const isMehndi = layoutType === 'mehndi';
    const isReception = layoutType === 'reception';
    const isWedding = layoutType === 'wedding';

    return (
        <div
            className={styles.invitationCard}
            style={{
                '--theme-primary': theme.colors[1] || '#FFE4B5',
                cursor: onClick ? 'pointer' : 'default',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none'
            } as any}
            onClick={onClick}
        >
            <svg viewBox="0 0 1240 1748" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                {/* Background Image */}
                {customImage && (
                    <image
                        href={customImage}
                        x="0"
                        y="0"
                        width="1240"
                        height="1748"
                        preserveAspectRatio="xMidYMid slice"
                    />
                )}

                {/* Content Group */}
                <g textAnchor="middle" fontFamily="serif">
                    {isSaveTheDate ? (
                        /* Save The Date Layout (Design 8) */
                        <g>
                            {/* Header */}
                            <text x="620" y="500" fill="#FFF" fontSize="85" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Save The Date
                            </text>
                            <text x="620" y="600" fill="#E5E7EB" fontSize="40" fontFamily="var(--font-serif)" fontStyle="italic">
                                to celebrate the wedding of
                            </text>

                            {/* Names */}
                            <text x="620" y="850" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="160" filter="url(#shadow)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>

                            {/* Date */}
                            <text x="620" y="1150" fill="#FFF" fontSize="60" fontWeight="600" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.05em' }}>
                                {event.date || '2026-02-01'}
                            </text>
                            <text x="620" y="1230" fill="#D1D5DB" fontSize="45" fontFamily="var(--font-serif)">
                                {event.venue || 'Venue details to follow'}
                            </text>

                            {/* Footer */}
                            <text x="620" y="1450" fill="#9CA3AF" fontSize="30" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                Formal Invitation to follow
                            </text>
                        </g>

                    ) : isContract ? (
                        /* Contract Card Layout */
                        <g>
                            {/* Names for "Between" section */}
                            <text x="620" y="650" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="120" filter="url(#shadow-sm)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>
                            {/* Signatures at bottom */}
                            <text x="310" y="1450" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="70" transform="rotate(-5, 310, 1450)">
                                {groomName || 'Groom'}
                            </text>
                            <text x="930" y="1450" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="70" transform="rotate(-5, 930, 1450)">
                                {brideName || 'Bride'}
                            </text>
                            {/* Date for "On" section - approximate placement */}
                            <text x="620" y="1620" fill="#FFF" fontSize="50" fontWeight="600" fontFamily="var(--font-serif)">
                                {event.date || '2026-02-01'}
                            </text>
                        </g>
                    ) : isHaldi ? (
                        <>
                            <text x="620" y="550" fill="#FFF" fontSize="80" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name || 'Haldi Ceremony'}
                            </text>
                            <text x="620" y="850" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="150" filter="url(#shadow)">
                                {brideName || 'Bride'}
                                <tspan dx="20" fontSize="75" fontFamily="var(--font-serif)" fontStyle="italic" dy="-20">ke haldi</tspan>
                            </text>
                            <text x="620" y="980" fill="var(--theme-primary)" fontSize="45" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="620" dy="0">bless the couple with showers of yellow</tspan>
                                <tspan x="620" dy="55">health and happiness</tspan>
                            </text>
                        </>
                    ) : isSangeet ? (
                        <>
                            <text x="620" y="550" fill="#FFF" fontSize="80" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name || 'Sangeet Night'}
                            </text>
                            <text x="620" y="850" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="150" filter="url(#shadow)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>
                            <text x="620" y="980" fill="var(--theme-primary)" fontSize="45" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="620" dy="0">Join us for a musical night of dancing</tspan>
                                <tspan x="620" dy="55">and celebration!</tspan>
                            </text>
                        </>
                    ) : isMehndi ? (
                        <>
                            <text x="620" y="550" fill="#FFF" fontSize="80" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name || 'Mehndi Ceremony'}
                            </text>
                            <text x="620" y="850" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="150" filter="url(#shadow)">
                                {brideName || 'Bride'}
                                <tspan dx="20" fontSize="75" fontFamily="var(--font-serif)" fontStyle="italic" dy="-20">ki mehendi</tspan>
                            </text>
                            <text x="620" y="980" fill="var(--theme-primary)" fontSize="45" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="620" dy="0">Join us as the bride gets adorned</tspan>
                                <tspan x="620" dy="55">with beautiful henna</tspan>
                            </text>
                        </>
                    ) : isReception ? (
                        <>
                            <text x="620" y="550" fill="#FFF" fontSize="80" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name || 'Wedding Reception'}
                            </text>
                            <text x="620" y="850" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="150" filter="url(#shadow)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>
                            <text x="620" y="980" fill="var(--theme-primary)" fontSize="45" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="620" dy="0">Join us in celebrating the newly weds</tspan>
                                <tspan x="620" dy="55">with an evening of dinner and dancing</tspan>
                            </text>
                        </>
                    ) : (
                        /* Default Wedding */
                        <>
                            <text x="620" y="550" fill="#FFF" fontSize="80" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name || 'Wedding Ceremony'}
                            </text>
                            <text x="620" y="850" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="140" filter="url(#shadow)">
                                {groomName || 'Groom'}
                                <tspan dx="25" fontSize="70" opacity="0.8">&</tspan>
                                <tspan dx="25">{brideName || 'Bride'}</tspan>
                            </text>
                            <text x="620" y="980" fill="var(--theme-primary)" fontSize="40" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="620" dy="0">Request the honor of your presence to bless the couple</tspan>
                                <tspan x="620" dy="55">with showers of love, health, and happiness.</tspan>
                            </text>
                        </>
                    )}

                    {/* Bottom Details (Only for non-contract and non-save-the-date cards) */}
                    {!isContract && !isSaveTheDate && (event.date || event.time || event.venue || !isPlaceholder) && (
                        <g transform="translate(0, 1310)" fill="#FFF" fontSize="48" fontWeight="600">
                            {event.date && (
                                <text x="620" y="0">
                                    <tspan fill="var(--theme-primary)" fontSize="35" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-55">On</tspan>
                                    <tspan x="620" dy="55">{event.date}</tspan>
                                </text>
                            )}

                            {event.time && (
                                <text x="620" y="175">
                                    <tspan fill="var(--theme-primary)" fontSize="35" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-55">At</tspan>
                                    <tspan x="620" dy="55">{event.time}</tspan>
                                </text>
                            )}

                            {event.venue && (
                                <text x="620" y="350">
                                    <tspan fill="var(--theme-primary)" fontSize="35" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-55">Venue</tspan>
                                    <tspan x="620" dy="55" fontSize="42">{event.venue}</tspan>
                                </text>
                            )}
                        </g>
                    )}
                </g>

                {/* Filters */}
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                    </filter>
                    <filter id="shadow-sm" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};
