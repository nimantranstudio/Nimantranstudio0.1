'use client';

import React, { useEffect, useRef } from 'react';

const GOLD_FIREFLY_PALETTE = [
    { r: 218, g: 175, b: 65 },   // Soft Classic Gold #DAAF41
    { r: 238, g: 205, b: 130 },  // Champagne Gold #EECD82
    { r: 198, g: 152, b: 32 },   // Muted Warm Amber #C69820
    { r: 228, g: 192, b: 115 },  // Pale Golden Sand #E4C073
    { r: 212, g: 166, b: 55 },   // Soft Warm Ochre #D4A637
    { r: 245, g: 220, b: 145 },  // Luminous Pale Gold #F5DC91
];

interface FireflyParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseRadius: number;
    radius: number;
    pulseAngle: number;
    pulseSpeed: number;
    basePulse: number;
    wanderAngle: number;
    wanderSpeed: number;
    color: { r: number; g: number; b: number };
    isMajorFirefly: boolean;
}

interface AmbientParticlesProps {
    count?: number;
    className?: string;
    opacity?: number;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({
    count = 46,
    className = '',
    opacity = 0.90
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Check for prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isReducedMotion = motionQuery.matches;
        const handleMotionChange = (e: MediaQueryListEvent) => {
            isReducedMotion = e.matches;
        };
        motionQuery.addEventListener('change', handleMotionChange);

        let animationFrameId: number;
        let isVisible = true;
        let width = 0;
        let height = 0;
        let dpr = 1;

        const updateSize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };

        updateSize();

        // Initialize golden fireflies with organic wandering flight and pulsing light flares
        const particles: FireflyParticle[] = [];
        for (let i = 0; i < count; i++) {
            const color = GOLD_FIREFLY_PALETTE[Math.floor(Math.random() * GOLD_FIREFLY_PALETTE.length)];
            const isMajorFirefly = Math.random() < 0.40; // 40% distinct glowing fireflies with soft light halo
            const baseRadius = isMajorFirefly ? Math.random() * 1.5 + 2.5 : Math.random() * 1.0 + 1.3;

            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.32,
                vy: -Math.random() * 0.24 - 0.10,
                baseRadius,
                radius: baseRadius,
                pulseAngle: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.020 + 0.010, // Natural breathing rhythm
                basePulse: Math.random() * 0.14 + 0.18,
                wanderAngle: Math.random() * Math.PI * 2,
                wanderSpeed: Math.random() * 0.018 + 0.008,
                color,
                isMajorFirefly,
            });
        }

        // Handle window blur / tab hidden (resource conservation)
        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const handleResize = () => {
            updateSize();
        };
        window.addEventListener('resize', handleResize);

        // Render loop with firefly bioluminescent glow & floating physics
        const render = () => {
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!isReducedMotion) {
                    // Organic wandering flight
                    p.wanderAngle += (Math.random() - 0.5) * 0.06;
                    p.vx += Math.cos(p.wanderAngle) * 0.012;
                    p.vy += Math.sin(p.wanderAngle) * 0.012 - 0.003; // Gentle upward buoyancy

                    // Damping to keep movement slow, graceful and calming
                    p.vx *= 0.985;
                    p.vy = Math.max(-0.45, Math.min(0.2, p.vy * 0.985));

                    p.x += p.vx;
                    p.y += p.vy;

                    // Smooth firefly flare curve: slow gentle rise and soft glow
                    p.pulseAngle += p.pulseSpeed;
                    const rawSine = (Math.sin(p.pulseAngle) + 1) / 2;
                    const flare = Math.pow(rawSine, 1.8); // Natural bioluminescent breathing curve

                    // Wrap around canvas boundaries smoothly
                    if (p.y < -40) {
                        p.y = height + 30;
                        p.x = Math.random() * width;
                    }
                    if (p.y > height + 40) p.y = -30;
                    if (p.x < -40) p.x = width + 30;
                    if (p.x > width + 40) p.x = -30;

                    const alpha = (p.basePulse + flare * 0.52) * opacity;
                    const { r, g, b } = p.color;

                    if (p.isMajorFirefly) {
                        // Radiant golden halo
                        const haloRadius = p.radius * (3.0 + flare * 1.4);
                        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
                        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.95})`);
                        grad.addColorStop(0.28, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`);
                        grad.addColorStop(0.68, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
                        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
                        ctx.fill();

                        // Soft luminous warm white-gold core bead
                        ctx.fillStyle = `rgba(255, 248, 220, ${Math.min(1, alpha * 1.2)})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius * 0.55, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Delicate ambient light speck
                        const haloRadius = p.radius * 2.0;
                        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
                        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`);
                        grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`);
                        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            motionQuery.removeEventListener('change', handleMotionChange);
        };
    }, [count, opacity]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.95,
            }}
        />
    );
};

export default AmbientParticles;
