'use client';

import { useEffect, useState } from 'react';

const RosePetal = ({ color }: { color: string }) => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M30 15C30 15 45 25 40 40C35 55 30 58 30 58C30 58 25 55 20 40C15 25 30 15 30 15Z" 
            fill={color} 
            fillOpacity="0.85"
        />
        <path 
            d="M30 20C30 20 42 28 38 40C34 52 30 55 30 55C30 55 26 52 22 40C18 28 30 20 30 20Z" 
            fill={color} 
            fillOpacity="0.5"
        />
    </svg>
);

export const FlowerPetalDrift = () => {
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
            '#F9E7E7', // Soft Pink
            '#F4CFD0', // Rose Pink
            '#E7A1A2', // Deep Rose
            '#FDF2F2', // White-Pink
            '#FFD1DC'  // Cherry Blossom
        ];
        
        const newPetals = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 4 + 6}s`, // Faster drift for immediate visibility
            delay: '0s', // No delay, start immediately
            scale: Math.random() * 0.8 + 0.5,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            blur: Math.random() > 0.7 ? '2px' : '0px'
        }));
        setPetals(newPetals);
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 9999 }} aria-hidden="true">
            <style>{`
                @keyframes petalDrift {
                    0% { 
                        transform: translateY(-20vh) rotate(0deg) translateX(0); 
                        opacity: 0; 
                    }
                    10% { 
                        opacity: 0.9; 
                    }
                    90% { 
                        opacity: 0.9; 
                    }
                    100% { 
                        transform: translateY(110vh) rotate(540deg) translateX(100px); 
                        opacity: 0; 
                    }
                }
            `}</style>
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    style={{
                        position: 'absolute',
                        left: petal.left,
                        top: '-60px',
                        scale: petal.scale,
                        filter: `blur(${petal.blur})`,
                        animation: `petalDrift ${petal.duration} linear forwards`,
                        animationDelay: petal.delay,
                        transform: `rotate(${petal.rotation}deg)`
                    }}
                >
                    <RosePetal color={petal.color} />
                </div>
            ))}
        </div>
    );
};
