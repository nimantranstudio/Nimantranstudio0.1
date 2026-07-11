import { useCurrentFrame } from "remotion";

export const useGlow = (speed = 0.08, minGlow = 0.7, maxGlow = 1.3) => {
  const frame = useCurrentFrame();
  
  // Sine-wave breathing
  const base = Math.sin(frame * speed);
  
  // Occasional micro-flicker using random noise
  const flicker = Math.sin(frame * 2.3) * 0.05 * (Math.sin(frame * 0.1) > 0.8 ? 1 : 0);
  
  // Map base from [-1, 1] to [minGlow, maxGlow]
  const glow = minGlow + ((base + 1) / 2) * (maxGlow - minGlow) + flicker;

  return glow;
};
