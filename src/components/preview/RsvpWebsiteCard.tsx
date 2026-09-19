'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWeddingStore } from '@/store/wedding-store';
import { RSVPForm } from '@/app/rsvp/[id]/RSVPForm';

interface RsvpWebsiteCardProps {
    weddingId?: string | null;
    groomName?: string;
    brideName?: string;
    events?: any[];
    primaryDate?: string;
    primaryTime?: string;
    venue?: string;
    isInteractive?: boolean;
    className?: string;
}

export const RsvpWebsiteCard: React.FC<RsvpWebsiteCardProps> = ({
    weddingId: initialWeddingId,
    groomName = 'Groom',
    brideName = 'Bride',
    events = [],
    primaryDate = '',
    primaryTime = '',
    venue = '',
    isInteractive = false,
    className = '',
}) => {
    const { lastSavedWeddingId } = useWeddingStore();
    const [resolvedWeddingId, setResolvedWeddingId] = useState<string | null>(
        initialWeddingId || lastSavedWeddingId || null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [hasIframeError, setHasIframeError] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [dimensions, setDimensions] = useState({ width: 390, height: 693 });

    // Dynamically resolve wedding ID if not provided as prop
    useEffect(() => {
        if (initialWeddingId) {
            setResolvedWeddingId(initialWeddingId);
            return;
        }
        if (lastSavedWeddingId) {
            setResolvedWeddingId(lastSavedWeddingId);
            return;
        }

        let isCancelled = false;
        async function fetchDynamicWedding() {
            try {
                // 1. Try authenticated user's current wedding
                const currentRes = await fetch('/api/wedding/current');
                if (currentRes.ok) {
                    const currentData = await currentRes.json();
                    if (!isCancelled && currentData.wedding?.id) {
                        setResolvedWeddingId(currentData.wedding.id);
                        return;
                    }
                }

                // 2. Try latest created wedding in database
                const latestRes = await fetch('/api/wedding/latest');
                if (latestRes.ok) {
                    const latestData = await latestRes.json();
                    if (!isCancelled && latestData.wedding?.id) {
                        setResolvedWeddingId(latestData.wedding.id);
                        return;
                    }
                }
            } catch (err) {
                console.error('Error resolving dynamic wedding for preview:', err);
            }
        }

        fetchDynamicWedding();
        return () => {
            isCancelled = true;
        };
    }, [initialWeddingId, lastSavedWeddingId]);

    // Compute responsive scale to fit authentic 390px mobile viewport into any container
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateDimensions = () => {
            if (!container) return;
            const rect = container.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const targetWidth = 390;
                const newScale = rect.width / targetWidth;
                setScale(newScale);
                setDimensions({
                    width: targetWidth,
                    height: rect.height / newScale,
                });
            }
        };

        updateDimensions();

        const ro = new ResizeObserver(updateDimensions);
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    const targetId = resolvedWeddingId || 'latest';
    const iframeSrc = `/rsvp/${targetId}?preview=true`;

    // Fallback wedding data structure if database is completely empty or iframe errors
    const fallbackWeddingData = {
        id: 'preview',
        groomName: groomName || 'Vivek Mhatre',
        brideName: brideName || 'Priyanka',
        groomParents: '',
        brideParents: '',
        invitationMessage: 'Together with our families, we invite you to celebrate our wedding.',
        events: events.length > 0 ? events : [
            {
                id: 'wedding-ceremony',
                name: 'Wedding Ceremony',
                date: primaryDate || '2026-11-20',
                time: primaryTime || '7:00 PM',
                venue: venue || 'The Grand Palace',
                eventType: 'Wedding',
                description: 'The auspicious union',
            }
        ],
    };

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: '#FAF7F2',
                borderRadius: 'inherit',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Loading Indicator */}
            {isLoading && !hasIframeError && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'radial-gradient(ellipse at center, #FFFDF9 0%, #F5EFE6 100%)',
                        zIndex: 10,
                        gap: '10px',
                        padding: '1rem',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid rgba(197, 160, 89, 0.25)',
                            borderTopColor: '#C5A059',
                            animation: 'spin 0.8s linear infinite',
                        }}
                    />
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-sans)',
                            letterSpacing: '0.06em',
                            color: '#8C6D34',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                        }}
                    >
                        Loading Live Wedding Website
                    </span>
                </div>
            )}

            {/* Live Real RSVP Website rendered via Scaled Responsive iframe */}
            {!hasIframeError ? (
                <iframe
                    key={`rsvp-frame-${targetId}-${iframeKey}`}
                    src={iframeSrc}
                    title="Real Wedding Website & RSVP"
                    allow="autoplay"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasIframeError(true);
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        border: 'none',
                        pointerEvents: isInteractive ? 'auto' : 'none',
                        userSelect: isInteractive ? 'auto' : 'none',
                        borderRadius: 'inherit',
                    }}
                />
            ) : (
                /* In case iframe fails, render actual RSVPForm component directly */
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        overflowY: isInteractive ? 'auto' : 'hidden',
                        pointerEvents: isInteractive ? 'auto' : 'none',
                    }}
                >
                    <RSVPForm wedding={fallbackWeddingData} isPreview={true} />
                </div>
            )}
        </div>
    );
};
