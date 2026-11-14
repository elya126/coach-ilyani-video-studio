import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts } from "../config/theme";
import type { Caption } from "../lib/schemas";
import { toWords } from "../lib/text";

/**
 * SOCIAL-STYLE CAPTIONS (for talking reels)
 *  - Long caption lines are cut into 3–4 word chunks automatically,
 *    so you can paste whole sentences (or an .srt) without worrying.
 *  - The word being spoken lights up in gold.
 *  - **Keywords** are bigger, bold and bounce in. Mark numbers always.
 *  - No boxes: a fixed soft dark band behind the caption zone keeps
 *    them readable (see CaptionBand).
 * Settings: studio.config.ts → reelCaptions
 */
export const ReelCaptions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = studioConfig.reelCaptions;
  const t = frame / fps;
  const active = captions.find((c) => t >= c.start && t < c.end);
  if (!active) return null;

  const words = toWords(active.text, true);
  if (!words.length) return null;
  const segFrames = Math.max(1, (active.end - active.start) * fps);
  const perWord = segFrames / words.length;
  const local = frame - active.start * fps;
  const currentIndex = Math.min(words.length - 1, Math.floor(local / perWord));
  // Balanced chunks: 5 words → 3 + 2 (never a lonely last word)
  const chunkCount = Math.ceil(words.length / Math.max(1, cfg.wordsPerLine));
  const chunkSize = Math.ceil(words.length / chunkCount);
  const chunkStart = Math.floor(currentIndex / chunkSize) * chunkSize;
  const chunk = words.slice(chunkStart, chunkStart + chunkSize);

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: cfg.bottom,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: 16,
        rowGap: 4,
      }}
    >
      {chunk.map((w, i) => {
        const index = chunkStart + i;
        const isCurrent = index === currentIndex;
        const wordStart = index * perWord;
        const bounce = spring({ frame: local - wordStart, fps, config: { damping: 11, stiffness: 200 }, durationInFrames: 12 });
        const size = w.highlight ? cfg.size * cfg.keywordScale : cfg.size;
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              fontFamily: fonts.body,
              fontWeight: w.highlight ? 800 : 700,
              fontSize: size,
              lineHeight: 1.15,
              letterSpacing: -0.5,
              transform: w.highlight && local >= wordStart ? `scale(${0.85 + 0.15 * bounce})` : undefined,
            }}
          >
            {w.parts.map((part, j) => (
              <span
                key={j}
                style={{
                  color: isCurrent ? cfg.activeColor : part.highlight ? cfg.keywordColor : cfg.textColor,
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
};

/** Fixed, soft dark band behind the caption zone (never flickers per line). */
export const CaptionBand: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: studioConfig.reelCaptions.bottom - 140,
      height: 420,
      background:
        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.38) 35%, rgba(0,0,0,0.38) 65%, rgba(0,0,0,0) 100%)",
      pointerEvents: "none",
    }}
  />
);
