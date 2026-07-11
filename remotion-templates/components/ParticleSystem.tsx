import React from "react";
import { useCurrentFrame } from "remotion";
import { useParticles } from "../hooks/useParticles";

interface ParticleSystemProps {
  count?: number;
  color?: string;
  seed?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 150,
  color = "rgba(253, 224, 71, 0.45)", // Warm gold default
  seed = 42,
}) => {
  const frame = useCurrentFrame();
  const particles = useParticles(count, seed);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => {
        // Calculate dynamic vertical loop position
        const currentY = ((p.y - frame * p.speedY) % 100 + 100) % 100;
        
        // Sway sideways horizontally using sine wave
        const currentX = p.x + Math.sin(frame * 0.02 + p.phase) * (p.amplitude * 0.08);

        // Soft twinkling shimmer opacity over time
        const shimmerOpacity = p.opacity * (0.6 + Math.sin(frame * 0.1 + p.id) * 0.4);

        return (
          <div
            key={`particle-${p.id}`}
            style={{
              position: "absolute",
              left: `${currentX}%`,
              top: `${currentY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: shimmerOpacity,
              transform: "translate(-50%, -50%)",
              boxShadow: p.size > 5 ? `0 0 8px ${color}` : "none",
              filter: p.size > 6 ? "blur(0.5px)" : "none",
            }}
          />
        );
      })}
    </div>
  );
};
export default ParticleSystem;
