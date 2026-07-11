import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { Mandala } from "../components/Mandala";
import { WeddingData } from "./WeddingInvite";

export const Scene2Wedding: React.FC<WeddingData> = ({ couple, parents, events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgImage = staticFile("/assets/themes/rajputana/wedding-invite.png");

  // Continuous Ken Burns Zoom (Very slow push in)
  // Scale from 1.0 to 1.15 over the entire duration (330 frames)
  const bgScale = interpolate(frame, [0, 330], [1.0, 1.15], {
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

  // Spring for typography (highly damped)
  const textEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const textTranslateY = interpolate(textEntrance, [0, 1], [30, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  // Rack Focus Outward transition animation starting at frame 300 (out of 330)
  const transitionProgress = interpolate(frame, [300, 330], [0, 1], {
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
          alt="Wedding Background"
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

      {/* Center Mandala Focus */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
         <Mandala size={800} color="#D4AF37" opacity={0.15} rotationSpeed={0.03} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4rem 2rem",
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <div style={{ color: "#D4AF37", fontSize: "42px", marginBottom: "1rem" }}>
          ॐ
        </div>

        <h2
          style={{
            color: "#f3f4f6",
            fontFamily: "'Playfair Display', serif",
            fontSize: "42px",
            fontWeight: 400,
            letterSpacing: "3px",
            margin: "0 0 0.5rem 0",
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Wedding Ceremony
        </h2>
        <p
          style={{
            color: "#D4AF37",
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            letterSpacing: "1px",
            margin: "0 0 3rem 0",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          We are pleased to invite you<br />
          to the wedding of
        </p>

        <h1
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "110px",
            color: "#FFFDF0",
            margin: "0 0 0.5rem 0",
            textShadow: "0 4px 15px rgba(212, 175, 55, 0.4)",
          }}
        >
          {couple.brideName} <span style={{ fontSize: "60px", color: "#D4AF37" }}>&</span> {couple.groomName}
        </h1>

        <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
          <p style={{ color: "#f3f4f6", fontFamily: "serif", fontSize: "18px", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{parents.brideParents}</p>
          <p style={{ color: "#f3f4f6", fontFamily: "serif", fontSize: "18px", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{parents.groomParents}</p>
        </div>

        <div
          style={{
            width: "120px",
            height: "2px",
            backgroundColor: "#D4AF37",
            margin: "0 auto 2rem auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        />

        <p style={{ color: "#FFFDF0", fontFamily: "serif", fontSize: "28px", fontWeight: 600, margin: "0 0 0.5rem 0", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {events.wedding.date}
        </p>
        <p style={{ color: "#D4AF37", fontFamily: "serif", fontSize: "24px", margin: "0 0 1.5rem 0", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          At {events.wedding.time}
        </p>
        
        <p style={{ color: "#f3f4f6", fontFamily: "serif", fontSize: "22px", margin: "0", maxWidth: "60%", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {events.wedding.venue}
        </p>
      </div>
    </AbsoluteFill>
  );
};
