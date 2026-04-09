'use client';

import React from 'react';
import styles from './MandalaBackground.module.css';

export const MandalaBackground = () => {
    return (
        <div className={styles.mandalaWrapper}>
            <svg
                width="1000"
                height="1000"
                viewBox="0 0 400 400"
                className={styles.mandalaSvg}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer points removed for softer aesthetic */}

                {/* --- LAYER 2: Large Lotus Petals --- */}
                <g className={styles.layerLotus}>
                    {[...Array(16)].map((_, i) => (
                        <path
                            key={`l2-${i}`}
                            d="M200 30 C 240 80, 240 130, 200 160 C 160 130, 160 80, 200 30"
                            transform={`rotate(${i * 22.5} 200 200)`}
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeOpacity="0.8"
                        />
                    ))}
                </g>

                {/* --- LAYER 3: Intricate Dotted Ring --- */}
                <g>
                    {[...Array(96)].map((_, i) => (
                        <circle
                            key={`dot-${i}`}
                            cx="200"
                            cy="125"
                            r="1"
                            transform={`rotate(${i * 3.75} 200 200)`}
                            fill="currentColor"
                            fillOpacity="0.6"
                        />
                    ))}
                </g>

                {/* --- LAYER 4: Gear Geometry --- */}
                <g className={styles.layerGear}>
                    {[...Array(32)].map((_, i) => (
                        <rect
                            key={`r-${i}`}
                            x="198"
                            y="140"
                            width="4"
                            height="12"
                            transform={`rotate(${i * 11.25} 200 200)`}
                            stroke="currentColor"
                            strokeWidth="0.5"
                            strokeOpacity="0.4"
                        />
                    ))}
                </g>

                {/* --- LAYER 5: Interlocking Rings --- */}
                <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.25" strokeOpacity="1" />
                <circle cx="200" cy="200" r="105" stroke="currentColor" strokeWidth="0.75" strokeDasharray="5 10" />
                <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="0.25" strokeOpacity="0.5" />

                {/* --- LAYER 6: Inner Mango/Paisley Pattern --- */}
                <g className={styles.layerPaisley}>
                    {[...Array(12)].map((_, i) => (
                        <path
                            key={`p-${i}`}
                            d="M200 160 C 220 180, 220 200, 200 220 C 180 200, 180 180, 200 160"
                            transform={`rotate(${i * 30} 200 200)`}
                            fill="currentColor"
                            fillOpacity="0.1"
                            stroke="currentColor"
                            strokeWidth="0.5"
                        />
                    ))}
                </g>

                {/* --- LAYER 7: Diamond Core --- */}
                <g>
                    {[...Array(24)].map((_, i) => (
                        <path
                            key={`d-${i}`}
                            d="M200 175 L206 185 L200 195 L194 185 Z"
                            transform={`rotate(${i * 15} 200 200)`}
                            stroke="currentColor"
                            strokeWidth="0.75"
                        />
                    ))}
                </g>

                {/* --- LAYER 8: Sunburst Heart --- */}
                <circle cx="200" cy="200" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" />
                <circle cx="200" cy="200" r="15" fill="currentColor" fillOpacity="0.2" />
                {[...Array(36)].map((_, i) => (
                    <line
                        key={`sun-${i}`}
                        x1="200" y1="185"
                        x2="200" y2="190"
                        transform={`rotate(${i * 10} 200 200)`}
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />
                ))}
            </svg>
        </div>
    );
};
