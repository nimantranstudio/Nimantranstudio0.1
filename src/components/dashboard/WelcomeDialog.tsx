'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

const cardVariants: Variants = {
    hidden: { scale: 0.94, opacity: 0, y: 16 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { type: 'spring', bounce: 0.12, duration: 0.5, staggerChildren: 0.05, delayChildren: 0.06 },
    },
    exit: {
        scale: 0.96,
        opacity: 0,
        y: -12,
        transition: { duration: 0.35, ease: EASE_OUT },
    },
};

const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: EASE } },
};

export interface WelcomeDialogProps {
    open: boolean;
    onClose: () => void;
    coupleNames?: string;
    autoDismiss?: boolean;
    orderId?: string | null;
    amount?: number | null;
    planName?: string | null;
    themeName?: string | null;
    receiptNumber?: string | null;
    paymentMethod?: string | null;
}

export function WelcomeDialog({
    open,
    onClose,
    autoDismiss = true,
}: WelcomeDialogProps) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    // Automatically dismisses after exactly 2 seconds without requiring any click
    useEffect(() => {
        if (!open || !autoDismiss) return;
        const timer = setTimeout(() => {
            onCloseRef.current?.();
        }, 2000);
        return () => clearTimeout(timer);
    }, [open, autoDismiss]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Payment Successful - Welcome to Nimantran Studio"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9998,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.45)',
                        padding: '1.5rem',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    <motion.div
                        variants={cardVariants}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            width: 'min(92vw, 530px)',
                            background: '#FFFDF9',
                            borderRadius: 28,
                            padding: '2.5rem 2.25rem 2.25rem',
                            textAlign: 'center',
                            border: '1px solid rgba(212, 175, 55, 0.35)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 35px -5px rgba(212, 175, 55, 0.15)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Golden Shine Beam - matching landing page button shine */}
                        <motion.div
                            initial={{ x: '-150%', skewX: -30 }}
                            animate={{ x: '250%', skewX: -30 }}
                            transition={{
                                repeat: Infinity,
                                duration: 4.5,
                                ease: [0.4, 0, 0.2, 1],
                                repeatDelay: 2,
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '260px',
                                height: '100%',
                                background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(236, 200, 120, 0.12) 25%, rgba(255, 245, 215, 0.7) 50%, rgba(212, 175, 55, 0.2) 75%, rgba(255, 255, 255, 0) 100%)',
                                pointerEvents: 'none',
                                zIndex: 10,
                            }}
                        />

                        {/* Reduced size animated Green Circle with Crisp White Check */}
                        <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 450,
                                damping: 20,
                                delay: 0.12,
                            }}
                            style={{
                                width: 46,
                                height: 46,
                                margin: '0 auto 1.15rem',
                                borderRadius: '50%',
                                background: '#22C55E',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 18,
                                    delay: 0.22,
                                }}
                            >
                                <Check size={24} strokeWidth={3} />
                            </motion.div>
                        </motion.div>

                        {/* Small Payment Successful Message */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                                fontSize: '1.2rem',
                                color: '#15803D',
                                fontWeight: 600,
                                letterSpacing: '-0.01em',
                                marginBottom: '0.45rem',
                            }}
                        >
                            Payment Successful
                        </motion.div>

                        {/* Welcome heading split across two lines with golden Nimantran Studio */}
                        <motion.h1
                            variants={itemVariants}
                            style={{
                                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                                margin: '0 0 0.95rem 0',
                                lineHeight: 1.25,
                                textAlign: 'center',
                            }}
                        >
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: 'clamp(20px, 4.5vw, 24px)',
                                    color: '#1F2937',
                                    fontWeight: 500,
                                    letterSpacing: '0.01em',
                                    marginBottom: '0.15rem',
                                }}
                            >
                                Welcome to
                            </span>
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: 'clamp(26px, 6vw, 32px)',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #ECC878 0%, #D4AF37 55%, #B8860B 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    color: '#D4AF37',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                Nimantran Studio
                            </span>
                        </motion.h1>

                        {/* Subtitle - single line message */}
                        <motion.p
                            variants={itemVariants}
                            style={{
                                margin: 0,
                                fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
                                lineHeight: 1.5,
                                color: '#52525B',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Your wedding suite is ready. Let’s make every invitation unforgettable.
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
