import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Composition,
  Sequence,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import React, { useEffect, useState } from "react";

const getAssetUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("/") ? staticFile(url) : url;
};

// Helper to load Google Fonts dynamically at runtime
const FontLoader: React.FC<{ fonts: string[] }> = ({ fonts }) => {
  useEffect(() => {
    if (!fonts || fonts.length === 0) return;

    const handle = delayRender(`Loading fonts: ${fonts.join(", ")}`);
    const link = document.createElement("link");
    link.rel = "stylesheet";

    const fontFamiliesParam = fonts
      .map((f) => `family=${f.replace(/\s+/g, "+")}`)
      .join("&");
    link.href = `https://fonts.googleapis.com/css2?${fontFamiliesParam}&display=swap`;

    link.onload = () => {
      continueRender(handle);
    };

    link.onerror = () => {
      console.warn("Failed to load Google Fonts:", fonts);
      continueRender(handle);
    };

    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {}
    };
  }, [fonts]);

  return null;
};

// Helper to replace template brackets {{variable}} with user data values
function replacePlaceholders(text: string, data: Record<string, string>): string {
  if (!text) return "";
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

export interface LayerConfig {
  type: "background" | "text" | "image" | "video" | "audio";
  value: string;
  style?: React.CSSProperties;
  animation?: {
    type: "fade" | "slide-up" | "zoom-in";
    durationInFrames?: number;
    delayInFrames?: number;
  };
}

export interface SceneConfig {
  durationInFrames: number;
  layers: LayerConfig[];
}

export interface VideoTemplateConfig {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  musicUrl?: string;
  scenes: SceneConfig[];
}

export interface DynamicVideoProps {
  templateConfig: VideoTemplateConfig;
  userData: Record<string, string>;
}

// Sub-component to render individual layers with transitions
const DynamicLayer: React.FC<{
  layer: LayerConfig;
  userData: Record<string, string>;
  sceneDuration: number;
}> = ({ layer, userData, sceneDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animation = layer.animation;
  const startFrame = animation?.delayInFrames ?? 0;
  const duration = animation?.durationInFrames ?? 30; // default 1 second

  // Animation values default to static if no animation configured
  let opacity = 1;
  let transform = "";

  if (animation && frame >= startFrame) {
    const elapsed = frame - startFrame;
    const progress = Math.min(elapsed / duration, 1);

    if (animation.type === "fade") {
      opacity = interpolate(progress, [0, 1], [0, 1]);
    } else if (animation.type === "slide-up") {
      opacity = interpolate(progress, [0, 1], [0, 1]);
      const translateY = interpolate(progress, [0, 1], [50, 0]);
      transform = `translateY(${translateY}px)`;
    } else if (animation.type === "zoom-in") {
      opacity = interpolate(progress, [0, 1], [0, 1]);
      const scale = interpolate(progress, [0, 1], [0.8, 1]);
      transform = `scale(${scale})`;
    }
  } else if (animation && frame < startFrame) {
    // Hide layer before it begins animating
    opacity = 0;
  }

  // Substitute variables in the value/text
  const resolvedValue = replacePlaceholders(layer.value, userData);

  if (layer.type === "background") {
    // Ken Burns effect zoom scale calculation
    const bgScale = interpolate(frame, [0, sceneDuration], [1.02, 1.1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <img
          src={getAssetUrl(resolvedValue)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            ...layer.style,
          }}
          alt="background layer"
        />
        {/* Transparent dark gradient sheet to ensure text layers pop clearly */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.6) 80%)",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    );
  }

  if (layer.type === "text") {
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity,
          transform,
          zIndex: 10,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          ...layer.style,
        }}
      >
        {resolvedValue}
      </div>
    );
  }

  if (layer.type === "image") {
    return (
      <img
        src={getAssetUrl(resolvedValue)}
        style={{
          position: "absolute",
          opacity,
          transform,
          zIndex: 5,
          ...layer.style,
        }}
        alt="overlay layer"
      />
    );
  }

  if (layer.type === "video") {
    return (
      <video
        src={getAssetUrl(resolvedValue)}
        style={{
          position: "absolute",
          opacity,
          transform,
          objectFit: "cover",
          ...layer.style,
        }}
        autoPlay
        muted
        loop
      />
    );
  }

  return null;
};

// Main wrapper for rendering dynamic scenes sequentially
export const DynamicVideo: React.FC<DynamicVideoProps> = ({
  templateConfig,
  userData,
}) => {
  // Collect all unique fonts declared across all text layer styles
  const allFonts: string[] = [];
  templateConfig.scenes.forEach((scene) => {
    scene.layers.forEach((layer) => {
      if (layer.type === "text" && layer.style?.fontFamily) {
        const fontName = layer.style.fontFamily.replace(/['"]/g, "").trim();
        if (fontName && !allFonts.includes(fontName)) {
          allFonts.push(fontName);
        }
      }
    });
  });

  let currentFrameOffset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Dynamic font stylesheet downloader */}
      <FontLoader fonts={allFonts} />

      {/* Dynamic Audio track */}
      {templateConfig.musicUrl && (
        <Audio src={getAssetUrl(templateConfig.musicUrl)} volume={0.8} />
      )}

      {/* Render each scene sequentially in timing tracks */}
      {templateConfig.scenes.map((scene, sceneIdx) => {
        const fromFrame = currentFrameOffset;
        currentFrameOffset += scene.durationInFrames;

        return (
          <Sequence
            key={`scene-${sceneIdx}`}
            from={fromFrame}
            durationInFrames={scene.durationInFrames}
          >
            {scene.layers.map((layer, layerIdx) => (
              <DynamicLayer
                key={`layer-${layerIdx}`}
                layer={layer}
                userData={userData}
                sceneDuration={scene.durationInFrames}
              />
            ))}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
