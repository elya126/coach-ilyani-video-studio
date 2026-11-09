/**
 * TEMPLATE 5 — CLIENT TRANSFORMATION (consent-first)
 * Intro → before/after photos → starting point → habits worked on →
 * the client's OWN words → call to action.
 *
 * ETHICS BUILT IN:
 *  - A red "DRAFT" banner is rendered until `consentConfirmed` is true.
 *  - A results disclaimer is always visible.
 *  - Sample content is placeholders only — never invent a client story.
 * Edit in: src/content/transformation.ts
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
  DraftBanner,
  GoldDivider,
  HookScene,
  Kicker,
  MediaFrame,
  QuoteIcon,
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

const listScene = z.object({ title: z.string(), items: z.array(z.string()), durationInSeconds: seconds(6) });

export const transformationSchema = z.object({
  theme: themeSchema,
  consentConfirmed: z
    .boolean()
    .describe("Tick ONLY when you have the client's written permission to share their story and photos"),
  intro: hookSchema,
  photos: z.object({
    beforeSrc: mediaSrc,
    afterSrc: mediaSrc,
    beforeLabel: z.string(),
    afterLabel: z.string(),
    durationInSeconds: seconds(6),
  }),
  startingPoint: listScene,
  habits: listScene,
  clientWords: z.object({
    quote: z.string().describe("The client's exact words — do not edit or invent"),
    attribution: z.string(),
    durationInSeconds: seconds(7),
  }),
  cta: ctaSchema,
  disclaimer: z.string(),
  audio: audioSchema,
});
export type TransformationProps = z.infer<typeof transformationSchema>;

const sceneSeconds = (p: TransformationProps) => [
  p.intro.durationInSeconds,
  p.photos.durationInSeconds,
  p.startingPoint.durationInSeconds,
  p.habits.durationInSeconds,
  p.clientWords.durationInSeconds,
  p.cta.durationInSeconds,
];

export const calculateTransformationMetadata: CalculateMetadataFunction<TransformationProps> = ({ props }) => ({
  durationInFrames: totalSceneFrames(sceneSeconds(props)),
});

const PhotoCard: React.FC<{ src: string; label: string; delay: number; placeholder: string }> = ({
  src,
  label,
  delay,
  placeholder,
}) => {
  const theme = useTheme();
  const p = useEnter(delay);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22, ...riseStyle(p, 50) }}>
      <div
        style={{
          position: "relative",
          height: 820,
          borderRadius: 26,
          overflow: "hidden",
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 24px 50px ${theme.glow}`,
        }}
      >
        <MediaFrame src={src} label={placeholder} />
      </div>
      <span
        style={{
          fontFamily: fonts.body,
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
          fontWeight: 600,
          color: theme.accent,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const PhotosScene: React.FC<{ photos: TransformationProps["photos"] }> = ({ photos }) => (
  <SafeArea gap={0} justify="center">
    <div style={{ display: "flex", gap: 28, width: "100%" }}>
      <PhotoCard src={photos.beforeSrc} label={photos.beforeLabel} delay={2} placeholder="Before photo (with consent)" />
      <PhotoCard src={photos.afterSrc} label={photos.afterLabel} delay={12} placeholder="After photo (with consent)" />
    </div>
  </SafeArea>
);

const ListScene: React.FC<{ kicker: string; scene: z.infer<typeof listScene> }> = ({ kicker, scene }) => (
  <SafeArea gap={40}>
    <Kicker text={kicker} />
    <AnimatedTitle text={scene.title} size={type.heading} delay={4} />
    <GoldDivider delay={12} />
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {scene.items.map((item, i) => (
        <ListItem key={i} text={item} delay={16 + i * 7} />
      ))}
    </div>
  </SafeArea>
);

const ListItem: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const theme = useTheme();
  const p = useEnter(delay);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 24, ...riseStyle(p, 24) }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <CheckIcon color={theme.accent} size={50} />
      </div>
      <span style={{ fontFamily: fonts.body, fontSize: type.body - 2, lineHeight: 1.4, color: theme.text }}>{text}</span>
    </div>
  );
};

const ClientWordsScene: React.FC<{ words: TransformationProps["clientWords"] }> = ({ words }) => {
  const theme = useTheme();
  const p = useEnter(0);
  const quoteIn = useEnter(6);
  return (
    <SafeArea gap={36}>
      <div style={{ opacity: p }}>
        <QuoteIcon color={theme.accent} size={88} />
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: fonts.heading,
          fontStyle: "italic",
          fontSize: 58,
          lineHeight: 1.3,
          color: theme.text,
          ...riseStyle(quoteIn, 30),
        }}
      >
        {words.quote}
      </p>
      <GoldDivider delay={18} />
      <BodyText text={words.attribution} delay={22} muted />
    </SafeArea>
  );
};

export const ClientTransformation: React.FC<TransformationProps> = (props) => {
  const scenes: Scene[] = [
    { id: "intro", durationInSeconds: props.intro.durationInSeconds, render: () => <HookScene hook={props.intro} /> },
    { id: "photos", durationInSeconds: props.photos.durationInSeconds, render: () => <PhotosScene photos={props.photos} /> },
    {
      id: "starting-point",
      durationInSeconds: props.startingPoint.durationInSeconds,
      render: () => <ListScene kicker="Where we started" scene={props.startingPoint} />,
    },
    {
      id: "habits",
      durationInSeconds: props.habits.durationInSeconds,
      render: () => <ListScene kicker="What we worked on" scene={props.habits} />,
    },
    {
      id: "client-words",
      durationInSeconds: props.clientWords.durationInSeconds,
      render: () => <ClientWordsScene words={props.clientWords} />,
    },
    { id: "cta", durationInSeconds: props.cta.durationInSeconds, render: () => <CallToAction cta={props.cta} /> },
  ];
  return (
    <VideoShell theme={props.theme} audio={props.audio} sceneSeconds={sceneSeconds(props)}>
      <SceneSeries scenes={scenes} />
      <Disclaimer text={props.disclaimer} />
      {!props.consentConfirmed ? (
        <AbsoluteFill style={{ opacity: 0.92 }}>
          <DraftBanner text="DRAFT · CLIENT CONSENT NOT CONFIRMED" />
        </AbsoluteFill>
      ) : null}
    </VideoShell>
  );
};
