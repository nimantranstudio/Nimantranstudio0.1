import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import React from "react";
import { CameraRig } from "../components/CameraRig";
import { ParticleSystem } from "../components/ParticleSystem";
import { Scene1SaveDate } from "./Scene1SaveDate";
import { Scene2Wedding } from "./Scene2Wedding";
import { Scene3Mehendi } from "./Scene3Mehendi";
import { Scene4Haldi } from "./Scene4Haldi";
import { Scene5Sangeet } from "./Scene5Sangeet";

const getAssetUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("/") ? staticFile(url) : url;
};

export interface WeddingData {
  couple: {
    brideName: string;
    groomName: string;
  };
  parents: {
    brideParents: string;
    groomParents: string;
  };
  events: {
    saveTheDate: { date: string };
    wedding: { date: string; time: string; venue: string };
    haldi: { date: string; time: string; venue: string };
    mehendi: { date: string; time: string; venue: string };
    sangeet: { date: string; time: string; venue: string };
  };
  closingMessage: string;
  musicUrl?: string;
}

export const WeddingInvite: React.FC<WeddingData> = (props) => {
  const { fps } = useVideoConfig();

  // Safely fallback in case Remotion Studio has old props cached in localStorage
  const safeProps: WeddingData = {
    couple: props.couple || { brideName: "Anjali", groomName: "Rahul" },
    parents: props.parents || { brideParents: "Daughter of Mr & Mrs Patel", groomParents: "Son of Mr & Mrs Bajaj" },
    events: props.events || {
      saveTheDate: { date: "16th February 2026" },
      wedding: { date: "16th February 2026", time: "6:30 PM", venue: "The Rajputana Palace, Rajasthan" },
      haldi: { date: "14th February 2026", time: "11:30 AM", venue: "The Rajputana Palace, Rajasthan" },
      mehendi: { date: "15th February 2026", time: "3:00 PM", venue: "The Rajputana Palace, Rajasthan" },
      sangeet: { date: "15th February 2026", time: "7:30 PM", venue: "The Rajputana Palace, Rajasthan" },
    },
    closingMessage: props.closingMessage || "We look forward to celebrating with you",
    musicUrl: props.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  const s1Start = 0;
  const s1Duration = fps * 6; // 6 seconds

  const s2Start = s1Start + fps * 5; // overlaps by 1 sec
  const s2Duration = fps * 11; // 10 seconds active + 1 sec transition

  const s3Start = s2Start + fps * 10;
  const s3Duration = fps * 8; // Haldi (7s)

  const s4Start = s3Start + fps * 7;
  const s4Duration = fps * 8; // Mehendi (7s)

  const s5Start = s4Start + fps * 7;
  const s5Duration = fps * 9; // Sangeet (8s)

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {safeProps.musicUrl && <Audio src={getAssetUrl(safeProps.musicUrl)} volume={0.8} />}

      <CameraRig>
        {/* Global Particles that float across the whole video */}
        <ParticleSystem density={40} />

        <Sequence from={s1Start} durationInFrames={s1Duration}>
          <Scene1SaveDate {...safeProps} />
        </Sequence>

        <Sequence from={s2Start} durationInFrames={s2Duration}>
          <Scene2Wedding {...safeProps} />
        </Sequence>

        <Sequence from={s3Start} durationInFrames={s3Duration}>
          <Scene4Haldi {...safeProps} />
        </Sequence>

        <Sequence from={s4Start} durationInFrames={s4Duration}>
          <Scene3Mehendi {...safeProps} />
        </Sequence>

        <Sequence from={s5Start} durationInFrames={s5Duration}>
          <Scene5Sangeet {...safeProps} />
        </Sequence>
      </CameraRig>
    </AbsoluteFill>
  );
};

export const WeddingInviteRoot: React.FC = () => {
  const defaultData: WeddingData = {
    couple: { brideName: "Anjali", groomName: "Rahul" },
    parents: {
      brideParents: "Daughter of Mr & Mrs Patel",
      groomParents: "Son of Mr & Mrs Bajaj",
    },
    events: {
      saveTheDate: { date: "16th February 2026" },
      wedding: { date: "16th February 2026", time: "6:30 PM", venue: "The Rajputana Palace, Rajasthan" },
      haldi: { date: "14th February 2026", time: "11:30 AM", venue: "The Rajputana Palace, Rajasthan" },
      mehendi: { date: "15th February 2026", time: "3:00 PM", venue: "The Rajputana Palace, Rajasthan" },
      sangeet: { date: "15th February 2026", time: "7:30 PM", venue: "The Rajputana Palace, Rajasthan" },
    },
    closingMessage: "We look forward to celebrating with you",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  return (
    <>
      <Composition
        id="WeddingInvite"
        component={WeddingInvite}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={30 * 45} // 45 seconds total
        defaultProps={defaultData}
      />
    </>
  );
};
