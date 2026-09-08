'use client';

import React, { useEffect, useState } from 'react';

// Realistic organic petal silhouettes
const RosePetalCurled = ({ color1, color2 }: { color1: string; color2: string }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))' }}>
        <defs>
            <linearGradient id={`petalGrad-${color1.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color1} />
                <stop offset="60%" stopColor={color2} />
                <stop offset="100%" stopColor={color1} stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id={`petalHighlight-${color1.replace('#', '')}`} x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
        </defs>
        {/* Main Petal Body */}
        <path
            d="M20 4C20 4 33 11 32 23C31 35 22 37 20 37C18 37 9 35 8 23C7 11 20 4 20 4Z"
            fill={`url(#petalGrad-${color1.replace('#', '')})`}
        />
        {/* Soft Highlight Curve */}
        <path
            d="M20 7C20 7 29 13 28 23C27 32 21 34 20 34C19 34 13 32 12 23C11 13 20 7 20 7Z"
            fill={`url(#petalHighlight-${color1.replace('#', '')})`}
        />
        {/* Petal Inner Vein */}
        <path
            d="M20 10C20 18 20.5 26 20 33"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.8"
            strokeLinecap="round"
        />
    </svg>
);

const BlossomPetalFlutter = ({ color1, color2 }: { color1: string; color2: string }) => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.05))' }}>
        <defs>
            <linearGradient id={`blossomGrad-${color1.replace('#', '')}`} x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor={color1} />
                <stop offset="100%" stopColor={color2} />
            </linearGradient>
        </defs>
        {/* Asymmetrical side-flutter petal */}
        <path
            d="M17 3C22 7 30 14 27 24C24 33 16 32 14 31C9 28 4 22 7 13C9 7 14 3 17 3Z"
            fill={`url(#blossomGrad-${color1.replace('#', '')})`}
        />
        <path
            d="M16 6C19 9 25 15 23 23C21 30 15 29 14 28"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.75"
            strokeLinecap="round"
        />
    </svg>
);

const MarigoldPetal = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.15))' }}>
        <defs>
            <linearGradient id="marigoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
        </defs>
        <path
            d="M14 2C14 2 22 7 21 16C20 24 16 26 14 26C12 26 8 24 7 16C6 7 14 2 14 2Z"
            fill="url(#marigoldGrad)"
        />
    </svg>
);

interface PetalConfig {
    id: number;
    type: 'curled' | 'flutter' | 'marigold';
    left: number; // percentage
    delay: number; // seconds
    duration: number; // seconds
    scale: number;
    swayAmount: number; // px
    rotX: number;
    rotY: number;
    rotZ: number;
    color1: string;
    color2: string;
    zIndex: number;
}

export const FlowerPetalDrift: React.FC = () => {
    const [petals, setPetals] = useState<PetalConfig[]>([]);

    useEffect(() => {
        const palette = [
            { c1: '#FDE8E8', c2: '#F8B4B4' }, // Blush Rose
            { c1: '#FCE7F3', c2: '#F472B6' }, // Petal Pink
            { c1: '#FFE4E6', c2: '#FB7185' }, // Soft Crimson
            { c1: '#FFF1F2', c2: '#FDA4AF' }, // Dewdrop Rose
            { c1: '#FEF3C7', c2: '#F59E0B' }, // Champagne / Golden
        ];

        const generated: PetalConfig[] = Array.from({ length: 42 }).map((_, i) => {
            const pal = palette[i % palette.length];
            const typeRoll = Math.random();
            const type: 'curled' | 'flutter' | 'marigold' =
                typeRoll < 0.5 ? 'curled' : typeRoll < 0.82 ? 'flutter' : 'marigold';

            return {
                id: i,
                type,
                left: Math.random() * 96 + 2, // 2% to 98%
                delay: Math.random() * 2.8, // staggered cascade 0s - 2.8s
                duration: Math.random() * 3.5 + 4.8, // 4.8s to 8.3s
                scale: Math.random() * 0.45 + 0.65, // 0.65 to 1.1
                swayAmount: (Math.random() - 0.5) * 110, // -55px to +55px
                rotX: Math.random() * 360 + 180,
                rotY: Math.random() * 360 + 180,
                rotZ: Math.random() * 360 + 180,
                color1: pal.c1,
                color2: pal.c2,
                zIndex: Math.random() > 0.4 ? 9999 : 9998,
            };
        });

        setPetals(generated);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 9999,
                perspective: '1000px',
            }}
            aria-hidden="true"
        >
            <style>{`
                @keyframes organicPetalFall {
                    0% {
                        transform: translate3d(0, -50px, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
                        opacity: 0;
                    }
                    8% {
                        opacity: 0.95;
                    }
                    35% {
                        transform: translate3d(var(--sway-x), 35vh, 20px) rotateX(var(--rot-x1)) rotateY(var(--rot-y1)) rotateZ(var(--rot-z1));
                        opacity: 0.95;
                    }
                    70% {
                        transform: translate3d(calc(var(--sway-x) * -0.6), 72vh, 10px) rotateX(var(--rot-x2)) rotateY(var(--rot-y2)) rotateZ(var(--rot-z2));
                        opacity: 0.9;
                    }
                    95% {
                        opacity: 0.85;
                    }
                    100% {
                        transform: translate3d(var(--sway-x), 112vh, 0px) rotateX(var(--rot-x3)) rotateY(var(--rot-y3)) rotateZ(var(--rot-z3));
                        opacity: 0;
                    }
                }
            `}</style>

            {petals.map((petal) => (
                <div
                    key={petal.id}
                    style={
                        {
                            position: 'absolute',
                            left: `${petal.left}%`,
                            top: '-45px',
                            zIndex: petal.zIndex,
                            animation: `organicPetalFall ${petal.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${petal.delay}s forwards`,
                            transformOrigin: '50% 50%',
                            '--sway-x': `${petal.swayAmount}px`,
                            '--rot-x1': `${petal.rotX * 0.35}deg`,
                            '--rot-y1': `${petal.rotY * 0.35}deg`,
                            '--rot-z1': `${petal.rotZ * 0.35}deg`,
                            '--rot-x2': `${petal.rotX * 0.7}deg`,
                            '--rot-y2': `${petal.rotY * 0.7}deg`,
                            '--rot-z2': `${petal.rotZ * 0.7}deg`,
                            '--rot-x3': `${petal.rotX}deg`,
                            '--rot-y3': `${petal.rotY}deg`,
                            '--rot-z3': `${petal.rotZ}deg`,
                        } as React.CSSProperties
                    }
                >
                    <div style={{ transform: `scale(${petal.scale})` }}>
                        {petal.type === 'curled' && (
                            <RosePetalCurled color1={petal.color1} color2={petal.color2} />
                        )}
                        {petal.type === 'flutter' && (
                            <BlossomPetalFlutter color1={petal.color1} color2={petal.color2} />
                        )}
                        {petal.type === 'marigold' && <MarigoldPetal />}
                    </div>
                </div>
            ))}
        </div>
    );
};
