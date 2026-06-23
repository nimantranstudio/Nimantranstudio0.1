'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from '@/app/processing/processing.module.css';

const STEPS = [
    { id: 1, text: "Creating invitation for Engagement" },
    { id: 2, text: "Designing Wedding Ceremony invitation" },
    { id: 3, text: "Preparing Reception invitation" },
    { id: 4, text: "Generating WhatsApp-ready video invite" },
    { id: 5, text: "Setting up RSVP tracking dashboard" },
    { id: 6, text: "Optimising invitations for seamless WhatsApp sharing" }
];

interface ProcessingOverlayProps {
    onComplete?: () => void;
}

export function ProcessingOverlay({ onComplete }: ProcessingOverlayProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

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
            // Celebrate then exit
            const triggerBurst = (delay: number, xOrigin: number, yOrigin: number = 0.6) => {
                setTimeout(() => {
                    // Slow drifting background confetti (behind card, but in front of overlay)
                    confetti({
                        particleCount: 150,
                        spread: 120,
                        origin: { x: xOrigin, y: yOrigin },
                        colors: ['#D4AF37', '#AA861E', '#FFFFFF', '#E5E4E2'],
                        shapes: ['circle', 'square'],
                        gravity: 0.1, // Slow float down
                        scalar: 1.2,
                        ticks: 800, // Stay on screen longer
                        startVelocity: 30,
                        drift: 0.2, // Drifting sideways
                        zIndex: 10000 // In front of overlay (9999) but behind card (10001)
                    });
                    
                    // Foregound confetti (cinematic depth of field simulation)
                    confetti({
                        particleCount: 25,
                        spread: 180,
                        origin: { x: xOrigin, y: yOrigin },
                        colors: ['#D4AF37', '#FFFFFF'],
                        shapes: ['circle'],
                        gravity: 0.2,
                        scalar: 2.5, // Larger shapes for foreground
                        ticks: 800,
                        startVelocity: 45,
                        zIndex: 10005 // In front of the card
                    });
                }, delay);
            };

            triggerBurst(0, 0.5, 0.7);      
            triggerBurst(2000, 0.2, 0.5);   
            triggerBurst(4000, 0.8, 0.5);

            // Auto-exit after 10 seconds
            const exitTimer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 1000); // Wait for fade out
            }, 10000);

            return () => clearTimeout(exitTimer);
        }
    }, [isFinished, onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div 
                    className={styles.processingPage}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div 
                        className={styles.transitionCard}
                        style={{ position: 'relative', zIndex: 10001, overflow: 'hidden' }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {isFinished && (
                            <motion.div
                                initial={{ left: '-150%' }}
                                animate={{ left: '150%' }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    width: '50%',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(212,175,55,0.15) 50%, rgba(255,255,255,0) 100%)',
                                    transform: 'skewX(-25deg)',
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}
                            />
                        )}
                        <div className={styles.topSection}>
                            <motion.h1 className={styles.headline}>
                                {isFinished ? "Success! Everything is ready." : "Sit back and relax."}
                            </motion.h1>

                            <motion.p className={styles.subtext}>
                                {isFinished 
                                    ? "Entering your premium wedding invitation suite..."
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

                        {!isFinished && (
                            <div className={styles.progressBarContainer}>
                                <motion.div 
                                    className={styles.progressBar}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
