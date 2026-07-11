import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { useGlow } from "../hooks/useGlow";
import { Lantern } from "../components/Lantern";
import { WeddingData } from "./WeddingInvite";

export const Scene1SaveDate: React.FC<WeddingData> = ({ couple, events }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The base background image
  const bgImage = staticFile("/assets/themes/rajputana/save-the-date.png");

  // Continuous Ken Burns Zoom (Very slow push in)
  // Scale from 1.0 to 1.15 over the entire duration (180 frames)
  const bgScale = interpolate(frame, [0, 180], [1.0, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Reveals: Starts black, fades in slowly over 2 seconds (60 frames)
  const sceneReveal = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrance spring for typography (Highly damped for elegance)
  const textEntrance = spring({
    frame: frame - 40,
    fps,
    config: { damping: 20, stiffness: 60 }, 
  });

  const textTranslateY = interpolate(textEntrance, [0, 1], [40, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  // Handwriting stroke reveal for names
  const dashOffset = interpolate(frame, [70, 120], [1000, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const omGlow = useGlow(0.09, 0.4, 1.25);

  // Rack Focus Outward transition animation starting at frame 150 (out of 180)
  const transitionProgress = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The scene blurs out and fades out while scaling up faster
  const outBlur = interpolate(transitionProgress, [0, 1], [0, 20]);
  const outOpacity = interpolate(transitionProgress, [0, 1], [1, 0]);
  const extraOutScale = interpolate(transitionProgress, [0, 1], [1, 1.1]);

  return (
    <AbsoluteFill
      style={{
        opacity: sceneReveal * outOpacity,
        filter: `blur(${outBlur}px)`,
        transform: `scale(${extraOutScale})`,
      }}
    >
      {/* Background Image with Ken Burns */}
      <AbsoluteFill>
        <img
          src={bgImage}
          alt="Save the Date Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* Atmospheric Darkening Gradient so text is legible */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <Lantern x="15%" y="-5%" height={300} scale={0.8} phaseOffset={0} />
      <Lantern x="85%" y="-10%" height={380} scale={0.9} phaseOffset={Math.PI / 3} />

      {/* Content Container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          textAlign: "center",
        }}
      >
        <div style={{ opacity: omGlow, color: "#D4AF37", fontSize: "48px", marginBottom: "3rem" }}>
          ॐ
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${textTranslateY}px)` }}>
          <h2
            style={{
              color: "#f3f4f6",
              fontFamily: "'Playfair Display', serif",
              fontSize: "48px",
              fontWeight: 400,
              letterSpacing: "4px",
              margin: "0 0 1rem 0",
              textTransform: "uppercase",
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            Save the Date
          </h2>
          <p
            style={{
              color: "#D4AF37",
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              letterSpacing: "2px",
              margin: "0 0 4rem 0",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            to celebrate the wedding of
          </p>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: nameOpacity,
          }}
        >
          <h1
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "120px",
              color: "#FFFDF0",
              margin: 0,
              textShadow: "0 4px 15px rgba(212, 175, 55, 0.4)",
              background: `linear-gradient(to right, #FFFDF0 ${100 - (dashOffset / 10)}%, transparent 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {couple.brideName} & {couple.groomName}
          </h1>
        </div>

        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            marginTop: "4rem",
          }}
        >
          <p
            style={{
              color: "#f3f4f6",
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              fontWeight: 600,
              letterSpacing: "2px",
              margin: "0 0 1rem 0",
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            {events.saveTheDate.date}
          </p>
          <p
            style={{
              color: "#a3a3a3",
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              letterSpacing: "4px",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            formal invite to follow
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
