import React from "react";
import { useCurrentFrame } from "remotion";

interface MandalaProps {
  rotationSpeed?: number;
  size?: number;
  color?: string;
  opacity?: number;
  position?: "center" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
  x?: number | string;
  y?: number | string;
}

export const Mandala: React.FC<MandalaProps> = ({
  rotationSpeed = 0.1, // degrees per frame (smooth slow rotation)
  size = 750,
  color = "#D4AF37", // Ornate gold
  opacity = 0.25, // refined background watermark
  position = "bottom-left",
  x,
  y
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * rotationSpeed;

  let posStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
  };

  if (position === "bottom-left") {
    posStyle = {
      position: "absolute",
      left: x !== undefined ? (typeof x === "number" ? `${x}px` : x) : "-150px",
      bottom: y !== undefined ? (typeof y === "number" ? `${y}px` : y) : "-150px",
      transform: `rotate(${rotation}deg)`,
    };
  } else if (position === "bottom-right") {
    posStyle = {
      position: "absolute",
      right: x !== undefined ? (typeof x === "number" ? `${x}px` : x) : "-150px",
      bottom: y !== undefined ? (typeof y === "number" ? `${y}px` : y) : "-150px",
      transform: `rotate(${rotation}deg)`,
    };
  } else if (position === "top-right") {
    posStyle = {
      position: "absolute",
      right: x !== undefined ? (typeof x === "number" ? `${x}px` : x) : "-150px",
      top: y !== undefined ? (typeof y === "number" ? `${y}px` : y) : "-150px",
      transform: `rotate(${rotation}deg)`,
    };
  } else if (position === "top-left") {
    posStyle = {
      position: "absolute",
      left: x !== undefined ? (typeof x === "number" ? `${x}px` : x) : "-150px",
      top: y !== undefined ? (typeof y === "number" ? `${y}px` : y) : "-150px",
      transform: `rotate(${rotation}deg)`,
    };
  } else if (x !== undefined || y !== undefined) {
    posStyle = {
      position: "absolute",
      left: x !== undefined ? (typeof x === "number" ? `${x}px` : x) : "50%",
      top: y !== undefined ? (typeof y === "number" ? `${y}px` : y) : "50%",
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    };
  }

  return (
    <div
      style={{
        ...posStyle,
        width: `${size}px`,
        height: `${size}px`,
        transformOrigin: "center center",
        opacity: opacity,
        zIndex: 1,
        pointerEvents: "none",
        filter: `drop-shadow(0 0 15px ${color}55)`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="remotionMandalaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.95" />
            <stop offset="40%" stopColor={color} stopOpacity="0.85" />
            <stop offset="80%" stopColor="#A87E1B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#6E4F0B" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Outer concentric frames */}
        <circle cx="250" cy="250" r="244" stroke="url(#remotionMandalaGrad)" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />
        <circle cx="250" cy="250" r="238" stroke="url(#remotionMandalaGrad)" strokeWidth="0.5" opacity="0.6" />
        <circle cx="250" cy="250" r="230" stroke="url(#remotionMandalaGrad)" strokeWidth="1.2" strokeDasharray="1 3" opacity="0.8" />
        <circle cx="250" cy="250" r="222" stroke="url(#remotionMandalaGrad)" strokeWidth="0.6" opacity="0.5" />

        {/* 48 Outer Pearl Drops */}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          return (
            <circle
              key={`outer-pearl-${i}`}
              cx="250"
              cy="10"
              r="2"
              fill="url(#remotionMandalaGrad)"
              transform={`rotate(${angle} 250 250)`}
              opacity="0.85"
            />
          );
        })}

        {/* 16 Grand Royal Lotus Petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`grand-petal-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250 20 C292 75 288 145 250 180 C212 145 208 75 250 20 Z"
                stroke="url(#remotionMandalaGrad)"
                strokeWidth="1"
                fill="url(#remotionMandalaGrad)"
                fillOpacity="0.03"
              />
              <path
                d="M250 42 C275 88 270 138 250 170 C230 138 225 88 250 42 Z"
                stroke="url(#remotionMandalaGrad)"
                strokeWidth="0.5"
                strokeDasharray="3 2"
                opacity="0.8"
              />
              <line x1="250" y1="42" x2="250" y2="170" stroke="url(#remotionMandalaGrad)" strokeWidth="0.4" opacity="0.6" />
              <circle cx="250" cy="30" r="2.2" fill="url(#remotionMandalaGrad)" opacity="0.9" />
              <circle cx="250" cy="22" r="1.2" fill="url(#remotionMandalaGrad)" opacity="0.75" />
            </g>
          );
        })}

        {/* 16 Intermediate Foliate Leaves */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16 + 11.25;
          return (
            <g key={`inter-leaf-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250 48 C274 85 268 130 250 162 C232 130 226 85 250 48 Z"
                stroke="url(#remotionMandalaGrad)"
                strokeWidth="0.75"
                fill="url(#remotionMandalaGrad)"
                fillOpacity="0.04"
              />
              <circle cx="250" cy="58" r="1.8" fill="url(#remotionMandalaGrad)" opacity="0.85" />
            </g>
          );
        })}

        {/* 32 Jali Chevron Trefoils */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32;
          return (
            <g key={`jali-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path d="M250 100 L256 118 L250 136 L244 118 Z" stroke="url(#remotionMandalaGrad)" strokeWidth="0.5" opacity="0.7" />
              <circle cx="250" cy="118" r="1" fill="url(#remotionMandalaGrad)" opacity="0.6" />
            </g>
          );
        })}

        {/* Rings & Fluted Gear */}
        <circle cx="250" cy="250" r="138" stroke="url(#remotionMandalaGrad)" strokeWidth="0.75" strokeDasharray="4 6" opacity="0.65" />
        <circle cx="250" cy="250" r="118" stroke="url(#remotionMandalaGrad)" strokeWidth="0.6" opacity="0.5" />
        {Array.from({ length: 64 }).map((_, i) => {
          const angle = (i * 360) / 64;
          return (
            <circle
              key={`gear-dot-${i}`}
              cx="250"
              cy="128"
              r="0.9"
              fill="url(#remotionMandalaGrad)"
              transform={`rotate(${angle} 250 250)`}
              opacity="0.75"
            />
          );
        })}

        {/* 16 Paisley / Ambia Motifs */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`paisley-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250 136 C272 160 272 184 250 208 C228 184 228 160 250 136"
                stroke="url(#remotionMandalaGrad)"
                strokeWidth="0.65"
                fill="url(#remotionMandalaGrad)"
                fillOpacity="0.06"
              />
              <circle cx="250" cy="164" r="2.2" fill="url(#remotionMandalaGrad)" opacity="0.8" />
            </g>
          );
        })}

        {/* 24 Sunburst Star Rays */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <g key={`sunburst-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250 172 L256 188 L250 204 L244 188 Z"
                stroke="url(#remotionMandalaGrad)"
                strokeWidth="0.5"
                fill="url(#remotionMandalaGrad)"
                fillOpacity="0.1"
              />
              <line x1="250" y1="172" x2="250" y2="184" stroke="url(#remotionMandalaGrad)" strokeWidth="0.5" opacity="0.8" />
            </g>
          );
        })}

        {/* Rings */}
        <circle cx="250" cy="250" r="44" stroke="url(#remotionMandalaGrad)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.75" />
        <circle cx="250" cy="250" r="36" stroke="url(#remotionMandalaGrad)" strokeWidth="0.5" opacity="0.5" />

        {/* 8 Core Sacred Lotus Petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <g key={`core-petal-${i}`} transform={`rotate(${angle} 250 250)`}>
              <path
                d="M250 208 C262 222 262 236 250 246 C238 236 238 222 250 208 Z"
                fill="url(#remotionMandalaGrad)"
                fillOpacity="0.18"
                stroke="url(#remotionMandalaGrad)"
                strokeWidth="0.75"
              />
              <circle cx="250" cy="216" r="1.5" fill="url(#remotionMandalaGrad)" opacity="0.9" />
            </g>
          );
        })}

        {/* Central Bindu Core */}
        <circle cx="250" cy="250" r="22" stroke="url(#remotionMandalaGrad)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />
        <circle cx="250" cy="250" r="14" fill="url(#remotionMandalaGrad)" fillOpacity="0.25" stroke="url(#remotionMandalaGrad)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="7" fill="url(#remotionMandalaGrad)" opacity="0.85" />
        <circle cx="250" cy="250" r="2.5" fill="#FFFDF0" opacity="0.95" />
      </svg>
    </div>
  );
};
export default Mandala;
