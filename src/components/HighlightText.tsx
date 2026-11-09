import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { parseHighlights } from "../lib/text";
import { useTheme } from "./ThemeContext";

/**
 * Renders text where **marked words** are champagne gold with an
 * underline that sweeps in after `delay` frames.
 */
export const HighlightText: React.FC<{
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, style }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const sweep = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span style={style}>
      {parseHighlights(text).map((part, i) =>
        part.highlight ? (
          <span key={i} style={{ position: "relative", color: theme.accent, whiteSpace: "nowrap" }}>
            {part.text}
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "0.02em",
                height: "0.12em",
                backgroundColor: theme.accentSoft,
                opacity: 0.7,
                transform: `scaleX(${sweep})`,
                transformOrigin: "left center",
                zIndex: -1,
              }}
            />
          </span>
        ) : (
          <React.Fragment key={i}>{part.text}</React.Fragment>
        ),
      )}
    </span>
  );
};
