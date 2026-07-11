import React from "react";
import { useCurrentFrame } from "remotion";
import { useGlow } from "../hooks/useGlow";

interface LanternProps {
  x: string | number;
  y: string | number;
  height?: number;
  scale?: number;
  swingSpeed?: number;
  swingAmp?: number;
  phaseOffset?: number;
  color?: string;
}

export const Lantern: React.FC<LanternProps> = ({
  x,
  y,
  height = 350,
  scale = 1.0,
  swingSpeed = 0.045,
  swingAmp = 0.75, // max 0.8 degrees
  phaseOffset = 0.0,
  color = "#D4AF37", // Elegant gold color
}) => {
  const frame = useCurrentFrame();
  const glow = useGlow(0.08, 0.65, 1.25); // breathing brightness

  // Swing pendulum angle calculation using sine wave
  const swingAngle = Math.sin(frame * swingSpeed + phaseOffset) * swingAmp;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        height: `${height}px`,
        transform: `scale(${scale}) rotate(${swingAngle}deg)`,
        transformOrigin: "top center",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Dynamic Radial Glow Background behind lantern glass */}
      <div
        style={{
          position: "absolute",
          top: `${height * 0.45}px`,
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(253, 224, 71, 0.4) 0%, rgba(253, 186, 116, 0.1) 40%, rgba(0, 0, 0, 0) 70%)`,
          transform: "translate(-50%, -50%)",
          left: "50%",
          opacity: glow,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Volumetric Light Rays underneath */}
      <div
        style={{
          position: "absolute",
          top: `${height * 0.7}px`,
          width: "80px",
          height: "180px",
          clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
          background: `linear-gradient(to bottom, rgba(253, 224, 71, ${0.15 * glow}) 0%, rgba(0, 0, 0, 0) 100%)`,
          transform: "translateX(-50%)",
          left: "50%",
          pointerEvents: "none",
          zIndex: -2,
        }}
      />

      {/* Royal Hanging Lantern Vector SVG */}
      <svg
        width="60"
        height={height}
        viewBox={`0 0 60 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.5))" }}
      >
        {/* Hanging Chain */}
        <line
          x1="30"
          y1="0"
          x2="30"
          y2={height * 0.4}
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />

        {/* Chain connector ring */}
        <circle cx="30" cy={height * 0.4} r="4" stroke={color} strokeWidth="2" />

        {/* Dome Cap */}
        <path
          d={`M18 ${height * 0.42} C 18 ${height * 0.38}, 42 ${height * 0.38}, 42 ${height * 0.42} Z`}
          fill={color}
        />
        <path
          d={`M10 ${height * 0.45} C 10 ${height * 0.41}, 50 ${height * 0.41}, 50 ${height * 0.45} Z`}
          fill={color}
          opacity="0.9"
        />

        {/* Lantern Glass Body Grid */}
        <rect
          x="14"
          y={height * 0.45}
          width="32"
          height="45"
          rx="10"
          fill="rgba(255, 235, 150, 0.4)"
          stroke={color}
          strokeWidth="3"
        />

        {/* Inner Glowing Candle Core */}
        <ellipse
          cx="30"
          cy={height * 0.53}
          rx="8"
          ry="15"
          fill="#FFFDF0"
          opacity={0.8 + glow * 0.2}
          style={{ filter: "blur(2px)" }}
        />

        {/* Ornate Cage Bars */}
        <path
          d={`M30 ${height * 0.45} L30 ${height * 0.6}`}
          stroke={color}
          strokeWidth="2.5"
        />
        <path
          d={`M20 ${height * 0.45} C24 ${height * 0.52}, 24 ${height * 0.53}, 20 ${height * 0.6}`}
          stroke={color}
          strokeWidth="2"
        />
        <path
          d={`M40 ${height * 0.45} C36 ${height * 0.52}, 36 ${height * 0.53}, 40 ${height * 0.6}`}
          stroke={color}
          strokeWidth="2"
        />

        {/* Bottom Base plate */}
        <rect
          x="10"
          y={height * 0.6}
          width="40"
          height="8"
          rx="2"
          fill={color}
        />

        {/* Decorative Tassel */}
        <path
          d={`M27 ${height * 0.62} L30 ${height * 0.67} L33 ${height * 0.62} Z`}
          fill={color}
        />
        <line
          x1="30"
          y1={height * 0.67}
          x2="30"
          y2={height * 0.72}
          stroke={color}
          strokeWidth="3"
        />
        <circle cx="30" cy={height * 0.72} r="3.5" fill={color} />
      </svg>
    </div>
  );
};
export default Lantern;
