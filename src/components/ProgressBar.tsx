import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { useTheme } from "./ThemeContext";

/** Thin champagne-gold bar showing how much of the video has played. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme = useTheme();
  const { show, position, height } = studioConfig.progressBar;
  if (!show) return null;

  const progress = Math.min(1, (frame + 1) / durationInFrames);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          [position]: 0,
          height,
          backgroundColor: theme.name === "dark" ? "rgba(255,255,255,0.12)" : "rgba(14,14,14,0.08)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${studioConfig.colors.goldDeep}, ${studioConfig.colors.gold}, ${studioConfig.colors.goldLight})`,
            boxShadow: `0 0 18px ${studioConfig.colors.gold}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
