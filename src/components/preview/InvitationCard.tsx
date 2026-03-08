'use client';

import { WeddingEvent } from '@/lib/schemas/wedding-form';
import { Theme } from '@/lib/constants/themes';
import styles from './Preview.module.css';
import { Play } from 'lucide-react';
import Image from 'next/image';

import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface InvitationCardProps {
    event: WeddingEvent;
    theme: Theme;
    groomName: string;
    brideName: string;
    groomParents?: string;
    brideParents?: string;
    welcomeMessage?: string;
    isPlaceholder?: boolean;
    type?: 'image' | 'video';
    customImage?: string;
    onClick?: () => void;
    variant?: 'default' | 'contract' | 'save-the-date';
    className?: string; // Added className to props
    isSecured?: boolean; // Added isSecured to props
}

export const InvitationCard = ({
    event,
    theme,
    groomName,
    brideName,
    groomParents,
    brideParents,
    welcomeMessage,
    isPlaceholder,
    type,
    customImage,
    onClick,
    variant = 'default',
    className,
    isSecured = false
}: InvitationCardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [containerScale, setContainerScale] = useState(1);
    const isHTMLDesign = customImage?.endsWith('.html') || customImage?.includes('item-Wedding_Invitation') && customImage.includes('.html'); // Robust check

    // Handle scaling based on container width
    useEffect(() => {
        if (!isHTMLDesign || !containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                if (width > 0) {
                    setContainerScale(width / 500);
                }
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial measurement
        const initialWidth = containerRef.current.getBoundingClientRect().width;
        if (initialWidth > 0) {
            setContainerScale(initialWidth / 500);
        }

        return () => observer.disconnect();
    }, [isHTMLDesign]);

    // Map user fields to HTML template IDs
    useEffect(() => {
        if (!isHTMLDesign || !iframeRef.current) return;

        const updateContent = () => {
            const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
            if (!doc) return;

            const getDefaultHeading = (eName: string) => {
                const n = (eName || '').toLowerCase();
                if (n.includes('haldi')) return "Haldi Ceremony";
                if (n.includes('mehendi')) return "Mehendi Ceremony";
                if (n.includes('sangeet')) return "Sangeet Ceremoney";
                if (n.includes('wedding')) return "Wedding Ceremony";
                if (n.includes('reception')) return "Reception Ceremony";
                return `${eName || 'Wedding'} Ceremony`;
            };

            const getDefaultWelcome = (eName: string) => {
                const n = (eName || '').toLowerCase();
                if (n.includes('haldi')) return "Bless the couple with showers of yellow health and happiness";
                if (n.includes('mehendi')) return "Join at the mehendi event, with the \"Hands full of mehendi , hearts full of love\"";
                if (n.includes('sangeet')) return "Join us to turn up the volume \"Naach. gaana aur full-on hungama!\"";
                if (n.includes('wedding')) return "We are pleased to invite you to the wedding of";
                if (n.includes('reception')) return "We are pleased to invite you to the reception of";
                return "";
            };

            const displayEventName = event.heading || getDefaultHeading(event.name);
            const displayWelcome = welcomeMessage || event.tagline || getDefaultWelcome(event.name);

            const mapping: Record<string, string | undefined> = {
                'event-name': displayEventName,
                'welcome-message': displayWelcome,
                'groom-name': groomName,
                'bride-name': brideName,
                'groom-parents': groomParents,
                'groom-parent-name': groomParents,
                'bride-parents': brideParents,
                'bride-parent-name': brideParents,
                'event-date': event.date,
                'event-time': event.time,
                'event-venue': event.venue,
                'venue': event.venue
            };

            Object.entries(mapping).forEach(([id, value]) => {
                const el = doc.getElementById(id);
                if (el && value !== undefined && value !== null) {
                    // Use innerHTML but handle line breaks
                    const formattedValue = value.toString().replace(/\n/g, '<br/>');
                    if (el.innerHTML !== formattedValue) {
                        el.innerHTML = formattedValue;
                    }
                }
            });

            // Ensure specific IDs for wedding names are handled if they differ
            const groomParentsEl = doc.getElementById('groom-parents') || doc.getElementById('groom-parent-name');
            if (groomParentsEl && groomParents) groomParentsEl.innerHTML = groomParents;

            const brideParentsEl = doc.getElementById('bride-parents') || doc.getElementById('bride-parent-name');
            if (brideParentsEl && brideParents) brideParentsEl.innerHTML = brideParents;

            // OVERRIDE: Force user input to take priority for main text elements
            const eventNameEl = doc.getElementById('event-name');
            if (eventNameEl && displayEventName) {
                eventNameEl.innerHTML = displayEventName.toString().replace(/\n/g, '<br/>');
            }

            const welcomeMsgEl = doc.getElementById('welcome-message');
            if (welcomeMsgEl && displayWelcome) {
                welcomeMsgEl.innerHTML = displayWelcome.toString().replace(/\n/g, '<br/>');
            }

            // INJECT RUNTIME FIXES (Doesn't touch original file)
            let styleEl = doc.getElementById('runtime-preview-fix');
            if (!styleEl) {
                styleEl = doc.createElement('style');
                styleEl.id = 'runtime-preview-fix';
                doc.head.appendChild(styleEl);
            }
            styleEl.textContent = `
                * { hyphens: none !important; -webkit-hyphens: none !important; }
                .text-overlay { 
                    padding-top: 25vh !important; 
                    padding-bottom: 2vh !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                }
                .welcome-message { 
                    width: 100% !important; 
                    padding: 0 5% !important;
                    margin-bottom: 4vh !important;
                }
            `;
        };

        const currentIframe = iframeRef.current;
        const handleLoad = () => {
            // Try immediately
            updateContent();
            // And retry once after a short delay to ensure assets/fonts are settled
            setTimeout(updateContent, 100);
            setTimeout(updateContent, 500);
        };

        if (currentIframe.contentDocument?.readyState === 'complete') {
            handleLoad();
        } else {
            currentIframe.addEventListener('load', handleLoad);
            return () => currentIframe.removeEventListener('load', handleLoad);
        }
    }, [isHTMLDesign, event, welcomeMessage, groomName, brideName, groomParents, brideParents, customImage]);

    const isHaldi = event.name?.toLowerCase().includes('haldi');
    const isContract = variant === 'contract';
    const isSaveTheDate = variant === 'save-the-date';

    if (isHTMLDesign) {
        return (
            <div
                ref={containerRef}
                className={clsx(styles.invitationCard, className)}
                onClick={onClick}
                style={{
                    cursor: onClick ? 'pointer' : 'default',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'white' // Ensure background is filled
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '500px',
                    height: '800px',
                    transform: `scale(${containerScale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none'
                }}>
                    <iframe
                        ref={iframeRef}
                        src={customImage}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        scrolling="no"
                        title="Invitation Template"
                    />
                </div>
                {isSecured && (
                    <div className={styles.watermark}>
                        <span>NIMANTRAN STUDIO</span>
                        <span>NIMANTRAN STUDIO</span>
                        <span>NIMANTRAN STUDIO</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={styles.invitationCard}
            style={{
                '--theme-primary': '#D4AF37',
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
