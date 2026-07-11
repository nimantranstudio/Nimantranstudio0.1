import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { Mandala } from "../components/Mandala";
import { WeddingData } from "./WeddingInvite";

export const Scene3Mehendi: React.FC<WeddingData> = ({ couple, events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgImage = staticFile("/assets/themes/rajputana/mehendi-invite.png");

  // Continuous Ken Burns Zoom (Very slow push in)
  // Scale from 1.0 to 1.15 over the entire duration (210 frames)
  const bgScale = interpolate(frame, [0, 210], [1.0, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rack focus reveal: Starts blurred and scales down to sharp
  const sceneRevealProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const revealBlur = interpolate(sceneRevealProgress, [0, 1], [20, 0]);
  const revealOpacity = interpolate(sceneRevealProgress, [0, 1], [0, 1]);
  const revealScale = interpolate(sceneRevealProgress, [0, 1], [1.1, 1]);

  // Spring for typography
  const textEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const textTranslateY = interpolate(textEntrance, [0, 1], [30, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  // Rack Focus Outward transition animation starting at frame 180 (out of 210)
  const transitionProgress = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outBlur = interpolate(transitionProgress, [0, 1], [0, 20]);
  const outOpacity = interpolate(transitionProgress, [0, 1], [1, 0]);
  const extraOutScale = interpolate(transitionProgress, [0, 1], [1, 1.1]);

  return (
    <AbsoluteFill
      style={{
        opacity: revealOpacity * outOpacity,
        filter: `blur(${revealBlur + outBlur}px)`,
        transform: `scale(${revealScale * extraOutScale})`,
      }}
    >
      <AbsoluteFill>
        <img
          src={bgImage}
          alt="Mehendi Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* Atmospheric Darkening Gradient */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
         <Mandala size={900} color="#86EFAC" opacity={0.15} rotationSpeed={0.05} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "5rem 2rem",
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <div style={{ color: "#4ADE80", fontSize: "42px", marginBottom: "1rem" }}>
          ॐ
        </div>

        <h2
          style={{
            color: "#f3f4f6",
            fontFamily: "'Playfair Display', serif",
            fontSize: "48px",
            fontWeight: 400,
            letterSpacing: "4px",
            margin: "0 0 1rem 0",
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Mehendi
        </h2>

        <h1
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "120px",
            color: "#4ADE80",
            margin: "0 0 2rem 0",
            textShadow: "0 4px 15px rgba(0,0,0,0.6)",
          }}
        >
          {couple.brideName}'s Mehendi
        </h1>

        <p
          style={{
            color: "#f3f4f6",
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            letterSpacing: "1px",
            margin: "0 0 4rem 0",
            maxWidth: "80%",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Join at the Mehendi event,<br />
          with the "Hands full of mehndi, hearts full of love."
        </p>

        <div
          style={{
            width: "80px",
            height: "2px",
            backgroundColor: "#4ADE80",
            margin: "0 auto 2rem auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        />

        <p style={{ color: "#BBF7D0", fontFamily: "serif", fontSize: "28px", fontWeight: 600, margin: "0 0 0.5rem 0", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {events.mehendi.date}
        </p>
        <p style={{ color: "#4ADE80", fontFamily: "serif", fontSize: "24px", margin: "0 0 1.5rem 0", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          At {events.mehendi.time}
        </p>
        
        <p style={{ color: "#f3f4f6", fontFamily: "serif", fontSize: "20px", margin: "0", maxWidth: "60%", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {events.mehendi.venue}
        </p>
      </div>
    </AbsoluteFill>
  );
};
