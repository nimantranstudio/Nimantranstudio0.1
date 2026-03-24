'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle, ClipboardCheck, Users, BarChart, Smartphone, Calendar } from 'lucide-react';
import styles from './hero-image.module.css';

// Placeholder image URL - will be replaced by user later
const PLACEHOLDER_IMAGE = "/hero-image.png";
// Or use a relevant image from public folder if available, e.g., distinct asset
// const PLACEHOLDER_IMAGE = "/bundle-mockup.jpg"; // Using bundle-mockup as temperary placeholder

const HeroImage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.scene}>


                {/* Central Image */}
                <motion.div
                    className={styles.imageWrapper}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Image
                        src={PLACEHOLDER_IMAGE}
                        alt="Elegant traditional Indian wedding invitation design by Nimantran Studio"
                        width={450}
                        height={600}
                        style={{ width: '100%', height: 'auto' }}
                        priority
                        sizes="(max-width: 768px) 100vw, 450px"
                    />
                </motion.div>

                {/* Floating Tags - Adjusted positions for better balance around the central image */}
                <FloatingTag
                    icon={<Smartphone size={18} />}
                    text="Create Invites"
                    delay={1.0}
                    top="15%"
                    left="0%"
                />
                <FloatingTag
                    icon={<MessageCircle size={18} />}
                    text="WhatsApp Invite"
                    delay={1.4}
                    top="35%"
                    left="-8%"
                />
                <FloatingTag
                    icon={<Users size={18} />}
                    text="Guest Management"
                    delay={1.8}
                    top="60%"
                    left="-2%"
                />
                <FloatingTag
                    icon={<Calendar size={18} />}
                    text="Multi Event Control"
                    delay={2.2}
                    top="25%"
                    right="-5%"
                />
                <FloatingTag
                    icon={<ClipboardCheck size={18} />}
                    text="RSVP Tracking"
                    delay={2.6}
                    top="40%"
                    right="-10%"
                />
                <FloatingTag
                    icon={<BarChart size={18} />}
                    text="Analytics Dashboard"
                    delay={3.0}
                    top="65%"
                    right="2%"
                />
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
                y: [0, -6, 0] 
            }}
            transition={{
                opacity: { duration: 0.8, delay: delay },
                scale: { duration: 0.8, delay: delay },
                y: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: delay
                }
            }}
            style={{ top, left, right, bottom }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2, repeat: 0 } }}
        >
            <span className={styles.tagIcon}>{icon}</span>
            <span>{text}</span>
        </motion.div>
    );
};

export default HeroImage;
