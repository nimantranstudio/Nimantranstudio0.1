'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export const FloatingHearts = () => {
    const [hearts, setHearts] = useState<{ id: number; left: string; duration: number; delay: number; scale: number }[]>([]);

    useEffect(() => {
        const newHearts = Array.from({ length: 15 }).map((_, i) => {
            const duration = Math.random() * 10 + 15; // 15-25s
            return {
                id: i,
                left: `${Math.random() * 100}%`,
                duration,
                delay: -Math.random() * duration, // Start mid-animation
                scale: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
            };
        });
        setHearts(newHearts);
    }, []);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }} aria-hidden="true">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 1, 1, 0], // Fade in, stay, fade out
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: 'linear',
                    }}
                    style={{
                        position: 'absolute',
                        left: heart.left,
                        scale: heart.scale,
                    }}
                >
                    <Heart
                        size={24}
                        fill="currentColor"
                        color="#D4AF37" // Manual Gold color since variable might not work in some contexts, but sticking to logic
                        style={{ opacity: 0.2, color: 'var(--primary)' }}
                    />
                </motion.div>
            ))}
        </div>
    );
};
