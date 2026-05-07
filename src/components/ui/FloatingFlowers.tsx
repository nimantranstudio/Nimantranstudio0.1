'use client';

import { useEffect, useState } from 'react';

const RosePetal = ({ color }: { color: string }) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 4C18 4 28 12 25 22C22 32 18 34 18 34C18 34 14 32 11 22C8 12 18 4 18 4Z"
            fill={color}
            fillOpacity="0.88"
        />
        <path
            d="M18 8C18 8 25 14 23 22C21 30 18 32 18 32C18 32 15 30 13 22C11 14 18 8 18 8Z"
            fill={color}
            fillOpacity="0.45"
        />
    </svg>
);

export const FloatingFlowers = () => {
    const [petals, setPetals] = useState<{
        id: number;
        left: string;
        duration: string;
        delay: string;
        scale: number;
        rotation: number;
        color: string;
        blur: string;
    }[]>([]);

    useEffect(() => {
        const colors = [
            '#F2C4CE', // blush pink
            '#E8A8B2', // soft rose
            '#F5ECD7', // antique white
            '#E8D5A3', // champagne gold
            '#D4B8C0', // dusty mauve
            '#FAE8D8', // peach cream
        ];
        const newPetals = Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 12 + 26}s`,
            delay: `-${Math.random() * 35}s`,
            scale: Math.random() * 0.5 + 0.4,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            blur: Math.random() > 0.65 ? '1px' : '0px',
        }));
        setPetals(newPetals);
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }} aria-hidden="true">
            <style>{`
                @keyframes flowerFall {
                    0%   { transform: translateY(-8vh) rotate(0deg) translateX(0);   opacity: 0; }
                    8%   { opacity: 0.75; }
                    92%  { opacity: 0.75; }
                    100% { transform: translateY(108vh) rotate(180deg) translateX(15px); opacity: 0; }
                }
            `}</style>
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    style={{
                        position: 'absolute',
                        left: petal.left,
                        top: '-36px',
                        filter: `blur(${petal.blur})`,
                        animation: `flowerFall ${petal.duration} ease-in-out infinite`,
                        animationDelay: petal.delay,
                        transform: `scale(${petal.scale}) rotate(${petal.rotation}deg)`,
                    }}
                >
                    <RosePetal color={petal.color} />
                </div>
            ))}
        </div>
    );
};
