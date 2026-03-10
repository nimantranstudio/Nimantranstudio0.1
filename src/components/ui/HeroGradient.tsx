'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroGradient.module.css';

const HeroGradient = () => {
    return (
        <div className={styles.wrapper}>
            {/* Golden/Champagne Blob */}
            <motion.div
                className={`${styles.blob} ${styles.gold}`}
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 80, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Soft Rose Blob */}
            <motion.div
                className={`${styles.blob} ${styles.rose}`}
                animate={{
                    x: [0, -80, 120, 0],
                    y: [0, 100, -60, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Soft Blue/Teal Blob */}
            <motion.div
                className={`${styles.blob} ${styles.blue}`}
                animate={{
                    x: [0, 60, -100, 0],
                    y: [0, 120, 50, 0],
                    scale: [1, 1.1, 0.8, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default HeroGradient;
