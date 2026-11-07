'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, Compass, LockOpen, MapPin, RotateCcw, Sparkles } from 'lucide-react';
import { openMapsForVenue, type NormalizedEvent } from '../shared/useWeddingTemplateData';
import styles from './royal-heritage.module.css';

/* ============================================================================
 * 1. HERO SCRATCH-TO-REVEAL ROYAL WEDDING DATE FRAME
 * ============================================================================ */

interface RoyalScratchDateFrameProps {
    formattedDate: string;
    formattedTime?: string;
    venueCity?: string;
    onSaveDate?: () => void;
    reduceMotion?: boolean | null;
}

export function RoyalScratchDateFrame({
    formattedDate,
    formattedTime,
    venueCity,
    onSaveDate,
    reduceMotion,
}: RoyalScratchDateFrameProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const hasStartedScratchRef = useRef(false);
    const strokeCounterRef = useRef(0);

    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    const paintGoldFoil = useCallback(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap || isRevealed) return;

        const rect = wrap.getBoundingClientRect();
        const width = Math.max(240, Math.round(rect.width));
        const height = Math.max(84, Math.round(rect.height));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.globalCompositeOperation = 'source-over';

        // Rich brushed 24K champagne-gold metallic gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#CFA657');
        grad.addColorStop(0.24, '#F1DC9E');
        grad.addColorStop(0.5, '#C99B42');
        grad.addColorStop(0.76, '#F5E4B3');
        grad.addColorStop(1, '#B38430');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Subtle royal lattice / diamond foil embossing
        ctx.strokeStyle = 'rgba(91, 22, 32, 0.14)';
        ctx.lineWidth = 0.8;
        const step = 22;
        for (let x = -height; x < width + height; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + height, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + height, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Inner double-bezel royal border etched on the foil
        ctx.strokeStyle = 'rgba(91, 22, 32, 0.42)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(6, 6, width - 12, height - 12);
        ctx.strokeStyle = 'rgba(255, 252, 240, 0.65)';
        ctx.lineWidth = 0.9;
        ctx.strokeRect(9, 9, width - 18, height - 18);

        // Central etched callout pill on the gold foil
        const pillW = Math.min(width - 36, 290);
        const pillH = 34;
        const pillX = (width - pillW) / 2;
        const pillY = (height - pillH) / 2;

        ctx.fillStyle = 'rgba(72, 16, 24, 0.86)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 999);
        ctx.fill();

        ctx.strokeStyle = '#F3DFAC';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#FFF9EC';
        ctx.font = '600 11px Jost, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦  SCRATCH GOLD SEAL TO REVEAL DATE  ✦', width / 2, height / 2 + 0.5);

        ctx.restore();
    }, [isRevealed]);

    useEffect(() => {
        paintGoldFoil();
        const wrap = wrapRef.current;
        if (!wrap || typeof ResizeObserver === 'undefined') return;
        const ro = new ResizeObserver(() => {
            if (!hasStartedScratchRef.current && !isRevealed) {
                paintGoldFoil();
            }
        });
        ro.observe(wrap);
        return () => ro.disconnect();
    }, [paintGoldFoil, isRevealed]);

    const checkClearedRatio = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            const { width, height } = canvas;
            const img = ctx.getImageData(0, 0, width, height).data;
            let transparentPixels = 0;
            let sampledPixels = 0;
            // Sample every 16th pixel for instant zero-lag measurement
            for (let i = 3; i < img.length; i += 64) {
                sampledPixels++;
                if (img[i] < 90) transparentPixels++;
            }
            if (sampledPixels > 0 && transparentPixels / sampledPixels >= 0.34) {
                setIsRevealed(true);
            }
        } catch {
            // Ignore canvas read issues
        }
    }, [isRevealed]);

    const scratchAt = useCallback(
        (clientX: number, clientY: number) => {
            const canvas = canvasRef.current;
            if (!canvas || isRevealed) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = canvas.width / Math.max(1, rect.width);
            const x = (clientX - rect.left) * dpr;
            const y = (clientY - rect.top) * dpr;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            hasStartedScratchRef.current = true;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 38 * dpr;

            ctx.beginPath();
            if (lastPointRef.current) {
                ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
                ctx.lineTo(x + 0.5, y + 0.5);
            }
            ctx.stroke();

            // Soft feathered outer circle for tactile gold-leaf rub feel
            const radial = ctx.createRadialGradient(x, y, 6 * dpr, x, y, 24 * dpr);
            radial.addColorStop(0, 'rgba(0,0,0,1)');
            radial.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = radial;
            ctx.beginPath();
            ctx.arc(x, y, 24 * dpr, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            lastPointRef.current = { x, y };
            strokeCounterRef.current += 1;
            if (strokeCounterRef.current % 5 === 0) {
                checkClearedRatio();
            }
        },
        [checkClearedRatio, isRevealed]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (isRevealed) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        isDrawingRef.current = true;
        setIsScratching(true);
        lastPointRef.current = null;
        scratchAt(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current || isRevealed) return;
        scratchAt(e.clientX, e.clientY);
    };

    const handlePointerEnd = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        setIsScratching(false);
        lastPointRef.current = null;
        checkClearedRatio();
    };

    const displayDate = formattedDate || 'Auspicious Date To Be Announced';

    return (
        <div className={styles.scratchPlaqueOuter}>
            <div className={styles.scratchHeaderTag}>
                <Sparkles size={12} strokeWidth={2} />
                <span>Shubh Vivah Muhurat</span>
                {!isRevealed && (
                    <button
                        type="button"
                        className={styles.instantRevealChip}
                        onClick={() => setIsRevealed(true)}
                    >
                        Tap to Unveil
                    </button>
                )}
            </div>

            <div
                ref={wrapRef}
                className={clsx(styles.scratchStageWrap, isRevealed && styles.scratchStageRevealed)}
            >
                {/* Revealed Royal Date Underneath */}
                <div className={styles.revealedDateContent}>
                    <div className={styles.revealedDateOrnamentRow} aria-hidden="true">
                        <span className={styles.revealedDateLine} />
                        <span>❖</span>
                        <span className={styles.revealedDateLine} />
                    </div>

                    <div className={styles.revealedMainDate}>{displayDate}</div>

                    {(formattedTime || venueCity) && (
                        <div className={styles.revealedSubMeta}>
                            {formattedTime && <span>{formattedTime}</span>}
                            {formattedTime && venueCity && (
                                <span className={styles.revealedGem} aria-hidden="true">
                                    ✦
                                </span>
                            )}
                            {venueCity && <span>{venueCity}</span>}
                        </div>
                    )}

                    {isRevealed && onSaveDate && (
                        <motion.button
                            type="button"
                            className={styles.revealedSaveBtn}
                            onClick={onSaveDate}
                            initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            <Calendar size={12} strokeWidth={2} />
                            <span>Save Wedding Date</span>
                        </motion.button>
                    )}
                </div>

                {/* Shimmering 24K Gold Scratch Canvas Overlay */}
                <AnimatePresence>
                    {!isRevealed && (
                        <motion.div
                            key="gold-foil-layer"
                            className={clsx(styles.scratchCanvasLayer, isScratching && styles.scratchingActive)}
                            exit={
                                reduceMotion
                                    ? { opacity: 0 }
                                    : { opacity: 0, scale: 1.04, filter: 'blur(6px)' }
                            }
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <canvas
                                ref={canvasRef}
                                className={styles.scratchCanvas}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerEnd}
                                onPointerCancel={handlePointerEnd}
                                aria-label="Scratch gold foil to reveal wedding date"
                            />
                            {!isScratching && !reduceMotion && (
                                <div className={styles.foilShimmerSweep} aria-hidden="true" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Celebratory Golden Sparkles on Reveal */}
                {isRevealed && !reduceMotion && (
                    <div className={styles.revealSparkleBurst} aria-hidden="true">
                        <span className={styles.sparkleDot} style={{ top: '14%', left: '12%' }}>✦</span>
                        <span className={styles.sparkleDot} style={{ top: '18%', right: '10%', animationDelay: '120ms' }}>✧</span>
                        <span className={styles.sparkleDot} style={{ bottom: '16%', left: '16%', animationDelay: '220ms' }}>✧</span>
                        <span className={styles.sparkleDot} style={{ bottom: '14%', right: '14%', animationDelay: '80ms' }}>✦</span>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ============================================================================
 * 2. DESIGNER RAJASTHANI JHAROKHA / MEHRAB PALACE GATE ("SHAHI DARWAZA")
 * ============================================================================ */

interface DoorPalette {
    doorTop: string;
    doorBottom: string;
    accentBadge: string;
}

function getCeremonyDoorPalette(typeOrName: string): DoorPalette {
    const key = typeOrName.toLowerCase();
    if (key.includes('haldi') || key.includes('pithi') || key.includes('tel')) {
        return {
            doorTop: '#8C5210',
            doorBottom: '#583006',
            accentBadge: 'Sacred Turmeric & Marigold',
        };
    }
    if (key.includes('mehendi') || key.includes('mehndi')) {
        return {
            doorTop: '#1E4A31',
            doorBottom: '#102B1C',
            accentBadge: 'Henna Artistry & Folk Melodies',
        };
    }
    if (key.includes('sangeet') || key.includes('cocktail') || key.includes('garba') || key.includes('dandiya')) {
        return {
            doorTop: '#351C47',
            doorBottom: '#1D0E29',
            accentBadge: 'Royal Music & Evening Revelry',
        };
    }
    if (key.includes('reception') || key.includes('walima') || key.includes('dinner') || key.includes('banquet')) {
        return {
            doorTop: '#3E271B',
            doorBottom: '#21130C',
            accentBadge: 'Candlelit Banquet & Toasts',
        };
    }
    return {
        doorTop: '#6B1722',
        doorBottom: '#420B13',
        accentBadge: 'Auspicious Sacred Union',
    };
}

/**
 * Carved 12-petal Rajasthani Sandstone Lotus Rosette ("Padma Chakra")
 * Placed in the left & right upper spandrels of the Mehrab gateway.
 */
function CarvedLotusMedallion({ cx, cy, r = 20 }: { cx: number; cy: number; r?: number }) {
    const petals = Array.from({ length: 12 }, (_, i) => i * 30);
    return (
        <g transform={`translate(${cx}, ${cy})`}>
            <circle r={r + 3.5} fill="none" stroke="#9B6E3B" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
            <circle r={r} fill="#DFC093" stroke="#8C5F30" strokeWidth="1.15" />
            <circle r={r - 3} fill="none" stroke="#FFF6E6" strokeWidth="0.8" opacity="0.75" />
            {petals.map((deg) => (
                <path
                    key={deg}
                    d={`M 0 -3 C 3.2 -8, 3.2 -${r - 4}, 0 -${r - 2.2} C -3.2 -${r - 4}, -3.2 -8, 0 -3 Z`}
                    fill="#ECCFA4"
                    stroke="#8C5F30"
                    strokeWidth="0.85"
                    transform={`rotate(${deg})`}
                />
            ))}
            <circle r="4.5" fill="#C69555" stroke="#7A4F25" strokeWidth="1" />
            <circle r="1.8" fill="#FFF5E2" />
        </g>
    );
}

/**
 * Carved Scalloped Fan / Shell Pillar Capital (at left & right arch spring points)
 */
function CarvedShellCapital({ x, y }: { x: number; y: number }) {
    const ribs = [-44, -22, 0, 22, 44];
    return (
        <g transform={`translate(${x}, ${y})`}>
            <path
                d="M -16 8 C -17 -6, -9 -14, 0 -14 C 9 -14, 17 -6, 16 8 Z"
                fill="#E3C396"
                stroke="#8A5D2E"
                strokeWidth="1.15"
            />
            {ribs.map((deg) => (
                <line
                    key={deg}
                    x1="0"
                    y1="7"
                    x2={Math.sin((deg * Math.PI) / 180) * 12}
                    y2={-Math.cos((deg * Math.PI) / 180) * 11 + 2}
                    stroke="#8A5D2E"
                    strokeWidth="0.85"
                    opacity="0.75"
                />
            ))}
            <rect x="-18" y="8" width="36" height="5" rx="1.5" fill="#D5B07C" stroke="#8A5D2E" strokeWidth="1" />
            <rect x="-15" y="13" width="30" height="4" rx="1" fill="#EBD2AA" stroke="#8A5D2E" strokeWidth="0.9" />
        </g>
    );
}

/**
 * Sculpted Rajasthani / Mughal Multi-Foiled Cusped Mehrab Arch Facade
 * Replaces the plain half-circle with an authentic carved sandstone palace gateway.
 */
function RajasthaniMehrabFacade() {
    const rawId = useId().replace(/:/g, '');
    const stoneGradId = `rh-stone-${rawId}`;
    const depthGradId = `rh-depth-${rawId}`;
    const archShadowId = `rh-arch-shadow-${rawId}`;

    // Outer spandrel rectangle + 9-cusp scalloped Mehrab cutout (even-odd fill rule)
    const frontSpandrelCutoutPath = [
        'M 0 0 H 360 V 168 H 338 V 148',
        'C 346 128, 336 105, 316 102',
        'C 322 82, 306 64, 284 67',
        'C 286 48, 266 36, 244 43',
        'C 238 26, 198 30, 180 15',
        'C 162 30, 122 26, 116 43',
        'C 94 36, 74 48, 76 67',
        'C 54 64, 38 82, 44 102',
        'C 24 105, 14 128, 22 148',
        'V 168 H 0 Z',
    ].join(' ');

    // Crisp scalloped inner border stroke following the 9 cusps
    const cuspedArchTrimPath = [
        'M 22 166 V 148',
        'C 14 128, 24 105, 44 102',
        'C 38 82, 54 64, 76 67',
        'C 74 48, 94 36, 116 43',
        'C 122 26, 162 30, 180 15',
        'C 198 30, 238 26, 244 43',
        'C 266 36, 286 48, 284 67',
        'C 306 64, 322 82, 316 102',
        'C 336 105, 346 128, 338 148',
        'V 166',
    ].join(' ');

    return (
        <div className={styles.jharokhaArchSvgWrap} aria-hidden="true">
            <svg viewBox="0 0 360 168" preserveAspectRatio="xMidYMin meet" className={styles.jharokhaArchSvg}>
                <defs>
                    <linearGradient id={stoneGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F6E8D0" />
                        <stop offset="48%" stopColor="#EAD1AC" />
                        <stop offset="100%" stopColor="#D8B584" />
                    </linearGradient>
                    <linearGradient id={depthGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#9E6D3B" />
                        <stop offset="55%" stopColor="#BA8B57" />
                        <stop offset="100%" stopColor="#8A5C2E" />
                    </linearGradient>
                    <filter id={archShadowId} x="-8%" y="-8%" width="116%" height="124%">
                        <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#2A1208" floodOpacity="0.32" />
                    </filter>
                </defs>

                {/* 1. Recessed 3D Carved Sandstone Arch Thickness (Intrados Layer) */}
                <g transform="translate(180, 8) scale(0.948, 0.965) translate(-180, 0)" filter={`url(#${archShadowId})`}>
                    <path d={frontSpandrelCutoutPath} fill={`url(#${depthGradId})`} fillRule="evenodd" />
                    <path
                        d={cuspedArchTrimPath}
                        fill="none"
                        stroke="#633D1B"
                        strokeWidth="1.6"
                    />
                </g>

                {/* 2. Front Sculpted Royal Sandstone Spandrel Facade */}
                <g filter={`url(#${archShadowId})`}>
                    <path
                        d={frontSpandrelCutoutPath}
                        fill={`url(#${stoneGradId})`}
                        fillRule="evenodd"
                    />
                </g>

                {/* Outer Recessed Rectangular Spandrel Frame Lines */}
                <path
                    d="M 8 6 H 352 V 166 M 8 6 V 166"
                    fill="none"
                    stroke="#9B6E3B"
                    strokeWidth="1.1"
                    opacity="0.75"
                />
                <path
                    d="M 12 10 H 348"
                    fill="none"
                    stroke="#FFF7E8"
                    strokeWidth="0.9"
                    opacity="0.8"
                />

                {/* Delicate Carved Arabesque Vine Scrollwork in Left & Right Spandrels */}
                <path
                    d="M 18 96 C 16 68, 24 30, 52 18 M 88 22 C 110 14, 136 14, 158 18"
                    fill="none"
                    stroke="#9B6E3B"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.55"
                />
                <path
                    d="M 342 96 C 344 68, 336 30, 308 18 M 272 22 C 250 14, 224 14, 202 18"
                    fill="none"
                    stroke="#9B6E3B"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.55"
                />

                {/* Twin Carved Lotus Rosettes in Upper Corners (Inspired by Palace Gateway) */}
                <CarvedLotusMedallion cx={52} cy={42} r={18.5} />
                <CarvedLotusMedallion cx={308} cy={42} r={18.5} />

                {/* Double-Beveled Scalloped Mehrab Arch Trim */}
                <path
                    d={cuspedArchTrimPath}
                    fill="none"
                    stroke="#FFF7E8"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                    opacity="0.72"
                />
                <path
                    d={cuspedArchTrimPath}
                    fill="none"
                    stroke="#8A5D2E"
                    strokeWidth="1.55"
                    strokeLinejoin="round"
                />

                {/* Central Royal Keystone Finial at Apex */}
                <path
                    d="M 180 4 L 185 11 L 180 18 L 175 11 Z"
                    fill="#7A1C28"
                    stroke="#FFF4DC"
                    strokeWidth="0.9"
                />

                {/* Carved Shell / Lotus Capitals at Left & Right Arch Spring-Line */}
                <CarvedShellCapital x={20} y={150} />
                <CarvedShellCapital x={340} y={150} />
            </svg>
        </div>
    );
}

/**
 * Hanging Pierced-Brass Palace Diya Lanterns ("Akhand Deepak") on Fine Chains
 */
function HangingPalaceLanterns() {
    return (
        <div className={styles.hangingBellsRow} aria-hidden="true">
            <svg viewBox="0 0 40 108" className={styles.bellSvgLeft}>
                <line x1="20" y1="0" x2="20" y2="66" stroke="#B6863A" strokeWidth="1.2" strokeDasharray="3 1.5" />
                {/* Pierced Brass Dome */}
                <path
                    d="M12 80 C12 70, 16 66, 20 66 C24 66, 28 70, 28 80 Z"
                    fill="#D7AB59"
                    stroke="#7D551E"
                    strokeWidth="1.1"
                />
                {/* Warm Glowing Diya Flame Inside */}
                <path
                    d="M20 72 C22 75, 22.2 78, 20 79.5 C17.8 78, 18 75, 20 72 Z"
                    fill="#FFF3B8"
                />
                {/* Diya Bowl */}
                <path
                    d="M9 80 H31 L27 86 H13 Z"
                    fill="#C3923E"
                    stroke="#7D551E"
                    strokeWidth="1.1"
                />
                <circle cx="20" cy="89" r="2.2" fill="#B6863A" />
            </svg>

            <svg viewBox="0 0 40 108" className={styles.bellSvgRight}>
                <line x1="20" y1="0" x2="20" y2="66" stroke="#B6863A" strokeWidth="1.2" strokeDasharray="3 1.5" />
                <path
                    d="M12 80 C12 70, 16 66, 20 66 C24 66, 28 70, 28 80 Z"
                    fill="#D7AB59"
                    stroke="#7D551E"
                    strokeWidth="1.1"
                />
                <path
                    d="M20 72 C22 75, 22.2 78, 20 79.5 C17.8 78, 18 75, 20 72 Z"
                    fill="#FFF3B8"
                />
                <path
                    d="M9 80 H31 L27 86 H13 Z"
                    fill="#C3923E"
                    stroke="#7D551E"
                    strokeWidth="1.1"
                />
                <circle cx="20" cy="89" r="2.2" fill="#B6863A" />
            </svg>
        </div>
    );
}

interface InteractiveCeremonyGateProps {
    evt: NormalizedEvent;
    index: number;
    romanNumeral: string;
    isOpen: boolean;
    onToggle: () => void;
    onSaveDate: (evt: NormalizedEvent) => void;
    reduceMotion?: boolean | null;
}

export function InteractiveCeremonyGate({
    evt,
    index,
    romanNumeral,
    isOpen,
    onToggle,
    onSaveDate,
    reduceMotion,
}: InteractiveCeremonyGateProps) {
    const palette = getCeremonyDoorPalette(`${evt.eventType || ''} ${evt.displayTitle}`);

    return (
        <motion.article
            className={clsx(styles.shahiGateOuter, isOpen && styles.shahiGateIsOpen)}
            initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                duration: 0.58,
                delay: Math.min(index * 0.08, 0.32),
                ease: [0.22, 1, 0.36, 1],
            }}
            style={
                {
                    ['--gate-door-top' as string]: palette.doorTop,
                    ['--gate-door-bottom' as string]: palette.doorBottom,
                } as React.CSSProperties
            }
        >
            {/* 1. Carved Sandstone Chhajja Cornice & Bracket Frieze */}
            <div className={styles.jharokhaCornice} aria-hidden="true">
                <div className={styles.jharokhaCorniceTopLedge} />
                <div className={styles.jharokhaCorniceDentils} />
            </div>

            {/* 2. Sculpted Multi-Foiled Cusped Mehrab Gateway Body */}
            <div className={styles.shahiArchCrown}>
                <div className={styles.shahiArchWindow}>
                    {/* Carved Sandstone Multi-Cusped Mehrab Arch + Lotus Spandrels */}
                    <RajasthaniMehrabFacade />

                    {/* Left & Right Fluted Rajasthani Sandstone Columns */}
                    <div className={styles.jharokhaPillarLeft} aria-hidden="true">
                        <span className={styles.pillarBaseCapital} />
                    </div>
                    <div className={styles.jharokhaPillarRight} aria-hidden="true">
                        <span className={styles.pillarBaseCapital} />
                    </div>

                    {/* Swaying Pierced-Brass Palace Diya Lanterns */}
                    <HangingPalaceLanterns />

                    {/* Warm Golden Light Spill on Open */}
                    <div
                        className={clsx(styles.sanctumGlow, isOpen && styles.sanctumGlowActive)}
                        aria-hidden="true"
                    />

                    {/* INNER REVEALED CEREMONY SANCTUM */}
                    <div className={clsx(styles.sanctumInterior, isOpen && styles.sanctumInteriorVisible)}>
                        <div className={styles.sanctumTopTools}>
                            <span className={styles.sanctumRoman}>{romanNumeral}</span>
                            <button
                                type="button"
                                className={styles.closeGateMiniBtn}
                                onClick={onToggle}
                                aria-label={`Close ${evt.displayTitle} gate`}
                            >
                                <RotateCcw size={12} strokeWidth={2} />
                                <span>Close Gate</span>
                            </button>
                        </div>

                        <div className={styles.sanctumBody}>
                            <span className={styles.sanctumKicker}>{palette.accentBadge}</span>
                            <h3 className={styles.ceremonyTitle}>{evt.displayTitle}</h3>

                            {/* Ultra-Visible Maroon & Gold Date Plaque */}
                            <div className={styles.royalDatePlaque}>
                                {evt.weekday && (
                                    <span className={styles.royalDateWeekday}>{evt.weekday}</span>
                                )}
                                <span className={styles.royalDateMain}>
                                    <span className={styles.royalDateGem} aria-hidden="true">
                                        ✦
                                    </span>
                                    <span>{evt.shortDateLabel}</span>
                                    <span className={styles.royalDateGem} aria-hidden="true">
                                        ✦
                                    </span>
                                </span>
                            </div>

                            {evt.description && <p className={styles.ceremonyDesc}>{evt.description}</p>}

                            <div className={styles.ceremonyMetaList}>
                                {evt.formattedTime && (
                                    <div className={styles.ceremonyTimeHighlight}>
                                        <Clock
                                            size={15}
                                            strokeWidth={1.9}
                                            className={styles.ceremonyMetaIcon}
                                        />
                                        <span>{evt.formattedTime}</span>
                                    </div>
                                )}

                                <div className={styles.ceremonyMetaItem}>
                                    <MapPin
                                        size={15}
                                        strokeWidth={1.85}
                                        className={styles.ceremonyMetaIcon}
                                    />
                                    <span className={styles.ceremonyMetaText}>{evt.venueText}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.pavilionActions}>
                            {evt.hasVenueLocation && (
                                <button
                                    type="button"
                                    className={styles.pavilionBtn}
                                    onClick={() => openMapsForVenue(evt.mapLink, evt.venueText)}
                                >
                                    <Compass size={14} strokeWidth={1.75} />
                                    <span>Directions</span>
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.pavilionBtn}
                                onClick={() => onSaveDate(evt)}
                            >
                                <Calendar size={14} strokeWidth={1.75} />
                                <span>Save Date</span>
                            </button>
                        </div>
                    </div>

                    {/* 3D ROYAL DOUBLE DOORS OVERLAY (TUCKED BEHIND CARVED MEHRAB ARCH) */}
                    <div
                        className={clsx(styles.palaceDoorsStage, isOpen && styles.palaceDoorsOpened)}
                        aria-hidden={isOpen}
                    >
                        {/* Left Carved Palace Door */}
                        <div className={clsx(styles.palaceDoorLeaf, styles.palaceDoorLeft)}>
                            <div className={styles.doorCarvedPanel} />
                            <div className={styles.doorCarvedLowerPanel} />
                            <span className={styles.doorBrassStudTop} />
                            <span className={styles.doorBrassStudBottom} />
                        </div>

                        {/* Right Carved Palace Door */}
                        <div className={clsx(styles.palaceDoorLeaf, styles.palaceDoorRight)}>
                            <div className={styles.doorCarvedPanel} />
                            <div className={styles.doorCarvedLowerPanel} />
                            <span className={styles.doorBrassStudTop} />
                            <span className={styles.doorBrassStudBottom} />
                        </div>

                        {/* Interactive Central Royal Seal & Ceremony Callout */}
                        <button
                            type="button"
                            className={styles.gateUnveilTrigger}
                            onClick={onToggle}
                            tabIndex={isOpen ? -1 : 0}
                            aria-expanded={isOpen}
                            aria-label={`Open royal gate to view ${evt.displayTitle} details`}
                        >
                            <span className={styles.closedGateNumeral}>Ceremony {romanNumeral}</span>
                            <span className={styles.closedGateTitle}>{evt.displayTitle}</span>

                            <span className={styles.royalKnockerSeal}>
                                <span className={styles.knockerPulseRing} aria-hidden="true" />
                                <span className={styles.knockerCore}>
                                    <LockOpen size={18} strokeWidth={1.75} />
                                </span>
                            </span>

                            <span className={styles.closedGateDatePreview}>{evt.shortDateLabel}</span>

                            <span className={styles.tapToOpenPill}>
                                <Sparkles size={12} strokeWidth={2} />
                                <span>Tap to Open Palace Gate</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Stepped Royal Sandstone & Marble Plinth */}
            <div className={styles.gatePlinth} aria-hidden="true">
                <div className={styles.gatePlinthInner} />
            </div>
        </motion.article>
    );
}

