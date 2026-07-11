import React from "react";
import { interpolate } from "remotion";

interface TransitionProps {
  progress: number; // 0 to 1 transition progress
}

export const GoldenWipeTransition: React.FC<TransitionProps> = ({ progress }) => {
  // Peak at 0.5 progress (full solid cover)
  const opacity = interpolate(
    progress,
    [0, 0.45, 0.55, 1],
    [0, 1, 1, 0]
  );

  // Diagonal slide coordinate from right to left
  const slideX = interpolate(
    progress,
    [0, 1],
    [100, -100]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 99,
        pointerEvents: "none",
        opacity: opacity,
        background: `linear-gradient(135deg, 
          #581845 0%, 
          #D4AF37 35%, 
          #FFFFF0 50%, 
          #D4AF37 65%, 
          #581845 100%
        )`,
        transform: `translateX(${slideX}%) skewX(-15deg)`,
        filter: "blur(1px)",
        boxShadow: "0 0 100px rgba(212, 175, 55, 0.8)",
      }}
    />
  );
};

export const BloomTransition: React.FC<TransitionProps> = ({ progress }) => {
  // Peak brightness flash at 0.5 progress
  const flashOpacity = interpolate(
    progress,
    [0, 0.4, 0.5, 0.6, 1],
    [0, 0, 1, 0, 0]
  );

  const blurAmount = interpolate(
    progress,
    [0, 0.5, 1],
    [0, 15, 0]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 98,
        pointerEvents: "none",
        backgroundColor: "rgba(255, 253, 240, 1)",
        opacity: flashOpacity,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        mixBlendMode: "screen",
      }}
    />
  );
};
export default GoldenWipeTransition;
