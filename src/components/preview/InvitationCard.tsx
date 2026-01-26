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

export const InvitationCard = ({ event, theme, groomName, brideName, isPlaceholder, type, customImage, onClick }: InvitationCardProps) => {
    const isHaldi = event.name?.toLowerCase().includes('haldi');

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

                {/* Content Group (Centered text) */}
                <g textAnchor="middle" fontFamily="serif">

                    {/* Event Name (Top) */}
                    {/* Event Name (Top) */}
                    <text x="300" y="240" fill="#FFF" fontSize="36" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                        {event.name}
                    </text>

                    {/* Middle Section (Names & Subtitle) */}
                    {isHaldi ? (
                        <>
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

                    {/* Bottom Details */}
                    {(event.date || event.time || event.venue || !isPlaceholder) && (
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
                </defs>
            </svg>
        </div>
    );
};
