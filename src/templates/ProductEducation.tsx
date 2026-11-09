/**
 * TEMPLATE 6 — PRODUCT EDUCATION
 * Intro (with product photo) → what it is → how to use → label facts →
 * good-to-know tips → call to action. Always shows a disclaimer.
 *
 * Only use facts printed on the product label or official product info.
 * Edit in: src/content/productEducation.ts
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import {
  AnimatedTitle,
  BodyText,
  CallToAction,
  Disclaimer,
  GoldDivider,
  Kicker,
  MediaFrame,
  NumberBadge,
  SafeArea,
  SceneSeries,
  SparkleIcon,
  VideoShell,
  useTheme,
  type Scene,
} from "../components";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import { audioSchema, ctaSchema, mediaSrc, seconds, themeSchema } from "../lib/schemas";
import { totalSceneFrames } from "../lib/timing";

export const productSchema = z.object({
  theme: themeSchema,
  product: z.object({ name: z.string(), category: z.string(), imageSrc: mediaSrc }),
  intro: z.object({ kicker: z.string(), title: z.string(), durationInSeconds: seconds(4) }),
  whatItIs: z.object({ title: z.string(), body: z.string(), durationInSeconds: seconds(7) }),
  howToUse: z.object({ title: z.string(), steps: z.array(z.string()), durationInSeconds: seconds(8) }),
  labelFacts: z.object({
    title: z.string(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    note: z.string(),
    durationInSeconds: seconds(7),
  }),
  goodToKnow: z.object({ title: z.string(), items: z.array(z.string()), durationInSeconds: seconds(7) }),
  cta: ctaSchema,
  disclaimer: z.string(),
  audio: audioSchema,
});
export type ProductProps = z.infer<typeof productSchema>;

const sceneSeconds = (p: ProductProps) => [
  p.intro.durationInSeconds,
  p.whatItIs.durationInSeconds,
  p.howToUse.durationInSeconds,
  p.labelFacts.durationInSeconds,
  p.goodToKnow.durationInSeconds,
  p.cta.durationInSeconds,
];

export const calculateProductMetadata: CalculateMetadataFunction<ProductProps> = ({ props }) => ({
  durationInFrames: totalSceneFrames(sceneSeconds(props)),
});

const IntroScene: React.FC<{ props: ProductProps }> = ({ props }) => {
  const theme = useTheme();
  const card = useEnter(0);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 160,
          right: 160,
          height: 760,
          borderRadius: 400,
          overflow: "hidden",
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 30px 80px ${theme.glow}`,
          ...riseStyle(card, 80),
        }}
      >
        <MediaFrame src={props.product.imageSrc} label="Product photo: e.g. images/product.png" />
      </div>
      <SafeArea justify="flex-end" align="center" gap={26}>
        <Kicker text={props.intro.kicker} delay={8} />
        <AnimatedTitle text={props.intro.title} align="center" size={type.heading + 4} delay={12} />
        <BodyText text={`${props.product.name} · ${props.product.category}`} align="center" muted delay={24} />
      </SafeArea>
    </AbsoluteFill>
  );
};

const TextScene: React.FC<{ kicker: string; title: string; body: string }> = ({ kicker, title, body }) => (
  <SafeArea gap={40}>
    <Kicker text={kicker} />
    <AnimatedTitle text={title} size={type.heading} delay={4} />
    <GoldDivider delay={14} />
    <BodyText text={body} delay={18} />
  </SafeArea>
);

const StepsScene: React.FC<{ scene: ProductProps["howToUse"] }> = ({ scene }) => (
  <SafeArea gap={34}>
    <Kicker text="How to use" />
    <AnimatedTitle text={scene.title} size={type.heading} delay={4} />
    {scene.steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <NumberBadge value={i + 1} size={84} delay={14 + i * 8} />
        <BodyText text={step} delay={16 + i * 8} size={type.body - 2} />
      </div>
    ))}
  </SafeArea>
);

const FactRow: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => {
  const theme = useTheme();
  const p = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 30,
        padding: "26px 0",
        borderBottom: `1.5px solid ${theme.accentSoft}`,
        ...riseStyle(p, 20),
      }}
    >
      <span style={{ fontFamily: fonts.body, fontSize: 38, color: theme.mutedText }}>{label}</span>
      <span style={{ fontFamily: fonts.heading, fontSize: 44, fontWeight: 600, color: theme.text, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
};

const LabelScene: React.FC<{ scene: ProductProps["labelFacts"] }> = ({ scene }) => {
  const theme = useTheme();
  const card = useEnter(6);
  return (
    <SafeArea gap={36}>
      <Kicker text="Read the label" />
      <AnimatedTitle text={scene.title} size={type.heading} delay={2} />
      <div
        style={{
          width: "100%",
          padding: "20px 44px 34px",
          borderRadius: 28,
          backgroundColor: theme.surface,
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 24px 60px ${theme.glow}`,
          ...riseStyle(card, 40),
        }}
      >
        {scene.facts.map((f, i) => (
          <FactRow key={i} label={f.label} value={f.value} delay={12 + i * 6} />
        ))}
      </div>
      <BodyText text={scene.note} muted size={type.small + 2} delay={30} />
    </SafeArea>
  );
};

const GoodToKnowScene: React.FC<{ scene: ProductProps["goodToKnow"] }> = ({ scene }) => {
  const theme = useTheme();
  return (
    <SafeArea gap={36}>
      <Kicker text="Good to know" />
      <AnimatedTitle text={scene.title} size={type.heading} delay={4} />
      {scene.items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ marginTop: 8, flexShrink: 0 }}>
            <SparkleIcon color={theme.accent} size={34} />
          </div>
          <BodyText text={item} delay={14 + i * 8} size={type.body - 4} />
        </div>
      ))}
    </SafeArea>
  );
};

export const ProductEducation: React.FC<ProductProps> = (props) => {
  const scenes: Scene[] = [
    { id: "intro", durationInSeconds: props.intro.durationInSeconds, render: () => <IntroScene props={props} /> },
    {
      id: "what",
      durationInSeconds: props.whatItIs.durationInSeconds,
      render: () => <TextScene kicker="What it is" title={props.whatItIs.title} body={props.whatItIs.body} />,
    },
    { id: "how", durationInSeconds: props.howToUse.durationInSeconds, render: () => <StepsScene scene={props.howToUse} /> },
    { id: "label", durationInSeconds: props.labelFacts.durationInSeconds, render: () => <LabelScene scene={props.labelFacts} /> },
    { id: "tips", durationInSeconds: props.goodToKnow.durationInSeconds, render: () => <GoodToKnowScene scene={props.goodToKnow} /> },
    { id: "cta", durationInSeconds: props.cta.durationInSeconds, render: () => <CallToAction cta={props.cta} /> },
  ];
  return (
    <VideoShell theme={props.theme} audio={props.audio} sceneSeconds={sceneSeconds(props)}>
      <SceneSeries scenes={scenes} />
      <Disclaimer text={props.disclaimer} />
    </VideoShell>
  );
};
