import React from "react";
import { useCurrentFrame } from "remotion";
import { seedRandom } from "../hooks/useParticles";

interface LeafProps {
  size?: number;
  rotation?: number;
  isFloating?: boolean;
  seed?: number;
}

export const SwayingLeaf: React.FC<LeafProps> = ({
  size = 40,
  rotation = 0,
  isFloating = false,
  seed = 99,
}) => {
  const frame = useCurrentFrame();
  
  // Custom swing frequency
  const sway = Math.sin(frame * 0.045 + seed) * 3;
  const scale = 1.0 + Math.sin(frame * 0.02 + seed) * 0.02;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale}) rotate(${rotation + sway}deg)`,
        transformOrigin: "bottom center",
        display: "inline-block",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mango/Asopalav leaf vector shape */}
        <path
          d="M50 90 C25 60, 20 30, 50 5 C80 30, 75 60, 50 90 Z"
          fill="#3B7A57" // Deep leaf green
          stroke="#2E4A3E"
          strokeWidth="1.5"
        />
        {/* Leaf center line */}
        <path
          d="M50 90 L50 10"
          stroke="#559675"
          strokeWidth="1"
        />
        {/* Veins */}
        <path d="M50 70 L38 60" stroke="#559675" strokeWidth="0.8" />
        <path d="M50 70 L62 60" stroke="#559675" strokeWidth="0.8" />
        <path d="M50 50 L35 38" stroke="#559675" strokeWidth="0.8" />
        <path d="M50 50 L65 38" stroke="#559675" strokeWidth="0.8" />
        <path d="M50 30 L38 20" stroke="#559675" strokeWidth="0.8" />
        <path d="M50 30 L62 20" stroke="#559675" strokeWidth="0.8" />
      </svg>
    </div>
  );
};

export const Leaves: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const frame = useCurrentFrame();

  // Floating leaf positions (for Mehendi scene)
  const leavesCount = 8;
  const floatingLeaves = React.useMemo(() => {
    const list = [];
    let s = 15;
    for (let i = 0; i < leavesCount; i++) {
      s += 2.22;
      const startX = seedRandom(s) * 90 + 5;
      s += 0.89;
      const speedY = seedRandom(s) * 1.5 + 0.8;
      s += 3.14;
      const size = seedRandom(s) * 20 + 20; // 20px to 40px
      s += 1.45;
      const baseRotation = seedRandom(s) * 360;

      list.push({ id: i, startX, speedY, size, baseRotation });
    }
    return list;
  }, []);

  if (!active) return null;

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
      {/* Swaying hanging leaf border at the top of the scene */}
      <div
        style={{
          position: "absolute",
          top: "-5px",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <SwayingLeaf
            key={`hanging-leaf-${i}`}
            size={45}
            rotation={180 + (i % 2 === 0 ? 5 : -5)}
            seed={i}
          />
        ))}
      </div>

      {/* Floating leaves falling slowly (wind blown) */}
      {floatingLeaves.map((l) => {
        // Fall loop calculation
        const currentY = ((frame * l.speedY) % (1920 + 100)) - 50;
        const currentX = l.startX + Math.sin(frame * 0.02 + l.id) * 35;
        const currentRot = l.baseRotation + frame * (l.speedY * 0.5);

        return (
          <div
            key={`floating-leaf-${l.id}`}
            style={{
              position: "absolute",
              left: `${currentX}%`,
              top: `${currentY}px`,
              pointerEvents: "none",
            }}
          >
            <SwayingLeaf size={l.size} rotation={currentRot} seed={l.id} />
          </div>
        );
      })}
    </div>
  );
};
export default Leaves;
