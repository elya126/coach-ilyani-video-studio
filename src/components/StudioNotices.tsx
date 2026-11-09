import React from "react";
import { AbsoluteFill, getRemotionEnvironment, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts } from "../config/theme";

/** Preview-only badge when a video is outside the 30–60 second target. */
export const DurationWarning: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  if (!getRemotionEnvironment().isStudio) return null;
  const seconds = durationInFrames / fps;
  const { min, max } = studioConfig.duration;
  if (seconds >= min && seconds <= max) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          right: 40,
          padding: "16px 24px",
          borderRadius: 12,
          backgroundColor: "#8A1C1C",
          color: "white",
          fontFamily: fonts.body,
          fontSize: 26,
        }}
      >
        Preview note: this video is {seconds.toFixed(1)}s. Target is {min}–{max}s — adjust scene durations in the
        content file.
      </div>
    </AbsoluteFill>
  );
};

/**
 * Shown in the preview AND final render until the client's written consent
 * is confirmed in the content file. Prevents accidentally publishing a draft.
 */
export const DraftBanner: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ pointerEvents: "none", justifyContent: "center", alignItems: "center" }}>
    <div
      style={{
        transform: "rotate(-28deg)",
        padding: "22px 140px",
        backgroundColor: "rgba(138, 28, 28, 0.88)",
        color: "white",
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 40,
        letterSpacing: 4,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);
