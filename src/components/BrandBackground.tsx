import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "./ThemeContext";

/**
 * Premium background: solid brand colour, a slow-drifting champagne glow
 * and a fine gold frame line. Used behind every scene.
 */
export const BrandBackground: React.FC<{ showFrame?: boolean }> = ({ showFrame = true }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);

  const x1 = 25 + Math.sin(drift * Math.PI * 2) * 12;
  const y1 = 18 + Math.cos(drift * Math.PI * 2) * 6;
  const x2 = 78 - Math.sin(drift * Math.PI * 2) * 10;
  const y2 = 84 - Math.cos(drift * Math.PI * 2) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, ${theme.glow} 0%, transparent 45%),
                       radial-gradient(circle at ${x2}% ${y2}%, ${theme.glow} 0%, transparent 40%)`,
        }}
      />
      {showFrame ? (
        <AbsoluteFill
          style={{
            margin: 36,
            border: `1.5px solid ${theme.accent}`,
            opacity: 0.28,
            borderRadius: 4,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
