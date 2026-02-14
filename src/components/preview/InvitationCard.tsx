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

export const InvitationCard = ({ event, theme, groomName, brideName, isPlaceholder, type, customImage, onClick, variant = 'default' }: InvitationCardProps & { variant?: 'default' | 'contract' | 'save-the-date' }) => {
    const isHaldi = event.name?.toLowerCase().includes('haldi');
    const isContract = variant === 'contract';
    const isSaveTheDate = variant === 'save-the-date';

    return (
        <div
            className={styles.invitationCard}
            style={{
                '--theme-primary': theme.colors[1],
                cursor: onClick ? 'pointer' : 'default',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none'
            } as any}
            onClick={onClick}
        >
            <svg viewBox="0 0 600 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                {/* Background Image */}
                {customImage && (
                    <image
                        href={customImage}
                        x="0"
                        y="0"
                        width="600"
                        height="800"
                        preserveAspectRatio="xMidYMid slice"
                    />
                )}

                {/* Content Group */}
                <g textAnchor="middle" fontFamily="serif">
                    {isSaveTheDate ? (
                        /* Save The Date Layout (Design 8) */
                        <g>
                            {/* Masking Rect to hide original text - Color picked to match dark maroon background */}
                            <rect x="40" y="220" width="520" height="500" fill="#3E0E18" rx="10" />

                            {/* Header */}
                            <text x="300" y="280" fill="#FFF" fontSize="42" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Save The Date
                            </text>
                            <text x="300" y="320" fill="#E5E7EB" fontSize="18" fontFamily="var(--font-serif)" fontStyle="italic">
                                to celebrate the wedding of
                            </text>

                            {/* Names */}
                            <text x="300" y="420" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="72" filter="url(#shadow)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>

                            {/* Date */}
                            <text x="300" y="550" fill="#FFF" fontSize="28" fontWeight="600" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.05em' }}>
                                {event.date || '2026-02-01'}
                            </text>
                            <text x="300" y="590" fill="#D1D5DB" fontSize="20" fontFamily="var(--font-serif)">
                                {event.venue || 'Venue details to follow'}
                            </text>

                            {/* Footer */}
                            <text x="300" y="660" fill="#9CA3AF" fontSize="14" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                Formal Invitation to follow
                            </text>
                        </g>

                    ) : isContract ? (
                        /* Contract Card Layout */
                        <g>
                            {/* Names for "Between" section */}
                            <text x="300" y="295" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="52" filter="url(#shadow-sm)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>
                            {/* Signatures at bottom */}
                            <text x="150" y="660" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="32" transform="rotate(-5, 150, 660)">
                                {groomName || 'Groom'}
                            </text>
                            <text x="450" y="660" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="32" transform="rotate(-5, 450, 660)">
                                {brideName || 'Bride'}
                            </text>
                            {/* Date for "On" section - approximate placement */}
                            <text x="300" y="740" fill="#FFF" fontSize="24" fontWeight="600" fontFamily="var(--font-serif)">
                                {event.date || '2026-02-01'}
                            </text>
                        </g>
                    ) : isHaldi ? (
                        <>
                            <text x="300" y="240" fill="#FFF" fontSize="36" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name}
                            </text>
                            <text x="300" y="380" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="72" filter="url(#shadow)">
                                {brideName || 'Bride'}
                                <tspan dx="10" fontSize="36" fontFamily="var(--font-serif)" fontStyle="italic" dy="-10">ke haldi</tspan>
                            </text>
                            <text x="300" y="440" fill="#FFE4B5" fontSize="20" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="300" dy="0">bless the couple with showers of yellow</tspan>
                                <tspan x="300" dy="25">health and happiness</tspan>
                            </text>
                        </>
                    ) : (
                        <>
                            <text x="300" y="240" fill="#FFF" fontSize="36" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name}
                            </text>
                            <text x="300" y="380" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="64" filter="url(#shadow)">
                                {groomName || 'Groom'}
                                <tspan dx="10" fontSize="32" opacity="0.8">&</tspan>
                                <tspan dx="10">{brideName || 'Bride'}</tspan>
                            </text>
                            <text x="300" y="440" fill="#FFE4B5" fontSize="18" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="300" dy="0">Request the honor of your presence to bless the couple</tspan>
                                <tspan x="300" dy="25">with showers of love, health, and happiness.</tspan>
                            </text>
                        </>
                    )}

                    {/* Bottom Details (Only for non-contract cards) */}
                    {!isContract && (event.date || event.time || event.venue || !isPlaceholder) && (
                        <g transform="translate(0, 600)" fill="#FFF" fontSize="22" fontWeight="600">
                            {event.date && (
                                <text x="300" y="0">
                                    <tspan fill="#FFE4B5" fontSize="16" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-25">On</tspan>
                                    <tspan x="300" dy="25">{event.date}</tspan>
                                </text>
                            )}

                            {event.time && (
                                <text x="300" y="80">
                                    <tspan fill="#FFE4B5" fontSize="16" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-25">At</tspan>
                                    <tspan x="300" dy="25">{event.time}</tspan>
                                </text>
                            )}

                            {event.venue && (
                                <text x="300" y="160">
                                    <tspan fill="#FFE4B5" fontSize="16" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-25">Venue</tspan>
                                    <tspan x="300" dy="25" fontSize="20" >{event.venue}</tspan>
                                </text>
                            )}
                        </g>
                    )}
                </g>

                {/* Filters */}
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
                    </filter>
                    <filter id="shadow-sm" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};
