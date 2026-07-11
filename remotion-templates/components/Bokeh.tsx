import React from "react";
import { useCurrentFrame } from "remotion";
import { seedRandom } from "../hooks/useParticles";

interface BokehProps {
  count?: number;
  color?: string;
  seed?: number;
}

export const Bokeh: React.FC<BokehProps> = ({
  count = 20,
  color = "rgba(253, 186, 116, 0.25)", // Warm peach/gold
  seed = 88,
}) => {
  const frame = useCurrentFrame();

  // Pre-generate stable random parameters for each bokeh bubble
  const bubbles = React.useMemo(() => {
    const list = [];
    let s = seed;
    for (let i = 0; i < count; i++) {
      s += 1.33;
      const x = seedRandom(s) * 100;
      s += 2.11;
      const y = seedRandom(s) * 100;
      s += 0.88;
      const size = seedRandom(s) * 80 + 30; // 30px to 110px
      s += 3.44;
      const speedY = seedRandom(s) * 0.15 + 0.05; // very slow drift
      s += 1.25;
      const opacity = seedRandom(s) * 0.2 + 0.05; // subtle translucency
      s += 0.55;
      const blur = seedRandom(s) * 4 + 2; // blur radius

      list.push({ id: i, x, y, size, speedY, opacity, blur });
    }
    return list;
  }, [count, seed]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
        overflow: "hidden",
      }}
    >
      {bubbles.map((b) => {
        // Slow vertical float loop
        const currentY = ((b.y - frame * b.speedY) % 100 + 100) % 100;
        
        // Sway sideways gently
        const currentX = b.x + Math.sin(frame * 0.01 + b.id) * 3;

        return (
          <div
            key={`bokeh-${b.id}`}
            style={{
              position: "absolute",
              left: `${currentX}%`,
              top: `${currentY}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: b.opacity,
              filter: `blur(${b.blur}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
};
export default Bokeh;
