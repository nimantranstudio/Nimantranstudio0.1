import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  gravity: number;
}

export const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset and clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Active particles collection
    const particles: FireworkParticle[] = [];

    // Trigger deterministic firework launches based on frames
    // Every 45 frames (1.5 seconds) we fire a burst
    const triggerBurst = (bx: number, by: number, color = "#FFD700") => {
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI * 2) / 60 + Math.random() * 0.2;
        const speed = Math.random() * 4 + 2;
        particles.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1, // upward bias
          alpha: 1.0,
          color,
          size: Math.random() * 2 + 1.5,
          gravity: 0.05,
        });
      }
    };

    // Calculate triggers at specific frames
    if (frame > 20 && frame % 50 === 0) {
      // Left firework
      triggerBurst(300, 450, "#D4AF37");
    }
    if (frame > 40 && (frame + 25) % 50 === 0) {
      // Right firework
      triggerBurst(780, 500, "#F59E0B");
    }
    if (frame > 60 && frame % 70 === 0) {
      // High center firework
      triggerBurst(540, 300, "#FEF08A");
    }

    // Step physics forward based on current frame count
    // (We simulate frame-by-frame animation by running a loop up to the current frame to keep rendering frame-reproducible)
    const runSimulation = () => {
      // We run a simple deterministic loop for the active bursts on this exact frame
      const localFrame = frame % 50; 
      
      // Clear screen
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple spark bursts rendering
      // Left burst
      const leftAge = (frame - 20) % 50;
      if (frame > 20 && leftAge < 35) {
        renderBurst(300, 450, leftAge, "#D4AF37");
      }
      
      // Right burst
      const rightAge = (frame - 45) % 50;
      if (frame > 45 && rightAge < 35) {
        renderBurst(780, 500, rightAge, "#F59E0B");
      }

      // Center high burst
      const centerAge = (frame - 60) % 70;
      if (frame > 60 && centerAge < 40) {
        renderBurst(540, 350, centerAge, "#FFF");
      }
    };

    const renderBurst = (bx: number, by: number, age: number, baseColor: string) => {
      const numSparks = 48;
      const radius = age * 5.5; // expanding circle
      const alpha = Math.max(0, 1 - age / 35);
      
      ctx.save();
      for (let i = 0; i < numSparks; i++) {
        const angle = (i * Math.PI * 2) / numSparks;
        // Gravity drop
        const dy = age * age * 0.08;
        const sx = bx + Math.cos(angle) * radius;
        const sy = by + Math.sin(angle) * radius + dy;

        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();
    };

    runSimulation();
  }, [frame]);

  return (
    <canvas
      ref={canvasRef}
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3, // Behind text
      }}
    />
  );
};
export default Fireworks;
