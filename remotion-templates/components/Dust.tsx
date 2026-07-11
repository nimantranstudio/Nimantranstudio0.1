import React from "react";
import { useCurrentFrame } from "remotion";
import { useGlow } from "../hooks/useGlow";

export const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  const glow1 = useGlow(0.02, 0.4, 0.7); // slow pulse
  const glow2 = useGlow(0.035, 0.3, 0.6); // off-beat pulse

  // Volumetric beam sway rotation angle
  const beamAngle = Math.sin(frame * 0.01) * 3;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 6,
        overflow: "hidden",
      }}
    >
      {/* Volumetric Warm Golden Light Leak - Top Right */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-20%",
          width: "80%",
          height: "60%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(254, 240, 138, 0.25) 0%, rgba(251, 191, 36, 0.05) 50%, rgba(0,0,0,0) 80%)",
          opacity: glow1,
          filter: "blur(40px)",
        }}
      />

      {/* Volumetric Warm Orange Light Leak - Bottom Left */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-15%",
          width: "70%",
          height: "50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253, 186, 116, 0.2) 0%, rgba(224, 122, 95, 0.04) 60%, rgba(0,0,0,0) 80%)",
          opacity: glow2,
          filter: "blur(50px)",
        }}
      />

      {/* Volumetric Light Rays filtration overlay */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-20%",
          width: "140%",
          height: "200%",
          transform: `rotate(${beamAngle}deg)`,
          transformOrigin: "top center",
          background: `repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0.03) 40px,
            rgba(255, 255, 255, 0) 80px,
            rgba(255, 255, 255, 0) 160px
          )`,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Cinematic Film Grain Overlay (2% opacity) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Premium Vignette Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
};
export default Dust;
