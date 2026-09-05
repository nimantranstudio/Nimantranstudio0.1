'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Sparkles, Send, Download } from 'lucide-react';
import Image from 'next/image';
import styles from './ExitIntentModal.module.css';

export default function ExitIntentModal() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [leadInfo, setLeadInfo] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Allow previewing via query parameter (e.g. ?preview=exit-intent or ?exit=1)
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('preview') === 'exit-intent' || urlParams.get('exit') === '1' || urlParams.get('preview') === 'pdf') {
                setIsVisible(true);
                return;
            }
        }

        const shown = sessionStorage.getItem('exit_intent_shown');
        if (shown) {
            setHasBeenShown(true);
        }
    }, []);

    const handleExitIntent = useCallback((e: MouseEvent) => {
        if (hasBeenShown) return;

        // Trigger when cursor moves near the top of the viewport or leaves window through top
        if (e.clientY <= 10) {
            setIsVisible(true);
            setHasBeenShown(true);
            sessionStorage.setItem('exit_intent_shown', 'true');
        }
    }, [hasBeenShown]);

    useEffect(() => {
        // Strict guard: only execute on landing page ('/')
        if (!isClient || pathname !== '/') {
            setIsVisible(false);
            return;
        }

        // If preview query parameter is present, keep visible
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('preview') === 'exit-intent' || urlParams.get('exit') === '1' || urlParams.get('preview') === 'pdf') {
                setIsVisible(true);
                return;
            }
        }

        if (hasBeenShown) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                handleExitIntent(e);
            }
        };

        // Delay after page load before enabling exit-intent to avoid false triggers
        const timer = setTimeout(() => {
            window.addEventListener('mousemove', handleExitIntent);
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 3000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleExitIntent);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isClient, hasBeenShown, pathname, handleExitIntent]);

    const dismiss = () => {
        setIsVisible(false);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/assets/wedding-guide.pdf';
        link.download = 'Nimantran_Wedding_Planning_Guide.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadInfo || leadInfo.length < 10) return;
        
        setIsSubmitted(true);
        setTimeout(() => {
            handleDownload();
            setTimeout(() => {
                dismiss();
            }, 1500);
        }, 800);
    };

    if (!isClient || pathname !== '/') return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className={styles.overlay} onClick={dismiss}>
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={dismiss} aria-label="Dismiss">
                            <X size={24} />
                        </button>

                        <div className={styles.content}>
                            <div className={styles.imageWrapper}>
                                <div className={styles.imageCard}>
                                    <div className={styles.cornerRibbon}>
                                        <span className={styles.ribbonText}>FREE</span>
                                    </div>
                                    <Image 
                                        src="/assets/wedding-package-mockup.png" 
                                        alt="Wedding Planning PDF Guide" 
                                        width={200} 
                                        height={200}
                                        className={styles.mockupImage}
                                        priority
                                    />
                                </div>
                            </div>

                            <h2 className={styles.headline}>Free wedding planner pdf before you go...</h2>
                            
                            <p className={styles.subheadline}>
                                Claim your <strong style={{ color: '#0A252C' }}>FREE</strong> Wedding Planning PDF (worth <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>₹324</span>) with essential timelines and checklist.
                            </p>
                            
                            <p className={styles.emotionalLine}>
                                &ldquo;It&apos;s our gift to help your big day go effortlessly!&rdquo;
                            </p>

                            {/* PRIMARY CTA: Download PDF Directly */}
                            <button 
                                className={styles.primaryDownloadCTA} 
                                onClick={handleDownload}
                            >
                                <Download size={18} />
                                <span>Download PDF</span>
                            </button>

                            {/* SECONDARY / MUTED SECTION: Send on WhatsApp */}
                            <div className={styles.secondarySection}>
                                <div className={styles.divider}>
                                    <span>or get it on WhatsApp</span>
                                </div>

                                <div className={styles.mutedInputGroup}>
                                    <div className={styles.compactPrefix}>
                                        <Image src="https://flagcdn.com/in.svg" alt="India" width={16} height={12} />
                                        <span>+91</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Enter WhatsApp number" 
                                        className={styles.compactInput}
                                        value={leadInfo}
                                        onChange={(e) => setLeadInfo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        disabled={isSubmitted}
                                    />
                                    <button 
                                        className={styles.secondarySendBtn} 
                                        onClick={handleLeadSubmit}
                                        disabled={isSubmitted || leadInfo.length < 10}
                                        title="Send PDF copy to WhatsApp"
                                    >
                                        {isSubmitted ? <Check size={14} /> : <Send size={14} />}
                                        <span>{isSubmitted ? 'Sent' : 'Send'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
