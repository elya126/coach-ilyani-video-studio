/**
 * TEMPLATE 2 — TALKING HEAD REEL
 * Your filmed video full-screen + animated captions + hook title +
 * name tag + call-to-action at the end.
 * Edit in: src/content/talkingHead.ts
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import {
  AnimatedCaptions,
  AnimatedTitle,
  BrandBackground,
  CallToAction,
  Disclaimer,
  MediaFrame,
  ThemeProvider,
  VideoShell,
} from "../components";
import { studioConfig } from "../../studio.config";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import { audioSchema, captionSchema, ctaSchema, mediaSrc, themeSchema } from "../lib/schemas";
import { sec } from "../lib/timing";

export const talkingHeadSchema = z.object({
  theme: themeSchema,
  videoSrc: mediaSrc.describe('Your filmed clip, e.g. "videos/talking-head.mp4"'),
  durationInSeconds: z.number().min(5).max(90).describe("Match the length of your clip"),
  hook: z.object({ text: z.string(), durationInSeconds: z.number().min(1).max(10) }),
  speaker: z.object({ name: z.string(), title: z.string() }),
  captionStyle: z.enum(["pop", "karaoke", "fade"]),
  captions: z.array(captionSchema),
  cta: ctaSchema,
  disclaimer: z.string(),
  audio: audioSchema,
});
export type TalkingHeadProps = z.infer<typeof talkingHeadSchema>;

export const calculateTalkingHeadMetadata: CalculateMetadataFunction<TalkingHeadProps> = ({ props }) => ({
  durationInFrames: sec(props.durationInSeconds),
});

const HookOverlay: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 230, left: 84, right: 130 }}>
        <ThemeProvider theme="dark">
          <div style={{ textShadow: "0 4px 30px rgba(0,0,0,0.55)" }}>
            <AnimatedTitle text={text} size={type.heading + 8} />
          </div>
        </ThemeProvider>
      </div>
    </AbsoluteFill>
  );
};

const NameTag: React.FC<{ name: string; title: string }> = ({ name, title }) => {
  const p = useEnter(0);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const { gold, white } = studioConfig.colors;
  return (
    <div
      style={{
        position: "absolute",
        left: 84,
        bottom: 760,
        display: "flex",
        alignItems: "stretch",
        gap: 20,
        opacity: out,
        ...riseStyle(p, 20),
      }}
    >
      <div style={{ width: 4, backgroundColor: gold, borderRadius: 2 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}>
        <span style={{ fontFamily: fonts.heading, fontSize: 46, fontWeight: 600, color: white }}>{name}</span>
        <span style={{ fontFamily: fonts.body, fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: gold }}>
          {title}
        </span>
      </div>
    </div>
  );
};

export const TalkingHeadReel: React.FC<TalkingHeadProps> = (props) => {
  const total = sec(props.durationInSeconds);
  const ctaFrames = Math.min(sec(props.cta.durationInSeconds), total);
  const ctaFrom = total - ctaFrames;

  return (
    <VideoShell theme="dark" audio={props.audio} overFootage showBackground={false} duckMusic>
      <MediaFrame src={props.videoSrc} label="Talking-head video: set videoSrc (e.g. videos/talking-head.mp4)" withSound />
      {/* Soft gradient so captions/titles stay readable on any footage */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Sequence durationInFrames={sec(props.hook.durationInSeconds)}>
        <HookOverlay text={props.hook.text} />
      </Sequence>
      <Sequence from={sec(0.6)} durationInFrames={sec(4)}>
        <NameTag name={props.speaker.name} title={props.speaker.title} />
      </Sequence>
      <Sequence durationInFrames={ctaFrom} layout="none">
        <AnimatedCaptions captions={props.captions} style={props.captionStyle} />
      </Sequence>
      <Sequence from={ctaFrom} durationInFrames={ctaFrames}>
        <EndCard props={props} />
      </Sequence>
      <Disclaimer text={props.disclaimer} forceLight />
    </VideoShell>
  );
};

const EndCard: React.FC<{ props: TalkingHeadProps }> = ({ props }) => {
  const p = useEnter(0, 15);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <ThemeProvider theme={props.theme}>
        <BrandBackground />
        <CallToAction cta={props.cta} />
      </ThemeProvider>
    </AbsoluteFill>
  );
};
