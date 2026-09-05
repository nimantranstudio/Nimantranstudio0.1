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
        if (!isClient || hasBeenShown || pathname !== '/') {
            setIsVisible(false);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                handleExitIntent(e);
            }
        };

        // Delay after page load before enabling exit-intent to avoid false triggers
        const timer = setTimeout(() => {
            window.addEventListener('mousemove', handleExitIntent);
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleExitIntent);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isClient, hasBeenShown, pathname, handleExitIntent]);

    const dismiss = () => {
        setIsVisible(false);
    };

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadInfo) return;
        
        // Mock submission
        setIsSubmitted(true);
        setTimeout(() => {
            dismiss();
        }, 2000);
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
                                <Image 
                                    src="/assets/wedding-package-mockup.png" 
                                    alt="Wedding Planning PDF Guide" 
                                    width={220} 
                                    height={220}
                                    className={styles.mockupImage}
                                    priority
                                />
                            </div>

                            <h2 className={styles.headline}>Before you go...</h2>
                            
                            <p className={styles.subheadline}>
                                Let us help you create an amazing inviting experience.
                            </p>
                            
                            <p className={styles.subheadline}>
                                Claim your <strong style={{color: '#0A252C'}}>FREE</strong> Wedding Planning PDF (worth <span style={{textDecoration: 'line-through', opacity: 0.6}}>₹324</span>) instantly on WhatsApp.
                            </p>
                            
                            <p className={styles.emotionalLine}>
                                &ldquo;It&apos;s our gift to help your big day go effortlessly!&rdquo;
                            </p>

                            <div className={styles.leadCapture} style={{ borderTop: 'none', marginTop: '0' }}>
                                <div className={styles.inputGroup}>
                                    <div className={styles.phonePrefix}>
                                        <Image src="https://flagcdn.com/in.svg" alt="India" width={20} height={15} />
                                        <span>+91</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Enter WhatsApp number" 
                                        className={styles.input}
                                        value={leadInfo}
                                        onChange={(e) => setLeadInfo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        disabled={isSubmitted}
                                    />
                                </div>
                                
                                <button 
                                    className={styles.primaryCTA} 
                                    onClick={handleLeadSubmit}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    disabled={isSubmitted || leadInfo.length < 10}
                                >
                                    {isSubmitted ? 'Sent Successfully!' : 'Send My Free PDF on WhatsApp'}
                                </button>
                            </div>

                            <div className={styles.actions} style={{ marginTop: '1.5rem', alignItems: 'center' }}>
                                <button className={styles.downloadLink} onClick={() => window.open('/assets/wedding-guide.pdf', '_blank')}>
                                    <Download size={16} /> Download PDF Directly
                                </button>
                                
                                <button className={styles.dismissLink} onClick={dismiss}>
                                    No thanks, I&apos;ll explore on my own
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
