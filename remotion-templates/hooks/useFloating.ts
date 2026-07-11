import { useCurrentFrame } from "remotion";

export const useFloating = (speed = 0.05, amplitude = 5) => {
  const frame = useCurrentFrame();
  const y = Math.sin(frame * speed) * amplitude;
  const x = Math.cos(frame * (speed * 0.7)) * (amplitude * 0.5);
  const rot = Math.sin(frame * (speed * 0.4)) * 0.8; // subtle rotation swing in degrees

  return { x, y, rot };
};
