import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { Scene1SaveDate } from "./Scene1SaveDate";
import { Scene2Wedding } from "./Scene2Wedding";
import { Scene3Mehendi } from "./Scene3Mehendi";
import { Scene4Haldi } from "./Scene4Haldi";
import { Scene5Sangeet } from "./Scene5Sangeet";
import { ParticleSystem } from "../components/ParticleSystem";
import { Dust } from "../components/Dust";
import { Bokeh } from "../components/Bokeh";
import { GoldenWipeTransition, BloomTransition } from "../components/Transitions";
import {
  SCENE_1_FRAMES,
  SCENE_2_FRAMES,
  SCENE_3_FRAMES,
  SCENE_4_FRAMES,
  SCENE_5_FRAMES,
} from "../utils/constants";

export interface MainCompositionProps {
  groomName?: string;
  brideName?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  themeColor?: string;
  musicUrl?: string;
  slide1Bg?: string; // Save the Date
  slide2Bg?: string; // Haldi
  slide3Bg?: string; // Mehendi
  slide4Bg?: string; // Sangeet
  slide5Bg?: string; // Wedding Invitation
}

const getAssetUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("/") ? staticFile(url) : url;
};

export const MainComposition: React.FC<MainCompositionProps> = ({
  groomName = "Rahul",
  brideName = "Anjali",
  eventDate = "16th February 2026",
  eventTime = "6:30 PM",
  venue = "The Rajputana palace, Adarsh Nagar, Rajasthan",
  themeColor = "#b38b40",
  musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  slide1Bg = "/assets/themes/rajputana/save-the-date.png",
  slide2Bg = "/assets/themes/rajputana/haldi-invite.png",
  slide3Bg = "/assets/themes/rajputana/mehendi-invite.png",
  slide4Bg = "/assets/themes/rajputana/sangeet-invite.png",
  slide5Bg = "/assets/themes/rajputana/wedding-invite.png",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Boundary offsets
  const scene1Start = 0;
  const scene2Start = SCENE_1_FRAMES;
  const scene3Start = scene2Start + SCENE_2_FRAMES;
  const scene4Start = scene3Start + SCENE_3_FRAMES;
  const scene5Start = scene4Start + SCENE_4_FRAMES;

  // Transition Helper: Returns progress (0 to 1) for a specific frame window
  const getTransitionProgress = (centerFrame: number, width = 14) => {
    const start = centerFrame - width / 2;
    const end = centerFrame + width / 2;
    if (frame < start) return 0;
    if (frame > end) return 1;
    return (frame - start) / width;
  };

  // Transition overlays trigger progress
  const t1Progress = getTransitionProgress(scene2Start);
  const t2Progress = getTransitionProgress(scene3Start);
  const t3Progress = getTransitionProgress(scene4Start);
  const t4Progress = getTransitionProgress(scene5Start);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Global Background Audio */}
      {musicUrl && <Audio src={getAssetUrl(musicUrl)} volume={0.8} />}

      {/* Global Particle Overlay System */}
      <ParticleSystem count={160} color="rgba(253, 224, 71, 0.4)" seed={42} />

      {/* Global Bokeh Overlay System */}
      <Bokeh count={15} color="rgba(253, 186, 116, 0.16)" seed={55} />

      {/* Global Volumetric Haze & Light Leaks */}
      <Dust />

      {/* Orchestrated Scene Sequences */}
      
      {/* Scene 1: Save the Date (5 seconds) */}
      <Sequence from={scene1Start} durationInFrames={SCENE_1_FRAMES}>
        <Scene1SaveDate imageSrc={slide1Bg} />
      </Sequence>

      {/* Scene 2: Wedding Invitation (8 seconds) */}
      <Sequence from={scene2Start} durationInFrames={SCENE_2_FRAMES}>
        <Scene2Wedding imageSrc={slide5Bg} />
      </Sequence>

      {/* Scene 3: Mehendi (5 seconds) */}
      <Sequence from={scene3Start} durationInFrames={SCENE_3_FRAMES}>
        <Scene3Mehendi imageSrc={slide3Bg} />
      </Sequence>

      {/* Scene 4: Haldi (5 seconds) */}
      <Sequence from={scene4Start} durationInFrames={SCENE_4_FRAMES}>
        <Scene4Haldi imageSrc={slide2Bg} />
      </Sequence>

      {/* Scene 5: Sangeet + Ending Stack (7 seconds) */}
      <Sequence from={scene5Start} durationInFrames={SCENE_5_FRAMES}>
        <Scene5Sangeet
          sangeetImg={slide4Bg}
          saveDateImg={slide1Bg}
          weddingImg={slide5Bg}
          mehendiImg={slide3Bg}
          haldiImg={slide2Bg}
          brideName={brideName}
          groomName={groomName}
        />
      </Sequence>

      {/* Dynamic Seamless Scene Transitions */}
      {t1Progress > 0 && t1Progress < 1 && <GoldenWipeTransition progress={t1Progress} />}
      {t2Progress > 0 && t2Progress < 1 && <BloomTransition progress={t2Progress} />}
      {t3Progress > 0 && t3Progress < 1 && <GoldenWipeTransition progress={t3Progress} />}
      {t4Progress > 0 && t4Progress < 1 && <BloomTransition progress={t4Progress} />}
    </AbsoluteFill>
  );
};
export default MainComposition;
