import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts, type } from "../config/theme";
import { toWords } from "../lib/text";
import { wordStaggerFrames } from "../lib/animation";
import { useTheme } from "./ThemeContext";

/**
 * Elegant serif title where each word rises in one after another.
 * Supports **gold highlights**.
 */
export const AnimatedTitle: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  align?: "left" | "center";
  color?: string;
  italicHighlights?: boolean;
}> = ({ text, delay = 0, size = type.title, align = "left", color, italicHighlights = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const words = toWords(text);
  const stagger = wordStaggerFrames();

  return (
    <h1
      style={{
        margin: 0,
        fontFamily: fonts.heading,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -0.5,
        color: color ?? theme.text,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
      }}
    >
      {words.map((w, i) => {
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: studioConfig.animation.springDamping, stiffness: 120 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.5, 0])}px)`,
            }}
          >
            {w.parts.map((part, j) => (
              <span
                key={j}
                style={{
                  color: part.highlight ? theme.accent : undefined,
                  fontStyle: part.highlight && italicHighlights ? "italic" : undefined,
                  paddingRight: part.highlight && italicHighlights ? "0.04em" : undefined,
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
};
