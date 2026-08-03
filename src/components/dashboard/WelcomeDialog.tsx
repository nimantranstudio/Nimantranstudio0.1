'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
const COLORS = ['#C8A951', '#B39D73', '#22C55E', '#EBCDC3', '#8A6D1F'];

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const on = () => setReduced(mq.matches);
        mq.addEventListener?.('change', on);
        return () => mq.removeEventListener?.('change', on);
    }, []);
    return reduced;
}

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
                        position: 'absolute', left: '50%', top: '44%',
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

interface WelcomeDialogProps {
    open: boolean;
    onClose: () => void;
    coupleNames?: string;
    /** Auto-dismiss after a few seconds (dashboard). Set false while provisioning
     *  on /preview, where the dialog stays until navigation. */
    autoDismiss?: boolean;
}

export function WelcomeDialog({ open, onClose, coupleNames, autoDismiss = true }: WelcomeDialogProps) {
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (!open || !autoDismiss) return;
        const t = setTimeout(onClose, 5600);
        return () => clearTimeout(t);
    }, [open, autoDismiss, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={autoDismiss ? onClose : undefined}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Payment successful"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9998,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(24, 20, 12, 0.34)', padding: '1.5rem',
                    }}
                >
                    {!reduced && <Confetti />}

                    <motion.div
                        variants={cardVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative', zIndex: 1, width: 'min(92vw, 440px)',
                            background: 'linear-gradient(180deg, #FFFEFB 0%, #FBF6EA 100%)',
                            borderRadius: 26, padding: '2.75rem 2.25rem 2.5rem', textAlign: 'center',
                            border: '1px solid #F0E6C8', boxShadow: '0 34px 90px rgba(60, 40, 10, 0.32)',
                        }}
                    >
                        {/* Success mark — the hero of the moment */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                width: 74, height: 74, margin: '0 auto 1.3rem', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'radial-gradient(circle at 50% 32%, #4ADE80, #16A34A)',
                                color: '#fff', boxShadow: '0 12px 30px rgba(22, 163, 74, 0.42)',
                            }}
                        >
                            <Check size={38} strokeWidth={3} />
                        </motion.div>

                        {/* PRIMARY */}
                        <motion.h1
                            variants={itemVariants}
                            style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(26px, 5vw, 33px)', color: '#1E7A3D', margin: 0, lineHeight: 1.15, fontWeight: 700 }}
                        >
                            Payment Successful
                        </motion.h1>

                        {/* SECONDARY */}
                        <motion.p
                            variants={itemVariants}
                            style={{ margin: '0.7rem 0 0', fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(17px, 3vw, 20px)', color: '#2A2417', lineHeight: 1.3 }}
                        >
                            Welcome to Nimantran Studio
                        </motion.p>

                        {coupleNames && (
                            <motion.p variants={itemVariants} style={{ margin: '0.5rem 0 0', fontWeight: 600, color: '#8A6D1F', letterSpacing: '0.01em' }}>
                                {coupleNames}
                            </motion.p>
                        )}

                        {/* SUBTEXT */}
                        <motion.p
                            variants={itemVariants}
                            style={{ margin: '0.9rem 0 0', fontSize: 15, lineHeight: 1.6, color: '#6B6353' }}
                        >
                            Your wedding suite is ready. Let’s make every invitation unforgettable.
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
