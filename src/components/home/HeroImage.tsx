'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, ClipboardCheck, Users, BarChart, Smartphone, Calendar } from 'lucide-react';
import styles from './hero-image.module.css';

const SLIDE_DURATION = 8000; // 8 seconds per slide

const SLIDES = [
    {
        id: 'invite-card',
        src: '/hero-image.png',
        alt: 'Elegant traditional Indian wedding invitation design by Nimantran Studio',
        width: 500,
        height: 667,
        sizes: '(max-width: 768px) 100vw, 460px',
        wrapperClass: styles.imageWrapper,
        hasTags: true,
    },
    {
        id: 'full-suite-groom',
        src: '/hero-suite-groom.png',
        alt: 'Nimantran Studio Complete Wedding Invitation and RSVP Suite',
        width: 1024,
        height: 690,
        sizes: '(max-width: 768px) 100vw, 660px',
        wrapperClass: styles.imageWrapper2,
        hasTags: false,
    },
    {
        id: 'full-suite-bride',
        src: '/hero-image-3.png',
        alt: 'Nimantran Studio Luxury Wedding Suite & RSVP Management',
        width: 1024,
        height: 682,
        sizes: '(max-width: 768px) 100vw, 660px',
        wrapperClass: styles.imageWrapper2,
        hasTags: false,
    },
];

const HeroImage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Guaranteed safe index (0, 1, or 2)
    const activeIndex = ((currentSlide % SLIDES.length) + SLIDES.length) % SLIDES.length;

    // Auto-advance every 8 seconds continuously in loop
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.scene}>
                {/* Slide 0: Single Traditional Invite with Interactive Floating Tags */}
                <motion.div
                    className={styles.slideWrapper}
                    initial={false}
                    animate={{
                        opacity: activeIndex === 0 ? 1 : 0,
                        scale: activeIndex === 0 ? 1 : 0.97,
                        pointerEvents: activeIndex === 0 ? 'auto' : 'none',
                        zIndex: activeIndex === 0 ? 10 : 1,
                    }}
                    transition={{
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <motion.div
                        className={styles.imageWrapper}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        }}
                    >
                        <Image
                            src="/hero-image.png"
                            alt="Elegant traditional Indian wedding invitation design by Nimantran Studio"
                            width={500}
                            height={667}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                            fetchPriority="high"
                            sizes="(max-width: 768px) 100vw, 460px"
                        />
                    </motion.div>

                    {/* Floating Tags for Slide 0 */}
                    <FloatingTag
                        icon={<Smartphone size={18} />}
                        text="Create Invites"
                        delay={0.1}
                        top="12%"
                        left="-2%"
                    />
                    <FloatingTag
                        icon={<MessageCircle size={18} />}
                        text="WhatsApp Invite"
                        delay={0.15}
                        top="34%"
                        left="-10%"
                    />
                    <FloatingTag
                        icon={<Users size={18} />}
                        text="Guest Management"
                        delay={0.2}
                        top="62%"
                        left="-4%"
                    />
                    <FloatingTag
                        icon={<Calendar size={18} />}
                        text="Multi Event Control"
                        delay={0.25}
                        top="22%"
                        right="-6%"
                    />
                    <FloatingTag
                        icon={<ClipboardCheck size={18} />}
                        text="RSVP Tracking"
                        delay={0.3}
                        top="42%"
                        right="-12%"
                    />
                    <FloatingTag
                        icon={<BarChart size={18} />}
                        text="Analytics Dashboard"
                        delay={0.35}
                        top="66%"
                        right="0%"
                    />
                </motion.div>

                {/* Slide 1: Full Suite Composite Graphic (Groom Perspective) */}
                <motion.div
                    className={styles.slideWrapper}
                    initial={false}
                    animate={{
                        opacity: activeIndex === 1 ? 1 : 0,
                        scale: activeIndex === 1 ? 1 : 0.97,
                        pointerEvents: activeIndex === 1 ? 'auto' : 'none',
                        zIndex: activeIndex === 1 ? 10 : 1,
                    }}
                    transition={{
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <motion.div
                        className={styles.imageWrapper2}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        }}
                    >
                        <Image
                            src="/hero-suite-groom.png"
                            alt="Nimantran Studio Complete Wedding Invitation and RSVP Suite"
                            width={1024}
                            height={690}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                            sizes="(max-width: 768px) 100vw, 660px"
                        />
                    </motion.div>
                </motion.div>

                {/* Slide 2: Full Suite Graphic (Bride / Woman in Pink Perspective) */}
                <motion.div
                    className={styles.slideWrapper}
                    initial={false}
                    animate={{
                        opacity: activeIndex === 2 ? 1 : 0,
                        scale: activeIndex === 2 ? 1 : 0.97,
                        pointerEvents: activeIndex === 2 ? 'auto' : 'none',
                        zIndex: activeIndex === 2 ? 10 : 1,
                    }}
                    transition={{
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <motion.div
                        className={styles.imageWrapper2}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        }}
                    >
                        <Image
                            src="/hero-image-3.png"
                            alt="Nimantran Studio Luxury Wedding Suite & RSVP Management"
                            width={1024}
                            height={682}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                            sizes="(max-width: 768px) 100vw, 660px"
                        />
                    </motion.div>
                </motion.div>

                {/* Subtle Minimal Carousel Indicator Capsule */}
                <div className={styles.carouselIndicators} role="tablist" aria-label="Hero Carousel Navigation">
                    {SLIDES.map((_, idx) => {
                        const isActive = activeIndex === idx;
                        return (
                            <button
                                key={idx}
                                type="button"
                                className={`${styles.indicatorDot} ${isActive ? styles.activeDot : ''}`}
                                onClick={() => setCurrentSlide(idx)}
                                aria-label={`Switch to slide ${idx + 1}`}
                                aria-selected={isActive}
                                role="tab"
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Helper Component for Tags
const FloatingTag = ({ icon, text, delay, top, left, right, bottom }: { icon: React.ReactNode, text: string, delay: number, top?: string, left?: string, right?: string, bottom?: string }) => {
    return (
        <motion.div
            className={styles.tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                type: "spring",
                bounce: 0,
                duration: 0.6,
                delay: delay
            }}
            style={{ top, left, right, bottom }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
        >
            <span className={styles.tagIcon}>{icon}</span>
            <span>{text}</span>
        </motion.div>
    );
};

export default HeroImage;
