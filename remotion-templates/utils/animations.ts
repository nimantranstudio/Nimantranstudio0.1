import { Easing } from "remotion";

export const easings = {
  luxuryInOut: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeOutQuart: Easing.bezier(0.16, 1, 0.3, 1),
  easeOutExpo: Easing.bezier(0.16, 1, 0.3, 1),
  softSpring: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const timingPresets = {
  revealDuration: 30, // frames
};
