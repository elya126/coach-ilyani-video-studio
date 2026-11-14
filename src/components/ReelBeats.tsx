/**
 * ON-SCREEN "BEATS" FOR TALKING REELS
 * Short graphics that appear on top of your talking video at exact seconds,
 * so the viewer gets something new every few seconds.
 *
 *  headline   – big bold words at the top (+ small "for who" label)
 *  cards      – 2–4 cards fly out from your open palm, one by one
 *  compare    – two panels: left greyed with ⏸ (the old way), right gold (your way)
 *  bigNumber  – giant see-through number with a label
 *  checklist  – ✓ / ✕ list ("suits you / doesn't suit you")
 *  proof      – "REAL EXPERIENCE · with permission" chip + results-vary note
 *  comment    – a comment bar that types your CTA keyword
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { studioConfig } from "../../studio.config";
import { fonts } from "../config/theme";
import { CheckIcon, CrossIcon, PauseIcon } from "./Icons";

const time = { start: z.number().min(0), end: z.number().min(0) };

export const beatSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("headline"), ...time, text: z.string(), label: z.string() }),
  z.object({ type: z.literal("cards"), ...time, items: z.array(z.string()) }),
  z.object({ type: z.literal("compare"), ...time, left: z.string(), right: z.string() }),
  z.object({ type: z.literal("bigNumber"), ...time, number: z.string(), label: z.string() }),
  z.object({
    type: z.literal("checklist"),
    ...time,
    items: z.array(z.object({ text: z.string(), ok: z.boolean() })),
  }),
  z.object({ type: z.literal("proof"), ...time, chip: z.string(), note: z.string() }),
  z.object({ type: z.literal("comment"), ...time, keyword: z.string(), placeholder: z.string() }),
]);
export type Beat = z.infer<typeof beatSchema>;

const { gold, white, black } = studioConfig.colors;
const glass: React.CSSProperties = {
  backgroundColor: "rgba(14,14,14,0.62)",
  border: `1.5px solid ${gold}88`,
  borderRadius: 26,
  backdropFilter: "blur(10px)",
  color: white,
  fontFamily: fonts.body,
};

/** Fades a beat in at its start and out over its last frames. */
const useBeatPresence = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 10 });
  const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { enter, opacity: Math.min(enter, exit), frame, fps };
};

const Headline: React.FC<{ text: string; label: string }> = ({ text, label }) => {
  const { enter, opacity } = useBeatPresence();
  return (
    <div style={{ position: "absolute", top: 230, left: 70, right: 70, opacity, textAlign: "center" }}>
      {label ? (
        <div
          style={{
            display: "inline-block",
            marginBottom: 18,
            padding: "8px 22px",
            borderRadius: 999,
            backgroundColor: gold,
            color: black,
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 84,
          lineHeight: 1.02,
          letterSpacing: -1,
          color: white,
          textTransform: "uppercase",
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px) scale(${0.92 + 0.08 * enter})`,
          textShadow: "0 6px 30px rgba(0,0,0,0.35)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** G8 — cards fly out of the palm (bottom centre) to a stack on the right. */
const Cards: React.FC<{ items: string[] }> = ({ items }) => {
  const { opacity, frame, fps } = useBeatPresence();
  const { durationInFrames } = useVideoConfig();
  const gap = Math.max(6, Math.floor((durationInFrames * 0.6) / Math.max(1, items.length)));
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {items.map((item, i) => {
        const p = spring({ frame: frame - i * gap, fps, config: { damping: 15, stiffness: 120 } });
        const x = interpolate(p, [0, 1], [-160, 0]);
        const y = interpolate(p, [0, 1], [520, 0]);
        return (
          <div
            key={i}
            style={{
              ...glass,
              position: "absolute",
              right: 70,
              top: 520 + i * 170,
              width: 470,
              padding: "26px 30px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: 1,
              textTransform: "uppercase",
              opacity: p,
              transform: `translate(${x}px, ${y}px) rotate(${interpolate(p, [0, 1], [-14, 0])}deg) scale(${0.5 + 0.5 * p})`,
            }}
          >
            <CheckIcon color={gold} size={46} />
            {item}
          </div>
        );
      })}
    </div>
  );
};

/** D4-style comparison — the old way is frozen in grey with a ⏸. */
const Compare: React.FC<{ left: string; right: string }> = ({ left, right }) => {
  const { enter, opacity, frame, fps } = useBeatPresence();
  const second = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const panel: React.CSSProperties = {
    ...glass,
    flex: 1,
    height: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    textAlign: "center",
    padding: 24,
    fontWeight: 800,
    fontSize: 44,
    textTransform: "uppercase",
    lineHeight: 1.05,
  };
  return (
    <div style={{ position: "absolute", top: 240, left: 60, right: 60, display: "flex", gap: 22, opacity }}>
      <div style={{ ...panel, filter: "grayscale(1)", opacity: 0.75 * enter, color: "#CFCFCF", textDecoration: "line-through" }}>
        <PauseIcon color="#CFCFCF" size={52} />
        {left}
      </div>
      <div
        style={{
          ...panel,
          border: `2.5px solid ${gold}`,
          color: white,
          opacity: second,
          transform: `scale(${0.9 + 0.1 * second})`,
          boxShadow: `0 0 40px ${gold}55`,
        }}
      >
        <CheckIcon color={gold} size={56} />
        {right}
      </div>
    </div>
  );
};

const BigNumber: React.FC<{ number: string; label: string }> = ({ number, label }) => {
  const { enter, opacity } = useBeatPresence();
  return (
    <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center", opacity }}>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 340,
          lineHeight: 0.9,
          color: "rgba(255,255,255,0.28)",
          WebkitTextStroke: `3px ${gold}`,
          transform: `scale(${0.8 + 0.2 * enter})`,
        }}
      >
        {number}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 4,
          color: white,
          textTransform: "uppercase",
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Checklist: React.FC<{ items: { text: string; ok: boolean }[] }> = ({ items }) => {
  const { opacity, frame, fps } = useBeatPresence();
  return (
    <div style={{ ...glass, position: "absolute", top: 240, left: 70, right: 70, padding: "30px 36px", opacity }}>
      {items.map((item, i) => {
        const p = spring({ frame: frame - 4 - i * 14, fps, config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: 42,
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
              color: item.ok ? white : "#BDBDBD",
            }}
          >
            {item.ok ? <CheckIcon color={gold} size={54} /> : <CrossIcon color="#BDBDBD" size={54} />}
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

const Proof: React.FC<{ chip: string; note: string }> = ({ chip, note }) => {
  const { enter, opacity } = useBeatPresence();
  return (
    <div style={{ position: "absolute", top: 250, left: 70, opacity, transform: `translateY(${interpolate(enter, [0, 1], [-20, 0])}px)` }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 24px",
          borderRadius: 999,
          backgroundColor: gold,
          color: black,
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: black }} />
        {chip}
      </div>
      {note ? (
        <div style={{ marginTop: 14, fontFamily: fonts.body, fontSize: 28, fontWeight: 500, color: white, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          {note}
        </div>
      ) : null}
    </div>
  );
};

/** P2 — a comment bar that types the keyword, then a gold "send" pulse. */
const Comment: React.FC<{ keyword: string; placeholder: string }> = ({ keyword, placeholder }) => {
  const { enter, opacity, frame } = useBeatPresence();
  const typed = Math.max(0, Math.min(keyword.length, Math.floor((frame - 12) / 4)));
  const done = typed >= keyword.length;
  const cursor = Math.floor(frame / 8) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 860,
        opacity,
        transform: `translateY(${interpolate(enter, [0, 1], [60, 0])}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: white,
          borderRadius: 999,
          padding: "22px 22px 22px 40px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        <span style={{ flex: 1, fontFamily: fonts.body, fontSize: 40, fontWeight: 700, color: typed ? black : "#9A9A9A" }}>
          {typed ? keyword.slice(0, typed) : placeholder}
          {!done && cursor ? <span style={{ color: gold }}>|</span> : null}
        </span>
        <span
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            backgroundColor: done ? gold : "#E3E3E3",
            color: black,
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 30,
            transform: `scale(${done ? 1 + 0.06 * Math.sin(frame / 3) : 1})`,
          }}
        >
          POST
        </span>
      </div>
    </div>
  );
};

export const ReelBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  switch (beat.type) {
    case "headline":
      return <Headline text={beat.text} label={beat.label} />;
    case "cards":
      return <Cards items={beat.items} />;
    case "compare":
      return <Compare left={beat.left} right={beat.right} />;
    case "bigNumber":
      return <BigNumber number={beat.number} label={beat.label} />;
    case "checklist":
      return <Checklist items={beat.items} />;
    case "proof":
      return <Proof chip={beat.chip} note={beat.note} />;
    case "comment":
      return <Comment keyword={beat.keyword} placeholder={beat.placeholder} />;
  }
};
