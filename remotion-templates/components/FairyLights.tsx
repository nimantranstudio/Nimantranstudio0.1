import React from "react";
import { useCurrentFrame } from "remotion";

interface BulbProps {
  x: number;
  y: number;
  id: number;
}

const TwinklingBulb: React.FC<BulbProps> = ({ x, y, id }) => {
  const frame = useCurrentFrame();

  // Twist twinkle timing offsets for individual bulbs
  const glow = 0.55 + Math.sin(frame * 0.12 + id * 1.5) * 0.45;
  const color = `rgba(254, 240, 138, ${0.4 + glow * 0.6})`; // Warm yellow/white light

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow aura */}
      <circle
        cx="0"
        cy="0"
        r="14"
        fill="radial-gradient(circle, rgba(253,224,71,0.5) 0%, rgba(253,224,71,0) 70%)"
        style={{
          fill: "radial-gradient(circle, rgba(253,224,71,0.6) 0%, rgba(0,0,0,0) 80%)",
          opacity: glow,
          filter: "blur(2.5px)",
        }}
      />
      {/* Light ray beam */}
      <circle
        cx="0"
        cy="0"
        r="4.5"
        fill={color}
        style={{ filter: "drop-shadow(0px 0px 4px rgba(253,224,71,0.8))" }}
      />
      {/* Socket holder */}
      <rect x="-2" y="-5" width="4" height="4" fill="#4B5563" />
    </g>
  );
};

export const FairyLights: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "300px",
        zIndex: 8,
        pointerEvents: "none",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wire strings (catenary curve approximation) */}
        <path
          d="M0,40 Q135,100 270,40 Q405,100 540,40 Q675,100 810,40 Q945,100 1080,40"
          stroke="#374151"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M0,100 Q135,170 270,100 Q405,170 540,100 Q675,170 810,100 Q945,170 1080,100"
          stroke="#374151"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />

        {/* Top Wire Bulbs */}
        {Array.from({ length: 25 }).map((_, i) => {
          const t = i / 24; // 0 to 1
          const x = t * 1080;
          
          // Calculate height matching path curve Q formula: (1-t)^2*y0 + 2(1-t)*t*y1 + t^2*y2
          // Using simpler sine approximation for ease:
          const y = 40 + Math.sin(t * Math.PI * 4) * 30;
          
          return <TwinklingBulb key={`bulb-top-${i}`} x={x} y={y + 3} id={i} />;
        })}

        {/* Lower Wire Bulbs */}
        {Array.from({ length: 21 }).map((_, i) => {
          const t = i / 20;
          const x = t * 1080;
          const y = 100 + Math.sin(t * Math.PI * 4) * 35;
          return <TwinklingBulb key={`bulb-low-${i}`} x={x} y={y + 3} id={i + 100} />;
        })}
      </svg>
    </div>
  );
};
export default FairyLights;
