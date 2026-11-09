import React from "react";
import { fonts } from "../config/theme";
import { useEnter } from "../lib/animation";
import { useTheme } from "./ThemeContext";

/** Circular gold number used for tips and steps ("01", "02"...). */
export const NumberBadge: React.FC<{ value: number; total?: number; delay?: number; size?: number }> = ({
  value,
  total,
  delay = 0,
  size = 132,
}) => {
  const theme = useTheme();
  const p = useEnter(delay);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 18, opacity: p, transform: `scale(${0.85 + p * 0.15})`, transformOrigin: "left bottom" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${theme.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.heading,
          fontSize: size * 0.42,
          fontWeight: 600,
          fontStyle: "italic",
          color: theme.accent,
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      {total ? (
        <span style={{ fontFamily: fonts.body, fontSize: 28, letterSpacing: 4, color: theme.mutedText, paddingBottom: 12 }}>
          / {String(total).padStart(2, "0")}
        </span>
      ) : null}
    </div>
  );
};
