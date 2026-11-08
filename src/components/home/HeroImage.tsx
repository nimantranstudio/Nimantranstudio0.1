'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Globe, ClipboardCheck, Users, BarChart, Smartphone, Calendar } from 'lucide-react';
import styles from './hero-image.module.css';
import { HeroMobileScreen } from './HeroMobileScreen';

const HeroImage = () => {
    // 0 = Couple Image, 1 = Mobile Wedding Invitation Screen
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isInteracting, setIsInteracting] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-advance carousel every 10 seconds (paused while user interacts with the phone)
    useEffect(() => {
        if (isInteracting) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev === 0 ? 1 : 0));
        }, 10000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isInteracting]);

    const handleSelectSlide = (idx: number) => {
        setActiveIndex(idx);
        // Reset 10-second interval when user manually clicks indicator
        if (timerRef.current) clearInterval(timerRef.current);
        if (!isInteracting) {
            timerRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev === 0 ? 1 : 0));
            }, 10000);
        }
    };

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
        >
            <div className={styles.scene}>
                {/* Unified floating container: floats once on parent so slides never shear out-of-phase */}
                <div className={styles.carouselDisplayArea}>
                    {/* Slide 0: Couple Image */}
                    <div
                        className={`${styles.slideContent} ${activeIndex === 0 ? styles.slideVisible : styles.slideHidden}`}
                    >
                        <div className={styles.imageWrapper}>
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
                        </div>
                    </div>

                    {/* Slide 1: Mobile Wedding Invitation Screen - Preloaded in DOM from first paint */}
                    <div
                        className={`${styles.slideContent} ${activeIndex === 1 ? styles.slideVisible : styles.slideHidden}`}
                    >
                        <div className={styles.phoneWrapper}>
                            <HeroMobileScreen onInteract={(interacting) => setIsInteracting(interacting)} />
                        </div>
                    </div>
                </div>

                {/* Floating Feature Tags */}
                <FloatingTag
                    icon={<Smartphone size={18} />}
                    text="Create Invites"
                    top="12%"
                    left="2%"
                />
                <FloatingTag
                    icon={<Globe size={18} />}
                    text="Wedding Website"
                    top="34%"
                    left="-6%"
                />
                <FloatingTag
                    icon={<Users size={18} />}
                    text="Guest Management"
                    top="62%"
                    left="0%"
                />
                <FloatingTag
                    icon={<Calendar size={18} />}
                    text="Multi Event Control"
                    top="22%"
                    right="-2%"
                />
                <FloatingTag
                    icon={<ClipboardCheck size={18} />}
                    text="RSVP Tracking"
                    top="42%"
                    right="-8%"
                />
                <FloatingTag
                    icon={<BarChart size={18} />}
                    text="Analytics Dashboard"
                    top="66%"
                    right="2%"
                />

                {/* Carousel Indicators Below Image */}
                <div className={styles.carouselIndicators} role="tablist" aria-label="Hero visual carousel">
                    <button
                        type="button"
                        className={`${styles.indicatorDot} ${activeIndex === 0 ? styles.activeDot : ''}`}
                        onClick={() => handleSelectSlide(0)}
                        aria-label="Couple photo slide"
                        aria-selected={activeIndex === 0}
                        role="tab"
                    />
                    <button
                        type="button"
                        className={`${styles.indicatorDot} ${activeIndex === 1 ? styles.activeDot : ''}`}
                        onClick={() => handleSelectSlide(1)}
                        aria-label="Mobile wedding invitation slide"
                        aria-selected={activeIndex === 1}
                        role="tab"
                    />
                </div>
            </div>
        </div>
    );
};

// Helper Component for Tags
const FloatingTag = ({
    icon,
    text,
    top,
    left,
    right,
    bottom,
}: {
    icon: React.ReactNode;
    text: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
}) => {
    return (
        <div
            className={styles.tag}
            style={{ top, left, right, bottom }}
        >
            <span className={styles.tagIcon}>{icon}</span>
            <span>{text}</span>
        </div>
    );
};

export default HeroImage;

