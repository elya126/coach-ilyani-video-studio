import React from "react";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import { HighlightText } from "./HighlightText";
import { useTheme } from "./ThemeContext";

/** Paragraph text that fades/rises in. Supports **gold highlights**. */
export const BodyText: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  align?: "left" | "center";
  muted?: boolean;
  color?: string;
  maxWidth?: number;
}> = ({ text, delay = 0, size = type.body, align = "left", muted, color, maxWidth }) => {
  const theme = useTheme();
  const p = useEnter(delay);
  if (!text) return null;
  return (
    <p
      style={{
        margin: 0,
        fontFamily: fonts.body,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.45,
        color: color ?? (muted ? theme.mutedText : theme.text),
        textAlign: align,
        maxWidth,
        ...riseStyle(p, 30),
      }}
    >
      <HighlightText text={text} delay={delay + 10} />
    </p>
  );
};
