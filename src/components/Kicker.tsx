import React from "react";
import { interpolate } from "remotion";
import { fonts, type } from "../config/theme";
import { useEnter } from "../lib/animation";
import { useTheme } from "./ThemeContext";

/** Small uppercase label with a gold line, e.g. "— NUTRITION TIP". */
export const Kicker: React.FC<{ text: string; delay?: number; color?: string }> = ({ text, delay = 0, color }) => {
  const theme = useTheme();
  const p = useEnter(delay);
  if (!text) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: p }}>
      <span
        style={{
          width: interpolate(p, [0, 1], [0, 64]),
          height: 2,
          backgroundColor: theme.accent,
        }}
      />
      <span
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: type.kicker,
          letterSpacing: 7,
          textTransform: "uppercase",
          color: color ?? theme.accent,
        }}
      >
        {text}
      </span>
    </div>
  );
};
