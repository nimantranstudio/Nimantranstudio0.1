import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface LightSweepProps {
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  color?: string;
}

export const LightSweep: React.FC<LightSweepProps> = ({
  children,
  startFrame = 15,
  duration = 45,
  color = "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(253,224,71,0.65) 50%, rgba(255,255,255,0) 100%)",
}) => {
  const frame = useCurrentFrame();

  // Linear sweep mapping from -120% to 120%
  const translateX = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [-120, 120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
      {/* Target Content */}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>

      {/* Sweeping Shimmer Glow Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          transform: `translateX(${translateX}%) skewX(-25deg)`,
          mixBlendMode: "color-dodge",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
export default LightSweep;
