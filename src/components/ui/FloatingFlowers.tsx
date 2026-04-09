'use client';

import { useEffect, useState } from 'react';

const MarigoldPetal = ({ color }: { color: string }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M20 5C20 5 32 15 28 25C24 35 20 38 20 38C20 38 16 35 12 25C8 15 20 5 20 5Z" 
            fill={color} 
            fillOpacity="0.9"
        />
        <path 
            d="M20 8C20 8 28 16 26 24C24 32 20 34 20 34C20 34 16 32 14 24C12 16 20 8 20 8Z" 
            fill={color} 
            fillOpacity="0.6"
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
    }[]>([]);

    useEffect(() => {
        const colors = ['#E67E22', '#F1C40F', '#E74C3C', '#D35400', '#F39C12'];
        const newPetals = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 15 + 15}s`, 
            delay: `-${Math.random() * 30}s`,
            scale: Math.random() * 0.6 + 0.4,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setPetals(newPetals);
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }} aria-hidden="true">
            <style>{`
                @keyframes flowerFall {
                    0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(20px); opacity: 0; }
                }
            `}</style>
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    style={{
                        position: 'absolute',
                        left: petal.left,
                        top: '-40px',
                        scale: petal.scale,
                        animation: `flowerFall ${petal.duration} linear infinite`,
                        animationDelay: petal.delay,
                        transform: `rotate(${petal.rotation}deg)`
                    }}
                >
                    <MarigoldPetal color={petal.color} />
                </div>
            ))}
        </div>
    );
};
