'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, ClipboardCheck, Users, BarChart, Smartphone, Calendar } from 'lucide-react';
import styles from './hero-image.module.css';

const HeroImage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.scene}>
                <div className={styles.slideWrapper}>
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

                    {/* Floating Feature Tags */}
                    <FloatingTag
                        icon={<Smartphone size={18} />}
                        text="Create Invites"
                        delay={0.1}
                        top="12%"
                        left="-2%"
                    />
                    <FloatingTag
                        icon={<Globe size={18} />}
                        text="Wedding Website"
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
