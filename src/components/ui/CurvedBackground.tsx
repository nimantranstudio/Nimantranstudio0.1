'use client';

import { motion } from 'framer-motion';

export const CurvedBackground = () => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1440 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* 
                   Exact Reference Geometry:
                   - Large concentric circles centered BELOW and RIGHT of the viewport.
                   - This creates the effect of arcs sweeping up from bottom-right.
                   - A distinct 'Star/Sparkle' marker at a specific intersection.
                */}

                {/* Outer Arc - Shifted right to avoid text */}
                <motion.circle
                    cx="1800"
                    cy="800"
                    r="800"
                    stroke="#8B4513"
                    strokeWidth="0.5"
                    strokeOpacity="0.15"
                    fill="none"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                />

                {/* Inner Arc */}
                <motion.circle
                    cx="1800"
                    cy="800"
                    r="600"
                    stroke="#8B4513"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    fill="none"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 3, delay: 0.2, ease: "easeOut" }}
                />

                {/* Third Arc - Removed the largest one that was likely cutting the text */}


            </svg>
        </div>
    );
};
