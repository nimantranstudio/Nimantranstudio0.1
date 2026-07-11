import React from "react";
import { useCurrentFrame } from "remotion";

interface SwayingFlowerProps {
  color?: string;
  size?: number;
  rotationOffset?: number;
  style?: React.CSSProperties;
  isYellow?: boolean;
}

export const SwayingFlower: React.FC<SwayingFlowerProps> = ({
  color = "#D4AF37",
  size = 50,
  rotationOffset = 0,
  style = {},
  isYellow = false,
}) => {
  const frame = useCurrentFrame();

  // Speed and amplitude: yellow flowers swing slightly more than white
  const swaySpeed = isYellow ? 0.055 : 0.04;
  const swayAmp = isYellow ? 2.5 : 1.2; // degrees rotation swing

  const rotation = rotationOffset + Math.sin(frame * swaySpeed) * swayAmp;
  const scale = 1.0 + Math.sin(frame * 0.03) * 0.015; // gentle breathing scale

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: "center center",
        transition: "transform 0.1s ease-out",
        ...style,
      }}
    >
      {/* Decorative Vector Marigold/Lotus flower SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isYellow ? (
          // Marigold / Genda flower
          <g>
            <circle cx="50" cy="50" r="15" fill={color} />
            {Array.from({ length: 12 }).map((_, i) => {
              const rot = (i * 360) / 12;
              return (
                <g key={`petal-${i}`} transform={`rotate(${rot} 50 50)`}>
                  <ellipse cx="50" cy="28" rx="8" ry="14" fill="#F49E1A" />
                  <ellipse cx="50" cy="22" rx="6" ry="10" fill="#F4B41A" />
                  <ellipse cx="50" cy="18" rx="4" ry="7" fill="#FCD34D" />
                </g>
              );
            })}
          </g>
        ) : (
          // Luxury White Jasmine/Rose flower
          <g>
            <circle cx="50" cy="50" r="10" fill="#FFFDF0" />
            {Array.from({ length: 8 }).map((_, i) => {
              const rot = (i * 360) / 8;
              return (
                <g key={`petal-white-${i}`} transform={`rotate(${rot} 50 50)`}>
                  <path
                    d="M50 50 C40 20, 60 20, 50 15 Z"
                    fill="#FFFFF0"
                    stroke="#E2E8F0"
                    strokeWidth="0.5"
                  />
                  <ellipse cx="50" cy="30" rx="7" ry="11" fill="#FFFDF5" />
                  <ellipse cx="50" cy="22" rx="4" ry="7" fill="#FFFFFF" />
                </g>
              );
            })}
            <circle cx="50" cy="50" r="5" fill="#FEF08A" />
          </g>
        )}
      </svg>
    </div>
  );
};

export const Flowers: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9,
        overflow: "hidden",
      }}
    >
      {/* Corner Marigold clusters */}
      <SwayingFlower
        isYellow
        color="#F4B41A"
        size={85}
        style={{ position: "absolute", top: "-10px", left: "-10px" }}
      />
      <SwayingFlower
        isYellow
        color="#F4B41A"
        size={70}
        style={{ position: "absolute", top: "30px", left: "-20px" }}
      />
      <SwayingFlower
        isYellow
        color="#E07A5F"
        size={60}
        style={{ position: "absolute", top: "-15px", left: "55px" }}
      />

      {/* White Jasmine Corner Decor */}
      <SwayingFlower
        isYellow={false}
        size={95}
        style={{ position: "absolute", top: "-15px", right: "-15px" }}
      />
      <SwayingFlower
        isYellow={false}
        size={70}
        style={{ position: "absolute", top: "45px", right: "-20px" }}
      />

      {/* Bottom flower bunches */}
      <SwayingFlower
        isYellow
        color="#F4B41A"
        size={90}
        style={{ position: "absolute", bottom: "-10px", right: "-10px" }}
      />
      <SwayingFlower
        isYellow={false}
        size={80}
        style={{ position: "absolute", bottom: "-15px", left: "-10px" }}
      />
    </div>
  );
};
export default Flowers;
