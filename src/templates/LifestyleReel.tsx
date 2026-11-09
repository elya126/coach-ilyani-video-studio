/**
 * TEMPLATE 4 — LIFESTYLE REEL
 * Title → b-roll montage with elegant overlay text → quote card → CTA.
 * Edit in: src/content/lifestyle.ts
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import {
  AnimatedTitle,
  BodyText,
  CallToAction,
  GoldDivider,
  HookScene,
  MediaFrame,
  QuoteIcon,
  SafeArea,
  SceneSeries,
  ThemeProvider,
  VideoShell,
  useTheme,
  type Scene,
} from "../components";
import { studioConfig } from "../../studio.config";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import { audioSchema, ctaSchema, hookSchema, mediaSrc, seconds, themeSchema } from "../lib/schemas";
import { totalSceneFrames } from "../lib/timing";

export const lifestyleSchema = z.object({
  theme: themeSchema,
  intro: hookSchema.extend({ backgroundSrc: mediaSrc }),
  clips: z.array(
    z.object({
      src: mediaSrc,
      time: z.string().describe('Optional small label, e.g. "5:45 AM"'),
      caption: z.string(),
      subcaption: z.string(),
      durationInSeconds: seconds(5),
    }),
  ),
  quote: z.object({ text: z.string(), author: z.string(), durationInSeconds: seconds(5) }),
  cta: ctaSchema,
  audio: audioSchema,
});
export type LifestyleProps = z.infer<typeof lifestyleSchema>;

const sceneSeconds = (p: LifestyleProps) => [
  p.intro.durationInSeconds,
  ...p.clips.map((c) => c.durationInSeconds),
  p.quote.durationInSeconds,
  p.cta.durationInSeconds,
];

export const calculateLifestyleMetadata: CalculateMetadataFunction<LifestyleProps> = ({ props }) => ({
  durationInFrames: totalSceneFrames(sceneSeconds(props)),
});

const ClipScene: React.FC<{ clip: LifestyleProps["clips"][number]; index: number }> = ({ clip, index }) => {
  const label = useEnter(6);
  const frame = useCurrentFrame();
  const line = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { gold, white } = studioConfig.colors;
  return (
    <AbsoluteFill>
      <MediaFrame src={clip.src} overlay={0.55} label={`Lifestyle clip ${index + 1}: add e.g. broll/morning-${index + 1}.mp4`} />
      <ThemeProvider theme="dark">
        <SafeArea justify="flex-end" gap={22}>
          {clip.time ? (
            <span style={{ fontFamily: fonts.body, fontSize: 28, letterSpacing: 8, color: gold, ...riseStyle(label, 16) }}>
              {clip.time}
            </span>
          ) : null}
          <div style={{ width: 120 * line, height: 2, backgroundColor: gold }} />
          <div style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
            <AnimatedTitle text={clip.caption} size={type.heading} delay={8} color={white} />
          </div>
          <BodyText text={clip.subcaption} delay={18} color="rgba(255,255,255,0.88)" />
        </SafeArea>
      </ThemeProvider>
    </AbsoluteFill>
  );
};

const QuoteScene: React.FC<{ quote: LifestyleProps["quote"] }> = ({ quote }) => {
  const theme = useTheme();
  const icon = useEnter(0);
  return (
    <SafeArea align="center" gap={40}>
      <div style={{ opacity: icon, transform: `scale(${icon})` }}>
        <QuoteIcon color={theme.accent} size={96} />
      </div>
      <AnimatedTitle text={quote.text} align="center" size={type.heading} delay={6} />
      <GoldDivider align="center" delay={20} />
      <BodyText text={quote.author} align="center" muted delay={24} />
    </SafeArea>
  );
};

export const LifestyleReel: React.FC<LifestyleProps> = (props) => {
  const scenes: Scene[] = [
    {
      id: "intro",
      durationInSeconds: props.intro.durationInSeconds,
      render: () => <HookScene hook={props.intro} backgroundSrc={props.intro.backgroundSrc || undefined} />,
    },
    ...props.clips.map((clip, i) => ({
      id: `clip-${i}`,
      durationInSeconds: clip.durationInSeconds,
      render: () => <ClipScene clip={clip} index={i} />,
    })),
    { id: "quote", durationInSeconds: props.quote.durationInSeconds, render: () => <QuoteScene quote={props.quote} /> },
    { id: "cta", durationInSeconds: props.cta.durationInSeconds, render: () => <CallToAction cta={props.cta} /> },
  ];
  return (
    <VideoShell theme={props.theme} audio={props.audio} sceneSeconds={sceneSeconds(props)}>
      <SceneSeries scenes={scenes} />
    </VideoShell>
  );
};
