'use client';

import React from 'react';
import styles from './IntricateMandala.module.css';

export interface IntricateMandalaProps {
    className?: string;
    size?: number | string;
    color?: string;
    opacity?: number;
    rotationSpeed?: number; // duration in seconds (default: 70s)
    position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left' | 'center' | 'relative';
    idPrefix?: string;
}

export const IntricateMandalaSvg: React.FC<{ idPrefix?: string; color?: string; className?: string }> = ({
    idPrefix = 'mandala-svg',
    className = ''
}) => {
    const goldGradId = `${idPrefix}-gold-grad`;
    const glowFilterId = `${idPrefix}-glow`;

    return (
        <svg
            viewBox="0 0 500 500"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBF2B7" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#D4AF37" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#B38B28" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7C5D14" stopOpacity="0.7" />
                </linearGradient>
                <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#D4AF37" floodOpacity="0.35" />
                </filter>
            </defs>

            {/* Concentric Border Rings */}
            <circle cx="250" cy="250" r="244" stroke={`url(#${goldGradId})`} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />
            <circle cx="250" cy="250" r="238" stroke={`url(#${goldGradId})`} strokeWidth="0.5" opacity="0.6" />
            <circle cx="250" cy="250" r="230" stroke={`url(#${goldGradId})`} strokeWidth="1.2" strokeDasharray="1 3" opacity="0.8" />
            <circle cx="250" cy="250" r="222" stroke={`url(#${goldGradId})`} strokeWidth="0.6" opacity="0.5" />

            {/* 48 Outer Pearl Drops */}
            {Array.from({ length: 48 }).map((_, i) => {
                const deg = (i * 360) / 48;
                return (
                    <circle
                        key={`outer-pearl-${i}`}
                        cx="250"
                        cy="10"
                        r="2"
                        fill={`url(#${goldGradId})`}
                        transform={`rotate(${deg} 250 250)`}
                        opacity="0.85"
                    />
                );
            })}

            {/* 16 Grand Royal Lotus Petals */}
            {Array.from({ length: 16 }).map((_, i) => {
                const deg = (i * 360) / 16;
                return (
                    <g key={`grand-petal-${i}`} transform={`rotate(${deg} 250 250)`}>
                        <path
                            d="M250 20 C292 75 288 145 250 180 C212 145 208 75 250 20 Z"
                            stroke={`url(#${goldGradId})`}
                            strokeWidth="1"
                            fill={`url(#${goldGradId})`}
                            fillOpacity="0.03"
                        />
                        <path
                            d="M250 42 C275 88 270 138 250 170 C230 138 225 88 250 42 Z"
                            stroke={`url(#${goldGradId})`}
                            strokeWidth="0.5"
                            strokeDasharray="3 2"
                            opacity="0.8"
                        />
                        <line x1="250" y1="42" x2="250" y2="170" stroke={`url(#${goldGradId})`} strokeWidth="0.4" opacity="0.6" />
                        <circle cx="250" cy="30" r="2.2" fill={`url(#${goldGradId})`} opacity="0.9" />
                        <circle cx="250" cy="22" r="1.2" fill={`url(#${goldGradId})`} opacity="0.75" />
                    </g>
                );
            })}

            {/* 16 Intermediate Foliate Leaves */}
            {Array.from({ length: 16 }).map((_, i) => {
                const deg = (i * 360) / 16 + 11.25;
                return (
                    <g key={`inter-leaf-${i}`} transform={`rotate(${deg} 250 250)`}>
                        <path
                            d="M250 48 C274 85 268 130 250 162 C232 130 226 85 250 48 Z"
                            stroke={`url(#${goldGradId})`}
                            strokeWidth="0.75"
                            fill={`url(#${goldGradId})`}
                            fillOpacity="0.04"
                        />
                        <circle cx="250" cy="58" r="1.8" fill={`url(#${goldGradId})`} opacity="0.85" />
                    </g>
                );
            })}

            {/* 32 Jali Chevron Trefoils */}
            {Array.from({ length: 32 }).map((_, i) => {
                const deg = (i * 360) / 32;
                return (
                    <g key={`jali-${i}`} transform={`rotate(${deg} 250 250)`}>
                        <path d="M250 100 L256 118 L250 136 L244 118 Z" stroke={`url(#${goldGradId})`} strokeWidth="0.5" opacity="0.7" />
                        <circle cx="250" cy="118" r="1" fill={`url(#${goldGradId})`} opacity="0.6" />
                    </g>
                );
            })}

            {/* Rings & Fluted Gear */}
            <circle cx="250" cy="250" r="138" stroke={`url(#${goldGradId})`} strokeWidth="0.75" strokeDasharray="4 6" opacity="0.65" />
            <circle cx="250" cy="250" r="118" stroke={`url(#${goldGradId})`} strokeWidth="0.6" opacity="0.5" />
            {Array.from({ length: 64 }).map((_, i) => {
                const deg = (i * 360) / 64;
                return (
                    <circle
                        key={`gear-dot-${i}`}
                        cx="250"
                        cy="128"
                        r="0.9"
                        fill={`url(#${goldGradId})`}
                        transform={`rotate(${deg} 250 250)`}
                        opacity="0.75"
                    />
                );
            })}

            {/* 16 Paisley / Ambia Motifs */}
            {Array.from({ length: 16 }).map((_, i) => {
                const deg = (i * 360) / 16;
                return (
                    <g key={`paisley-${i}`} transform={`rotate(${deg} 250 250)`}>
                        <path
                            d="M250 136 C272 160 272 184 250 208 C228 184 228 160 250 136"
                            stroke={`url(#${goldGradId})`}
                            strokeWidth="0.65"
                            fill={`url(#${goldGradId})`}
                            fillOpacity="0.06"
                        />
                        <circle cx="250" cy="164" r="2.2" fill={`url(#${goldGradId})`} opacity="0.8" />
                    </g>
                );
            })}

            {/* 24 Sunburst Star Rays */}
            {Array.from({ length: 24 }).map((_, i) => {
                const deg = (i * 360) / 24;
                return (
                    <g key={`sunburst-${i}`} transform={`rotate(${deg} 250 250)`}>
                        <path
                            d="M250 172 L256 188 L250 204 L244 188 Z"
                            stroke={`url(#${goldGradId})`}
                            strokeWidth="0.5"
                            fill={`url(#${goldGradId})`}
                            fillOpacity="0.1"
                        />
                        <line x1="250" y1="172" x2="250" y2="184" stroke={`url(#${goldGradId})`} strokeWidth="0.5" opacity="0.8" />
                    </g>
                );
            })}

            {/* Rings */}
            <circle cx="250" cy="250" r="44" stroke={`url(#${goldGradId})`} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.75" />
            <circle cx="250" cy="250" r="36" stroke={`url(#${goldGradId})`} strokeWidth="0.5" opacity="0.5" />

            {/* 8 Core Sacred Lotus Petals */}
            {Array.from({ length: 8 }).map((_, i) => {
                const deg = (i * 360) / 8;
                return (
                    <g key={`core-petal-${i}`} transform={`rotate(${deg} 250 250)`}>
                        <path
                            d="M250 208 C262 222 262 236 250 246 C238 236 238 222 250 208 Z"
                            fill={`url(#${goldGradId})`}
                            fillOpacity="0.18"
                            stroke={`url(#${goldGradId})`}
                            strokeWidth="0.75"
                        />
                        <circle cx="250" cy="216" r="1.5" fill={`url(#${goldGradId})`} opacity="0.9" />
                    </g>
                );
            })}

            {/* Central Bindu Core */}
            <circle cx="250" cy="250" r="22" stroke={`url(#${goldGradId})`} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />
            <circle cx="250" cy="250" r="14" fill={`url(#${goldGradId})`} fillOpacity="0.25" stroke={`url(#${goldGradId})`} strokeWidth="0.5" />
            <circle cx="250" cy="250" r="7" fill={`url(#${goldGradId})`} opacity="0.85" />
            <circle cx="250" cy="250" r="2.5" fill="#FFFDF0" opacity="0.95" />
        </svg>
    );
};

export function getIntricateMandalaSvgHtml(idPrefix = 'mandala-bg', color = '#D4AF37'): string {
    const goldGradId = `${idPrefix}-gold-grad`;
    const glowFilterId = `${idPrefix}-glow`;

    let outerBeads = '';
    for (let i = 0; i < 48; i++) {
        const deg = (i * 360) / 48;
        outerBeads += `<circle cx="250" cy="10" r="2" fill="url(#${goldGradId})" transform="rotate(${deg} 250 250)" opacity="0.85"/>`;
    }

    let grandPetals = '';
    for (let i = 0; i < 16; i++) {
        const deg = (i * 360) / 16;
        grandPetals += `
        <g transform="rotate(${deg} 250 250)">
            <path d="M250 20 C292 75 288 145 250 180 C212 145 208 75 250 20 Z" stroke="url(#${goldGradId})" stroke-width="1" fill="url(#${goldGradId})" fill-opacity="0.03"/>
            <path d="M250 42 C275 88 270 138 250 170 C230 138 225 88 250 42 Z" stroke="url(#${goldGradId})" stroke-width="0.5" stroke-dasharray="3 2" opacity="0.8"/>
            <line x1="250" y1="42" x2="250" y2="170" stroke="url(#${goldGradId})" stroke-width="0.4" opacity="0.6"/>
            <circle cx="250" cy="30" r="2.2" fill="url(#${goldGradId})" opacity="0.9"/>
            <circle cx="250" cy="22" r="1.2" fill="url(#${goldGradId})" opacity="0.75"/>
        </g>`;
    }

    let interLeaves = '';
    for (let i = 0; i < 16; i++) {
        const deg = (i * 360) / 16 + 11.25;
        interLeaves += `
        <g transform="rotate(${deg} 250 250)">
            <path d="M250 48 C274 85 268 130 250 162 C232 130 226 85 250 48 Z" stroke="url(#${goldGradId})" stroke-width="0.75" fill="url(#${goldGradId})" fill-opacity="0.04"/>
            <circle cx="250" cy="58" r="1.8" fill="url(#${goldGradId})" opacity="0.85"/>
        </g>`;
    }

    let jaliArches = '';
    for (let i = 0; i < 32; i++) {
        const deg = (i * 360) / 32;
        jaliArches += `
        <g transform="rotate(${deg} 250 250)">
            <path d="M250 100 L256 118 L250 136 L244 118 Z" stroke="url(#${goldGradId})" stroke-width="0.5" opacity="0.7"/>
            <circle cx="250" cy="118" r="1" fill="url(#${goldGradId})" opacity="0.6"/>
        </g>`;
    }

    let gearDots = '';
    for (let i = 0; i < 64; i++) {
        const deg = (i * 360) / 64;
        gearDots += `<circle cx="250" cy="128" r="0.9" fill="url(#${goldGradId})" transform="rotate(${deg} 250 250)" opacity="0.75"/>`;
    }

    let paisleyMotifs = '';
    for (let i = 0; i < 16; i++) {
        const deg = (i * 360) / 16;
        paisleyMotifs += `
        <g transform="rotate(${deg} 250 250)">
            <path d="M250 136 C272 160 272 184 250 208 C228 184 228 160 250 136" stroke="url(#${goldGradId})" stroke-width="0.65" fill="url(#${goldGradId})" fill-opacity="0.06"/>
            <circle cx="250" cy="164" r="2.2" fill="url(#${goldGradId})" opacity="0.8"/>
        </g>`;
    }

    let sunburstRays = '';
    for (let i = 0; i < 24; i++) {
        const deg = (i * 360) / 24;
        sunburstRays += `
        <g transform="rotate(${deg} 250 250)">
            <path d="M250 172 L256 188 L250 204 L244 188 Z" stroke="url(#${goldGradId})" stroke-width="0.5" fill="url(#${goldGradId})" fill-opacity="0.1"/>
            <line x1="250" y1="172" x2="250" y2="184" stroke="url(#${goldGradId})" stroke-width="0.5" opacity="0.8"/>
        </g>`;
    }

    let corePetals = '';
    for (let i = 0; i < 8; i++) {
        const deg = (i * 360) / 8;
        corePetals += `
        <g transform="rotate(${deg} 250 250)">
            <path d="M250 208 C262 222 262 236 250 246 C238 236 238 222 250 208 Z" fill="url(#${goldGradId})" fill-opacity="0.18" stroke="url(#${goldGradId})" stroke-width="0.75"/>
            <circle cx="250" cy="216" r="1.5" fill="url(#${goldGradId})" opacity="0.9"/>
        </g>`;
    }

    return `
    <svg viewBox="0 0 500 500" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" class="intricate-mandala-svg">
        <defs>
            <linearGradient id="${goldGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FBF2B7" stop-opacity="0.95" />
                <stop offset="35%" stop-color="#D4AF37" stop-opacity="0.85" />
                <stop offset="70%" stop-color="#B38B28" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#7C5D14" stop-opacity="0.7" />
            </linearGradient>
            <filter id="${glowFilterId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#D4AF37" flood-opacity="0.35" />
            </filter>
        </defs>

        <circle cx="250" cy="250" r="244" stroke="url(#${goldGradId})" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.7" />
        <circle cx="250" cy="250" r="238" stroke="url(#${goldGradId})" stroke-width="0.5" opacity="0.6" />
        <circle cx="250" cy="250" r="230" stroke="url(#${goldGradId})" stroke-width="1.2" stroke-dasharray="1 3" opacity="0.8" />
        <circle cx="250" cy="250" r="222" stroke="url(#${goldGradId})" stroke-width="0.6" opacity="0.5" />

        ${outerBeads}
        ${grandPetals}
        ${interLeaves}
        ${jaliArches}

        <circle cx="250" cy="250" r="138" stroke="url(#${goldGradId})" stroke-width="0.75" stroke-dasharray="4 6" opacity="0.65" />
        <circle cx="250" cy="250" r="118" stroke="url(#${goldGradId})" stroke-width="0.6" opacity="0.5" />
        ${gearDots}

        ${paisleyMotifs}
        ${sunburstRays}

        <circle cx="250" cy="250" r="44" stroke="url(#${goldGradId})" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.75" />
        <circle cx="250" cy="250" r="36" stroke="url(#${goldGradId})" stroke-width="0.5" opacity="0.5" />

        ${corePetals}

        <circle cx="250" cy="250" r="22" stroke="url(#${goldGradId})" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.8" />
        <circle cx="250" cy="250" r="14" fill="url(#${goldGradId})" fill-opacity="0.25" stroke="url(#${goldGradId})" stroke-width="0.5" />
        <circle cx="250" cy="250" r="7" fill="url(#${goldGradId})" opacity="0.85" />
        <circle cx="250" cy="250" r="2.5" fill="#FFFDF0" opacity="0.95" />
    </svg>`;
}

export const IntricateMandala: React.FC<IntricateMandalaProps> = ({
    className = '',
    size = '65%',
    color = '#D4AF37',
    opacity = 0.35,
    rotationSpeed = 70,
    position = 'bottom-left',
    idPrefix = 'react-mandala'
}) => {
    const positionClass = 
        position === 'bottom-left' ? styles.bottomLeft :
        position === 'bottom-right' ? styles.bottomRight :
        position === 'top-right' ? styles.topRight :
        position === 'top-left' ? styles.topLeft :
        position === 'center' ? styles.center : '';

    return (
        <div
            className={`${styles.mandalaContainer} ${positionClass} ${className}`}
            style={{
                width: typeof size === 'number' ? `${size}px` : size,
                opacity,
                color,
                animationDuration: `${rotationSpeed}s`
            }}
            aria-hidden="true"
        >
            <IntricateMandalaSvg idPrefix={idPrefix} color={color} />
        </div>
    );
};

export default IntricateMandala;
