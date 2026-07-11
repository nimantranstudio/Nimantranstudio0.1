import { registerRoot, Composition } from "remotion";
import { WeddingInvite } from "./compositions/WeddingInvite";
import { DynamicVideo } from "./compositions/DynamicVideo";
import React from "react";

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WeddingInvite"
        component={WeddingInvite}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={30 * 45}
        defaultProps={{
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
        }}
      />
      <Composition
        id="DynamicVideo"
        component={DynamicVideo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={30 * 30}
        defaultProps={{
          templateConfig: {
            width: 1080,
            height: 1920,
            fps: 30,
            durationInFrames: 30 * 10,
            musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            scenes: [
              {
                durationInFrames: 30 * 10,
                layers: [
                  {
                    type: "background" as const,
                    value: "/assets/themes/rajputana/save-the-date.png",
                  },
                  {
                    type: "text" as const,
                    value: "Welcome to {{brideName}} & {{groomName}}'s Wedding",
                    style: {
                      fontSize: "64px",
                      color: "#ffffff",
                      fontFamily: "Playfair Display",
                      top: "40%",
                      left: "5%",
                      right: "5%",
                    },
                    animation: {
                      type: "fade" as const,
                      durationInFrames: 30,
                      delayInFrames: 10,
                    }
                  }
                ]
              }
            ]
          },
          userData: {
            brideName: "Anjali",
            groomName: "Rahul",
          }
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
