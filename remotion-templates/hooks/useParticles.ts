import { useMemo } from "react";

// Deterministic random generator based on a seed value
export function seedRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  amplitude: number;
  phase: number;
}

export const useParticles = (count = 150, seed = 42) => {
  return useMemo(() => {
    const list: Particle[] = [];
    let currentSeed = seed;

    for (let i = 0; i < count; i++) {
      currentSeed = currentSeed + 1.25;
      const randX = seedRandom(currentSeed);
      currentSeed = currentSeed + 2.37;
      const randY = seedRandom(currentSeed);
      currentSeed = currentSeed + 0.44;
      const randSize = seedRandom(currentSeed);
      currentSeed = currentSeed + 3.12;
      const randSpeedY = seedRandom(currentSeed);
      currentSeed = currentSeed + 1.89;
      const randSpeedX = seedRandom(currentSeed);
      currentSeed = currentSeed + 0.99;
      const randOpacity = seedRandom(currentSeed);

      list.push({
        id: i,
        x: randX * 100, // percentage width (0-100)
        y: randY * 100, // percentage height (0-100)
        size: randSize * 6 + 2, // particle diameter
        speedY: randSpeedY * 0.4 + 0.1, // upward drift speed
        speedX: (randSpeedX - 0.5) * 0.2, // horizontal drift
        opacity: randOpacity * 0.7 + 0.3,
        amplitude: randSpeedX * 15 + 5, // sway amplitude
        phase: randOpacity * Math.PI * 2, // offset wave timing
      });
    }
    return list;
  }, [count, seed]);
};
