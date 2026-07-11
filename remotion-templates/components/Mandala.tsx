import React from "react";
import { useCurrentFrame } from "remotion";

interface MandalaProps {
  rotationSpeed?: number;
  size?: number;
  color?: string;
  opacity?: number;
}

export const Mandala: React.FC<MandalaProps> = ({
  rotationSpeed = 0.15, // degrees per frame
  size = 650,
  color = "#D4AF37", // Ornate gold
  opacity = 0.06, // very subtle background watermark
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * rotationSpeed;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transformOrigin: "center center",
        opacity: opacity,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke={color}
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="0.25" />
        
        {/* Procedurally rotate design rays to create an intricate geometric mandala */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`spoke-${i}`} transform={`rotate(${angle} 50 50)`}>
              {/* Petals */}
              <path
                d="M50 8 C53 25, 47 25, 50 50 C47 25, 53 25, 50 8 Z"
                stroke={color}
                strokeWidth="0.35"
              />
              <path
                d="M50 20 C56 32, 44 32, 50 50"
                stroke={color}
                strokeWidth="0.2"
              />
              <ellipse
                cx="50"
                cy="32"
                rx="2"
                ry="4"
                stroke={color}
                strokeWidth="0.25"
              />
              <circle cx="50" cy="22" r="1" fill={color} />
            </g>
          );
        })}

        {/* Inner concentric rings */}
        <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="0.35" />
        <circle
          cx="50"
          cy="50"
          r="22"
          stroke={color}
          strokeWidth="0.25"
          strokeDasharray="1 1"
        />
        <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="4" fill={color} />
      </svg>
    </div>
  );
};
export default Mandala;
