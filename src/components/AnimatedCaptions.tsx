import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts, type } from "../config/theme";
import type { Caption } from "../lib/schemas";
import { toWords } from "../lib/text";

export type CaptionStyle = "pop" | "karaoke" | "fade";

/**
 * PROFESSIONAL ANIMATED CAPTIONS
 * Shows the caption that matches the current time.
 *  - "pop":     words appear one-by-one with a soft bounce
 *  - "karaoke": whole line visible, the spoken word lights up in gold
 *  - "fade":    the whole line fades in gently
 * Words wrapped in **double asterisks** are always gold.
 *
 * Word timings are spread evenly across each caption's start → end time.
 */
export const AnimatedCaptions: React.FC<{
  captions: Caption[];
  style?: CaptionStyle;
  /** Distance from bottom of the frame in px. */
  bottom?: number;
}> = ({ captions, style = studioConfig.animation.captionStyle, bottom = 520 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = captions.find((c) => t >= c.start && t < c.end);
  if (!active) return null;

  const words = toWords(active.text);
  const segStart = active.start * fps;
  const segFrames = Math.max(1, (active.end - active.start) * fps);
  const perWord = segFrames / Math.max(1, words.length);
  const local = frame - segStart;
  const lineIn = spring({ frame: local, fps, config: { damping: 200 }, durationInFrames: 8 });
  const { gold, white, black } = studioConfig.colors;

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 18,
          rowGap: 6,
          padding: "22px 34px",
          borderRadius: 22,
          backgroundColor: "rgba(14,14,14,0.55)",
          backdropFilter: "blur(6px)",
          opacity: style === "fade" ? lineIn : 1,
          transform: `translateY(${interpolate(lineIn, [0, 1], [24, 0])}px)`,
          maxWidth: 940,
        }}
      >
        {words.map((w, i) => {
          const wordStart = i * perWord;
          const isSpoken = local >= wordStart;
          const isCurrent = isSpoken && local < wordStart + perWord;
          const pop = spring({ frame: local - wordStart, fps, config: { damping: 14, stiffness: 180 }, durationInFrames: 10 });

          let opacity = 1;
          let scale = 1;
          let color = white;

          if (style === "pop") {
            opacity = isSpoken ? 1 : 0;
            scale = isSpoken ? 0.7 + pop * 0.3 : 0.7;
          } else if (style === "karaoke") {
            color = isCurrent ? gold : isSpoken ? white : "rgba(255,255,255,0.55)";
            scale = isCurrent ? 1.04 : 1;
          }

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: type.caption,
                lineHeight: 1.2,
                color,
                opacity,
                transform: `scale(${scale})`,
                textShadow: `0 3px 14px ${black}88`,
              }}
            >
              {w.parts.map((part, j) => (
                <span
                  key={j}
                  style={
                    part.highlight
                      ? { color: gold, fontWeight: 700, fontStyle: "italic", paddingRight: "0.04em" }
                      : undefined
                  }
                >
                  {part.text}
                </span>
              ))}
            </span>
          );
        })}
      </div>
    </div>
  );
};
