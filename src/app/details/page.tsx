'use client';

export const dynamic = 'force-dynamic';

import { useWeddingStore } from '@/store/wedding-store';
import { useSaveWedding } from '@/hooks/useSaveWedding';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Heart } from 'lucide-react';
import styles from './details.module.css';

import { CoupleDetailsForm } from '@/components/form/CoupleDetailsForm';
import { CeremonyDetailsForm } from '@/components/form/CeremonyDetailsForm';
import { TimelineForm } from '@/components/form/TimelineForm';
import { RSVPPreview } from '@/components/form/RSVPPreview';
import { LoginModal } from '@/components/auth/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';

function WeddingCelebration() {
    const [particles] = useState(() =>
        Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            size: 8 + Math.random() * 12,
            type: ['heart', 'petal', 'sparkle', 'flake'][Math.floor(Math.random() * 4)],
            color: ['#D4AF37', '#FDFBF7', '#FDA4AF', '#EBCDC3'][Math.floor(Math.random() * 4)],
            duration: 4.0 + Math.random() * 2.0,
            delay: Math.random() * 0.8,
            rotation: Math.random() * 360,
            drift: (Math.random() - 0.5) * 40
        }))
    );

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0
        }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: `${p.x}vw`,
                        y: `${p.y}vh`,
                        rotate: p.rotation,
                        opacity: 1,
                        scale: 0.5
                    }}
                    animate={{
                        y: '110vh',
                        x: `${p.x + p.drift}vw`,
                        rotate: p.rotation + 720,
                        opacity: [1, 1, 0],
                        scale: [0.8, 1, 0.7]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        color: p.color,
                        filter: p.size < 12 ? 'blur(1px)' : 'none',
                        opacity: 0.8
                    }}
                >
                    {p.type === 'heart' && <Heart size={p.size} fill="currentColor" stroke="none" />}
                    {p.type === 'petal' && (
                        <div style={{
                            width: p.size,
                            height: p.size * 0.7,
                            background: 'currentColor',
                            borderRadius: '50% 0 50% 0',
                            transform: 'rotate(45deg)'
                        }} />
                    )}
                    {p.type === 'sparkle' && (
                        <div style={{
                            width: 2,
                            height: p.size,
                            background: 'currentColor',
                            boxShadow: `0 0 ${p.size / 2}px currentColor`
                        }} />
                    )}
                    {p.type === 'flake' && (
                        <div style={{
                            width: p.size / 2,
                            height: p.size / 2,
                            background: 'currentColor',
                            borderRadius: '2px'
                        }} />
                    )}
                </motion.div>
            ))}
        </div>
    );
}

function DetailsContent() {
    const router = useRouter();
    const { formData } = useWeddingStore();
    const { saveWedding, isSaving, error: saveError } = useSaveWedding();
    const [step, setStep] = useState(1);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(formData.events?.[0]?.id || null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Welcome Overlay State
    const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleLoginSuccess = async (phone: string) => {
        setShowLoginModal(false);
        useWeddingStore.getState().login(phone);

        const result = await saveWedding();
        if (!result.success) {
             console.error("Save failed:", result.error);
             alert(`Failed to save: ${result.error}`);
             // Depending on UX, you might stay on the page to fix errors,
             // but for now we fallback to the original behavior of proceeding to preview.
        }
        router.push('/preview?processing=true');
    };

    const handleNext = async () => {
        if (step === 1) {
            const newErrors: Record<string, string> = {};
            if (!formData.groomName?.trim()) newErrors.groomName = "Groom's name is required";
            if (!formData.brideName?.trim()) newErrors.brideName = "Bride's name is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setStep(2);
        } else if (step === 2) {
            const newErrors: Record<string, string> = {};
            if (!formData.primaryDate) newErrors.primaryDate = "Wedding date is required";
            if (!formData.primaryTime) newErrors.primaryTime = "Wedding time is required";
            if (!formData.defaultVenueName?.trim()) newErrors.defaultVenueName = "Venue address is required";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setErrors({});
            setStep(3);
        } else if (step === 3) {
            if (formData.events) {
                const newErrors: Record<string, string> = {};
                for (const event of formData.events) {
                    if (!event.date) {
                        newErrors[`${event.id}-date`] = "Date is required";
                    }
                    if (!event.time) {
                        newErrors[`${event.id}-time`] = "Time is required";
                    }
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                }
            }
            setErrors({});
            setStep(4);
        } else if (step === 4) {
            setShowLoginModal(true);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.back();
    };

    return (
        <div className={styles.page}>
            <AnimatePresence>
                {showWelcomeOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.transitionOverlay}
                        style={{ zIndex: 10000 }}
                    >
                        {showConfetti && <WeddingCelebration />}

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className={styles.transitionContent}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                                className={styles.transitionIconWrapper}
                            >
                                <Heart className={styles.transitionHeart} size={64} />
                                <div className={styles.heartGlow} />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                                className={styles.transitionTitle}
                            >
                                {formData.groomName || 'Groom'} & {formData.brideName || 'Bride'}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.1 }}
                                className={styles.transitionSubtitle}
                            >
                                Your beautiful journey begins here...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="container">
                <div className={styles.wizardContainer}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <CoupleDetailsForm
                                errors={errors}
                                setErrors={setErrors}
                                handleNext={handleNext}
                                step={step}
                            />
                        )}
                        {step === 2 && (
                            <CeremonyDetailsForm
                                errors={errors}
                                setErrors={setErrors}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                step={step}
                            />
                        )}
                        {step === 3 && (
                            <TimelineForm
                                errors={errors}
                                setErrors={setErrors}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                step={step}
                                expandedEventId={expandedEventId}
                                setExpandedEventId={setExpandedEventId}
                            />
                        )}
                        {step === 4 && (
                            <RSVPPreview
                                isSaving={isSaving}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                step={step}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}

export default function DetailsPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <DetailsContent />
        </Suspense>
    );
}
