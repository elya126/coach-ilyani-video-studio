import React from "react";
import { AbsoluteFill } from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts } from "../config/theme";
import { useTheme } from "./ThemeContext";

/** Subtle @coachilyani handle. Settings: studio.config.ts → watermark. */
type Corner = "bottom-left" | "bottom-right" | "top-left" | "top-right";

export const Watermark: React.FC<{ forceLight?: boolean; position?: Corner }> = ({ forceLight, position: override }) => {
  const theme = useTheme();
  const { show, text, opacity } = studioConfig.watermark;
  const position = override ?? studioConfig.watermark.position;
  if (!show) return null;

  const [vertical, horizontal] = position.split("-") as ["top" | "bottom", "left" | "right"];
  const color = forceLight ? "#FFFFFF" : theme.text;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          [vertical]: vertical === "top" ? 150 : 300,
          [horizontal]: 84,
          fontFamily: fonts.body,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 3,
          color,
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
          textShadow: forceLight ? "0 2px 12px rgba(0,0,0,0.45)" : undefined,
        }}
      >
        <span style={{ width: 28, height: 1.5, backgroundColor: studioConfig.colors.gold }} />
        {text}
      </div>
    </AbsoluteFill>
  );
};
