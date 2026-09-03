'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
    Check, 
    ChevronRight, 
    Download, 
    FileText, 
    CheckCircle2, 
    Zap, 
    CreditCard, 
    LayoutDashboard,
    IndianRupee
} from 'lucide-react';
import confetti from 'canvas-confetti';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const backdropVariants: Variants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(10px)', transition: { duration: 0.35, ease: EASE } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3, ease: EASE } },
};

const cardVariants: Variants = {
    hidden: { scale: 0.92, opacity: 0, y: 15 },
    visible: {
        scale: 1, opacity: 1, y: 0,
        transition: { type: 'spring', bounce: 0.15, duration: 0.5, staggerChildren: 0.05, delayChildren: 0.08 },
    },
    exit: { scale: 0.95, opacity: 0, y: 8, transition: { duration: 0.25, ease: EASE } },
};

const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', bounce: 0.15, duration: 0.4 } },
};

const FLOWER_GLYPHS = ['🌸', '🌺', '🌼', '🌷', '💮', '🏵️', '💐', '✨'];

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

function FlowerBlast() {
    const [petals] = useState(() =>
        Array.from({ length: 45 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 45;
            return {
                id: i,
                dx: Math.cos(angle) * distance,
                dy: Math.sin(angle) * distance - 8,
                size: 18 + Math.random() * 18,
                glyph: FLOWER_GLYPHS[Math.floor(Math.random() * FLOWER_GLYPHS.length)],
                duration: 2.2 + Math.random() * 1.2,
                delay: Math.random() * 0.18,
                spin: (Math.random() * 2 - 1) * 360,
            };
        }),
    );

    useEffect(() => {
        try {
            confetti({
                particleCount: 90,
                spread: 120,
                origin: { x: 0.5, y: 0.55 },
                colors: ['#FFB800', '#FF6B00', '#E11D48', '#F472B6', '#FFFFFF', '#10B981'],
                gravity: 0.65,
                scalar: 1.2,
                ticks: 350,
                startVelocity: 40,
                zIndex: 10002
            });
        } catch (e) {
            console.error('Confetti burst error:', e);
        }
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10001 }} aria-hidden>
            {petals.map((p) => (
                <motion.span
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        x: `${p.dx}vmin`,
                        y: `${p.dy}vmin`,
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.2, 1, 0.7],
                        rotate: p.spin,
                    }}
                    transition={{ duration: p.duration, delay: p.delay, ease: EASE_OUT }}
                    style={{
                        position: 'absolute', left: '50%', top: '50%',
                        marginLeft: -p.size / 2, marginTop: -p.size / 2,
                        fontSize: p.size, lineHeight: 1, userSelect: 'none',
                    }}
                >
                    {p.glyph}
                </motion.span>
            ))}
        </div>
    );
}

interface WelcomeDialogProps {
    open: boolean;
    onClose: () => void;
    coupleNames?: string;
    autoDismiss?: boolean;
}

export function WelcomeDialog({ open, onClose, coupleNames, autoDismiss = false }: WelcomeDialogProps) {
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (!open || !autoDismiss) return;
        const t = setTimeout(onClose, 5000);
        return () => clearTimeout(t);
    }, [open, autoDismiss, onClose]);

    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const formattedTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

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
                        background: 'rgba(15, 23, 42, 0.45)', padding: '1.5rem',
                    }}
                >
                    {!reduced && <FlowerBlast />}

                    <motion.div
                        variants={cardVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative', zIndex: 10003, width: 'min(92vw, 760px)',
                            background: '#FFFFFF',
                            borderRadius: 24, padding: '2.25rem',
                            border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 25px 70px rgba(0, 0, 0, 0.18)',
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'stretch'
                        }}
                    >
                        {/* Left Column: Celebration & Primary Actions (50%) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '0.5rem 0' }}>
                            {/* Glowing Brand Gold Checkmark Badge */}
                            <motion.div
                                variants={itemVariants}
                                style={{
                                    width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.25rem',
                                    background: 'radial-gradient(circle, rgba(200, 169, 81, 0.2) 0%, rgba(200, 169, 81, 0.03) 100%)',
                                    border: '1px solid rgba(200, 169, 81, 0.35)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative',
                                    boxShadow: '0 8px 24px rgba(200, 169, 81, 0.15)'
                                }}
                            >
                                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #C8A951 0%, #B4933E 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(180, 147, 62, 0.3)' }}>
                                    <Check size={24} strokeWidth={2.8} />
                                </div>
                                <span style={{ position: 'absolute', top: '-4px', right: '-4px', fontSize: '0.85rem' }}>✨</span>
                                <span style={{ position: 'absolute', bottom: '-2px', left: '-4px', fontSize: '0.75rem' }}>✦</span>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2rem', color: '#111827', margin: 0, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.02em' }}
                            >
                                Payment Successful!
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#6B7280', fontWeight: 500, letterSpacing: '0.01em' }}
                            >
                                {formattedDate} • {formattedTime}
                            </motion.p>

                            <motion.p
                                variants={itemVariants}
                                style={{ margin: '1.25rem 0 0.25rem', fontFamily: 'var(--font-serif, serif)', fontSize: '1.1rem', color: '#111827', fontWeight: 600, lineHeight: 1.3 }}
                            >
                                WhatsApp Essentials Activated 🎊
                            </motion.p>

                            <motion.p
                                variants={itemVariants}
                                style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: '#6B7280', maxWidth: '300px' }}
                            >
                                All your wedding invites and RSVP tools are ready to use.
                            </motion.p>

                            {/* Primary Button */}
                            <motion.button
                                variants={itemVariants}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={onClose}
                                style={{
                                    width: '100%',
                                    maxWidth: '280px',
                                    background: 'linear-gradient(135deg, #ECC878 0%, #D4AF37 100%)',
                                    color: '#111111',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.85rem 1.5rem',
                                    fontSize: '0.925rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginTop: '1.75rem',
                                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.32)'
                                }}
                            >
                                <span>Go to My Dashboard</span>
                                <ChevronRight size={16} />
                            </motion.button>

                            {/* Secondary Link */}
                            <motion.button
                                variants={itemVariants}
                                whileTap={{ scale: 0.97 }}
                                onClick={onClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#9E7D2B',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    marginTop: '0.75rem'
                                }}
                            >
                                <span>View Invitation Suite</span>
                                <ChevronRight size={14} />
                            </motion.button>
                        </div>

                        {/* Right Column: Payment Details Card (50%) */}
                        <div style={{ background: '#FAFBFB', borderRadius: '20px', border: '1px solid #F3F4F6', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                            <div style={{ padding: '1.35rem 1.35rem 1rem' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 1.15rem 0' }}>
                                    Payment Details
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                                    {/* Amount Paid */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                                <IndianRupee size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>Amount Paid</span>
                                        </div>
                                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: '#163B2B' }}>₹10</span>
                                    </div>

                                    {/* Receipt No */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                                <FileText size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>Receipt No.</span>
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F2937' }}>NS/2026-27/0001</span>
                                    </div>

                                    {/* Plan */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                                <Zap size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>Plan</span>
                                        </div>
                                        <span style={{ background: '#F3F4F6', color: '#374151', padding: '0.15rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            WhatsApp Essentials
                                        </span>
                                    </div>

                                    {/* Validity */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>Validity</span>
                                        </div>
                                        <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.15rem 0.65rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            Lifetime Access
                                        </span>
                                    </div>

                                    {/* Theme Purchased */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                                <LayoutDashboard size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>Theme Purchased</span>
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F2937' }}>
                                            Suvarna Sohala
                                        </span>
                                    </div>

                                    {/* Payment Method */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                                <CreditCard size={14} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>Payment Method</span>
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#9CA3AF' }}>—</span>
                                    </div>
                                </div>
                            </div>

                            {/* Download Receipt PDF Strip */}
                            <button
                                onClick={() => window.print()}
                                style={{
                                    background: '#E7ECE8',
                                    border: 'none',
                                    borderTop: '1px solid #DFE5DF',
                                    padding: '0.85rem',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    color: '#163B2B',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'background-color 160ms ease-out'
                                }}
                            >
                                <Download size={15} />
                                <span>Download Receipt (PDF)</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
