/**
 * TEMPLATE 3 — NUTRITION TIPS
 * Hook → "Instead of… / Try…" swap cards → call to action.
 * Edit in: src/content/nutritionTips.ts
 */
import React from "react";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import {
  ArrowIcon,
  BodyText,
  CallToAction,
  CheckIcon,
  CrossIcon,
  Disclaimer,
  HookScene,
  Kicker,
  NumberBadge,
  SafeArea,
  SceneSeries,
  VideoShell,
  AnimatedTitle,
  useTheme,
  type Scene,
} from "../components";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import { audioSchema, ctaSchema, hookSchema, seconds, themeSchema } from "../lib/schemas";
import { totalSceneFrames } from "../lib/timing";

export const nutritionSchema = z.object({
  theme: themeSchema,
  hook: hookSchema,
  labels: z.object({
    tip: z.string().describe('Label above each tip, e.g. "Tip" or "Tukar"'),
    instead: z.string().describe('e.g. "Instead of" / "Daripada"'),
    tryThis: z.string().describe('e.g. "Try" / "Cuba"'),
  }),
  tips: z.array(
    z.object({
      title: z.string(),
      instead: z.string(),
      tryThis: z.string(),
      why: z.string().describe("Short, factual reason — no medical claims"),
      durationInSeconds: seconds(6),
    }),
  ),
  cta: ctaSchema,
  disclaimer: z.string(),
  audio: audioSchema,
});
export type NutritionProps = z.infer<typeof nutritionSchema>;

const sceneSeconds = (p: NutritionProps) => [
  p.hook.durationInSeconds,
  ...p.tips.map((t) => t.durationInSeconds),
  p.cta.durationInSeconds,
];

export const calculateNutritionMetadata: CalculateMetadataFunction<NutritionProps> = ({ props }) => ({
  durationInFrames: totalSceneFrames(sceneSeconds(props)),
});

const SwapRow: React.FC<{ label: string; text: string; positive: boolean; delay: number }> = ({
  label,
  text,
  positive,
  delay,
}) => {
  const theme = useTheme();
  const p = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        width: "100%",
        padding: "30px 34px",
        borderRadius: 26,
        backgroundColor: positive ? theme.surface : "transparent",
        border: `2px solid ${positive ? theme.accent : theme.accentSoft}`,
        boxShadow: positive ? `0 24px 50px ${theme.glow}` : undefined,
        ...riseStyle(p, 40),
      }}
    >
      {positive ? <CheckIcon color={theme.accent} size={64} /> : <CrossIcon color={theme.mutedText} size={64} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            letterSpacing: 5,
            textTransform: "uppercase",
            fontWeight: 600,
            color: positive ? theme.accent : theme.mutedText,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 42,
            fontWeight: positive ? 600 : 400,
            color: positive ? theme.text : theme.mutedText,
            textDecoration: positive ? undefined : "line-through",
            textDecorationColor: theme.accentSoft,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

const TipScene: React.FC<{ tip: NutritionProps["tips"][number]; labels: NutritionProps["labels"]; index: number; total: number }> = ({
  tip,
  labels,
  index,
  total,
}) => {
  const theme = useTheme();
  const arrow = useEnter(22);
  return (
    <SafeArea gap={30}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <NumberBadge value={index + 1} total={total} size={104} />
        <Kicker text={labels.tip} delay={4} />
      </div>
      <AnimatedTitle text={tip.title} size={type.heading} delay={6} />
      <SwapRow label={labels.instead} text={tip.instead} positive={false} delay={14} />
      <div style={{ alignSelf: "center", transform: `rotate(90deg) scale(${arrow})`, opacity: arrow }}>
        <ArrowIcon color={theme.accent} size={56} />
      </div>
      <SwapRow label={labels.tryThis} text={tip.tryThis} positive delay={26} />
      <BodyText text={tip.why} delay={38} muted size={type.body - 6} />
    </SafeArea>
  );
};

export const NutritionTips: React.FC<NutritionProps> = (props) => {
  const scenes: Scene[] = [
    { id: "hook", durationInSeconds: props.hook.durationInSeconds, render: () => <HookScene hook={props.hook} /> },
    ...props.tips.map((tip, i) => ({
      id: `tip-${i}`,
      durationInSeconds: tip.durationInSeconds,
      render: () => <TipScene tip={tip} labels={props.labels} index={i} total={props.tips.length} />,
    })),
    { id: "cta", durationInSeconds: props.cta.durationInSeconds, render: () => <CallToAction cta={props.cta} /> },
  ];
  return (
    <VideoShell theme={props.theme} audio={props.audio} sceneSeconds={sceneSeconds(props)}>
      <SceneSeries scenes={scenes} />
      <Disclaimer text={props.disclaimer} />
    </VideoShell>
  );
};
