'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './processing.module.css';

const STEPS = [
    { id: 1, text: "Creating invitation for Engagement" },
    { id: 2, text: "Designing Wedding Ceremony invitation" },
    { id: 3, text: "Preparing Reception invitation" },
    { id: 4, text: "Generating WhatsApp-ready video invite" },
    { id: 5, text: "Setting up RSVP tracking dashboard" },
    { id: 6, text: "Optimising invitations for seamless WhatsApp sharing" }
];

export default function ProcessingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Step animation sequence
        if (currentStep < STEPS.length) {
            const timer = setTimeout(() => {
                setCompletedSteps(prev => [...prev, currentStep]);
                setCurrentStep(prev => prev + 1);
                setProgress((prev) => Math.min(prev + (100 / STEPS.length), 100));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setIsFinished(true);
                setProgress(100);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    useEffect(() => {
        if (isFinished) {
            // 3 Slow, Premium Bursts
            const triggerBurst = (delay: number, xOrigin: number) => {
                setTimeout(() => {
                    confetti({
                        particleCount: 200, // Denser burst
                        spread: 180,       // Full wide fan
                        origin: { x: xOrigin, y: 0.6 },
                        colors: ['#D4AF37', '#AA861E', '#FFFFFF'],
                        gravity: 0.5,      // Slightly faster fall but still premium
                        scalar: 1.5,       // Large high-visibility particles
                        ticks: 500,        // Long duration to fill screen
                        startVelocity: 45, // High velocity to reach full screen height
                        zIndex: 20000
                    });
                }, delay);
            };

            triggerBurst(0, 0.5);      // Center
            triggerBurst(5000, 0.8);   // Right

            // Auto-navigate to preview after 10 seconds total
            const navigateTimer = setTimeout(() => {
                handleContinue();
            }, 10000);

            return () => clearTimeout(navigateTimer);
        }
    }, [isFinished]);

    const handleContinue = () => {
        router.push('/preview?confetti=true');
    };

    return (
        <div className={styles.processingPage}>
            <motion.div 
                className={styles.transitionCard}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className={styles.topSection}>
                    <motion.h1 
                        className={styles.headline}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {isFinished ? "Success! Everything is ready." : "Sit back and relax."}
                    </motion.h1>

                    <motion.p 
                        className={styles.subtext}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {isFinished 
                            ? "Redirecting you to view your invitations..."
                            : "We’re creating your invitations, RSVP tracking, and guest experience."}
                    </motion.p>
                </div>

                <div className={styles.mainGrid}>
                    <div className={styles.checklist}>
                        {STEPS.map((step, idx) => {
                            const isActive = currentStep === idx;
                            const isCompleted = completedSteps.includes(idx);
                            
                            return (
                                <motion.div 
                                    key={step.id}
                                    className={`${styles.step} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isCompleted || isActive ? 1 : 0.2 }}
                                >
                                    <div className={styles.stepIndicator}>
                                        {isCompleted && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <Check size={12} className={styles.checkMark} />
                                            </motion.div>
                                        )}
                                    </div>
                                    <span className={styles.stepText}>{step.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.progressBarContainer}>
                    <motion.div 
                        className={styles.progressBar}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
