/**
 * TEMPLATE 1 — EDUCATIONAL REEL
 * Hook → numbered teaching points (optional b-roll) → recap → call to action.
 * Edit the words in: src/content/educational.ts
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import {
  AnimatedTitle,
  BodyText,
  CallToAction,
  CheckIcon,
  Disclaimer,
  HookScene,
  Kicker,
  MediaFrame,
  NumberBadge,
  SafeArea,
  SceneSeries,
  VideoShell,
  useTheme,
  type Scene,
} from "../components";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import { audioSchema, ctaSchema, hookSchema, mediaSrc, seconds, themeSchema } from "../lib/schemas";
import { totalSceneFrames } from "../lib/timing";

export const educationalSchema = z.object({
  theme: themeSchema,
  hook: hookSchema,
  points: z.array(
    z.object({
      heading: z.string(),
      body: z.string().describe("Use **double asterisks** to highlight"),
      brollSrc: mediaSrc,
      durationInSeconds: seconds(7),
    }),
  ),
  recap: z.object({ title: z.string(), items: z.array(z.string()), durationInSeconds: seconds(6) }),
  cta: ctaSchema,
  disclaimer: z.string(),
  audio: audioSchema,
});
export type EducationalProps = z.infer<typeof educationalSchema>;

const sceneSeconds = (p: EducationalProps) => [
  p.hook.durationInSeconds,
  ...p.points.map((pt) => pt.durationInSeconds),
  p.recap.durationInSeconds,
  p.cta.durationInSeconds,
];

export const calculateEducationalMetadata: CalculateMetadataFunction<EducationalProps> = ({ props }) => ({
  durationInFrames: totalSceneFrames(sceneSeconds(props)),
});

const PointScene: React.FC<{ point: EducationalProps["points"][number]; index: number; total: number }> = ({
  point,
  index,
  total,
}) => {
  const theme = useTheme();
  const card = useEnter(0);
  const hasMedia = Boolean(point.brollSrc);
  return (
    <AbsoluteFill>
      {hasMedia ? (
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 84,
            right: 84,
            height: 640,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: `0 30px 60px ${theme.glow}`,
            ...riseStyle(card, 60),
          }}
        >
          <MediaFrame src={point.brollSrc} label={`B-roll for point ${index + 1}`} />
        </div>
      ) : null}
      <SafeArea justify={hasMedia ? "flex-end" : "center"} gap={34}>
        <NumberBadge value={index + 1} total={total} delay={4} size={hasMedia ? 104 : 132} />
        <AnimatedTitle text={point.heading} delay={8} size={type.heading} />
        <BodyText text={point.body} delay={18} />
      </SafeArea>
    </AbsoluteFill>
  );
};

const RecapScene: React.FC<{ recap: EducationalProps["recap"] }> = ({ recap }) => {
  const theme = useTheme();
  return (
    <SafeArea gap={44}>
      <Kicker text="Quick recap" />
      <AnimatedTitle text={recap.title} size={type.heading} delay={4} />
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 10 }}>
        {recap.items.map((item, i) => (
          <RecapItem key={i} text={item} delay={14 + i * 7} color={theme.accent} />
        ))}
      </div>
    </SafeArea>
  );
};

const RecapItem: React.FC<{ text: string; delay: number; color: string }> = ({ text, delay, color }) => {
  const p = useEnter(delay);
  const theme = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, ...riseStyle(p, 24) }}>
      <CheckIcon color={color} size={52} />
      <span style={{ fontFamily: fonts.body, fontSize: type.body, fontWeight: 500, color: theme.text }}>{text}</span>
    </div>
  );
};

export const EducationalReel: React.FC<EducationalProps> = (props) => {
  const scenes: Scene[] = [
    { id: "hook", durationInSeconds: props.hook.durationInSeconds, render: () => <HookScene hook={props.hook} /> },
    ...props.points.map((point, i) => ({
      id: `point-${i}`,
      durationInSeconds: point.durationInSeconds,
      render: () => <PointScene point={point} index={i} total={props.points.length} />,
    })),
    { id: "recap", durationInSeconds: props.recap.durationInSeconds, render: () => <RecapScene recap={props.recap} /> },
    { id: "cta", durationInSeconds: props.cta.durationInSeconds, render: () => <CallToAction cta={props.cta} /> },
  ];

  return (
    <VideoShell theme={props.theme} audio={props.audio} sceneSeconds={sceneSeconds(props)}>
      <SceneSeries scenes={scenes} />
      <Disclaimer text={props.disclaimer} />
    </VideoShell>
  );
};
