"use client";

import { useEffect, useRef } from "react";

interface ConnectingDotsProps {
    color?: string;
    count?: number;
    className?: string;
}

export const ConnectingDots = ({
    color = "#1B5E20",
    count = 50,
    className = ""
}: ConnectingDotsProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        const particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
            opacitySpeed: number;
            growing: boolean;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2; // Slower movement
                this.vy = (Math.random() - 0.5) * 0.2;

                // Varied sizes: some small, some big
                this.size = Math.random() < 0.8 ? Math.random() * 2 + 1 : Math.random() * 3 + 3;

                // Opacity animation props
                this.opacity = Math.random();
                this.opacitySpeed = Math.random() * 0.01 + 0.005;
                this.growing = Math.random() > 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Pulse opacity
                if (this.growing) {
                    this.opacity += this.opacitySpeed;
                    if (this.opacity >= 0.8) this.growing = false;
                } else {
                    this.opacity -= this.opacitySpeed;
                    if (this.opacity <= 0.1) this.growing = true;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity)); // Clamp opacity
                ctx.fill();
            }
        }

        // Init
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [color, count]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
};
