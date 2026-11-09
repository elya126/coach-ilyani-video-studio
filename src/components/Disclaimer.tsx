import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts, type } from "../config/theme";
import { useTheme } from "./ThemeContext";

/**
 * Small, always-readable disclaimer line placed above the app's UI area.
 * Keep honest wording here — e.g. "Individual results vary."
 */
export const Disclaimer: React.FC<{ text: string; forceLight?: boolean; bottom?: number }> = ({
  text,
  forceLight,
  bottom = 230,
}) => {
  const theme = useTheme();
  if (!text) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 130,
          bottom,
          fontFamily: fonts.body,
          fontSize: type.small - 6,
          lineHeight: 1.4,
          color: forceLight ? "rgba(255,255,255,0.85)" : theme.mutedText,
          opacity: 0.9,
          textShadow: forceLight ? "0 2px 10px rgba(0,0,0,0.6)" : undefined,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
