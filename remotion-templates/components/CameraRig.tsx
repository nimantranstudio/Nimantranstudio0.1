import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface CameraRigProps {
  children: React.ReactNode;
  active?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({ children, active = true }) => {
  const frame = useCurrentFrame();

  if (!active) {
    return <>{children}</>;
  }

  // Camera breathing period: ~6 seconds (180 frames)
  const breatheX = Math.sin((frame * Math.PI) / 90) * 6;
  const breatheY = Math.cos((frame * Math.PI) / 130) * 4;

  // Camera rotation swing
  const rotateZ = Math.sin((frame * Math.PI) / 180) * 0.25; // max 0.25 degree roll

  // Soft push-in zoom over time
  const scale = 1.0 + Math.sin((frame * Math.PI) / 360) * 0.02;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transformPerspective: 1000,
        transform: `scale(${scale}) translate3d(${breatheX}px, ${breatheY}px, 0px) rotate(${rotateZ}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
export default CameraRig;
