'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Matches the "Great choice" transition: backdrop blur-in, then a soft spring +
// de-blur on the card, with its children staggering up.
const backdropVariants: Variants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(9px)', transition: { duration: 0.45, ease: EASE } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3, ease: EASE } },
};
const cardVariants: Variants = {
    hidden: { scale: 0.94, opacity: 0, y: 20, filter: 'blur(12px)' },
    visible: {
        scale: 1, opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { type: 'spring', bounce: 0.18, duration: 0.6, staggerChildren: 0.06, delayChildren: 0.12 },
    },
    exit: { scale: 0.96, opacity: 0, y: 10, filter: 'blur(8px)', transition: { duration: 0.28, ease: EASE } },
};
const itemVariants: Variants = {
    hidden: { y: 14, opacity: 0, filter: 'blur(8px)' },
    visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', bounce: 0.2, duration: 0.45 } },
};

const GLYPHS = ['❦', '✦', '❀', '♥'];
const COLORS = ['#C8A951', '#B39D73', '#FDA4AF', '#EBCDC3', '#8A6D1F'];

/** A one-shot confetti burst from the dialog centre. */
function Confetti() {
    const [bits] = useState(() =>
        Array.from({ length: 44 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 18 + Math.random() * 34; // vmin
            return {
                id: i,
                dx: Math.cos(angle) * distance,
                dy: Math.sin(angle) * distance,
                size: 10 + Math.random() * 16,
                glyph: GLYPHS[i % GLYPHS.length],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                duration: 1.9 + Math.random() * 1.4,
                delay: Math.random() * 0.15,
                spin: (Math.random() * 2 - 1) * 260,
            };
        }),
    );
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
            {bits.map((b) => (
                <motion.span
                    key={b.id}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        x: `${b.dx}vmin`,
                        y: `${b.dy}vmin`,
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1, 1, 0.85],
                        rotate: b.spin,
                    }}
                    transition={{ duration: b.duration, delay: b.delay, ease: EASE_OUT }}
                    style={{
                        position: 'absolute', left: '50%', top: '46%',
                        marginLeft: -b.size / 2, marginTop: -b.size / 2,
                        color: b.color, fontSize: b.size, lineHeight: 1, userSelect: 'none',
                    }}
                >
                    {b.glyph}
                </motion.span>
            ))}
        </div>
    );
}

export function WelcomeDialog({ open, onClose, coupleNames }: { open: boolean; onClose: () => void; coupleNames?: string }) {
    // Auto-dismiss so the dashboard is never blocked; the button lets them enter sooner.
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(onClose, 5600);
        return () => clearTimeout(t);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Welcome to Nimantran Studio"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9998,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(24, 20, 12, 0.30)', padding: '1.5rem',
                    }}
                >
                    <Confetti />

                    <motion.div
                        variants={cardVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative', zIndex: 1, width: 'min(92vw, 460px)',
                            background: 'linear-gradient(180deg, #FFFDF8 0%, #FBF6EA 100%)',
                            borderRadius: 26, padding: '2.9rem 2.25rem 2.5rem', textAlign: 'center',
                            border: '1px solid #F0E6C8', boxShadow: '0 34px 90px rgba(60, 40, 10, 0.30)',
                        }}
                    >
                        <motion.div
                            variants={itemVariants}
                            style={{
                                width: 66, height: 66, margin: '0 auto 1.25rem', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'radial-gradient(circle at 50% 35%, #FBE7BE, #E6C878)',
                                color: '#6E520F', boxShadow: '0 10px 26px rgba(200, 169, 81, 0.45)',
                            }}
                        >
                            <Sparkles size={30} strokeWidth={1.75} />
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(24px, 4.5vw, 30px)', color: '#2A2417', margin: 0, lineHeight: 1.2 }}
                        >
                            Welcome to Nimantran Studio
                        </motion.h1>

                        {coupleNames && (
                            <motion.p variants={itemVariants} style={{ margin: '0.6rem 0 0', fontWeight: 600, color: '#8A6D1F', letterSpacing: '0.01em' }}>
                                {coupleNames}
                            </motion.p>
                        )}

                        <motion.p
                            variants={itemVariants}
                            style={{ margin: '0.85rem 0 1.75rem', fontSize: 15.5, lineHeight: 1.6, color: '#6B6353' }}
                        >
                            Your wedding suite is ready. Let’s make every invitation unforgettable.
                        </motion.p>

                        <motion.button
                            variants={itemVariants}
                            onClick={onClose}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                                background: 'linear-gradient(180deg, #D8B65E, #C29A3C)', color: '#fff',
                                border: 'none', borderRadius: 999, padding: '0.8rem 1.6rem', fontWeight: 700, fontSize: 15,
                                boxShadow: '0 12px 26px rgba(194, 154, 60, 0.4)',
                            }}
                        >
                            Enter your dashboard <ArrowRight size={17} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
