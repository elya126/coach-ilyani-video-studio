import React from "react";
import { interpolate } from "remotion";
import { studioConfig } from "../../studio.config";
import { useEnter } from "../lib/animation";

/** Thin gold line with a small diamond that draws itself in. */
export const GoldDivider: React.FC<{ delay?: number; width?: number; align?: "left" | "center" }> = ({
  delay = 0,
  width = 260,
  align = "left",
}) => {
  const p = useEnter(delay);
  const { gold } = studioConfig.colors;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        alignSelf: align === "center" ? "center" : "flex-start",
        opacity: p,
      }}
    >
      <span style={{ width: interpolate(p, [0, 1], [0, width / 2]), height: 1.5, backgroundColor: gold }} />
      <span style={{ width: 10, height: 10, backgroundColor: gold, transform: `rotate(45deg) scale(${p})` }} />
      <span style={{ width: interpolate(p, [0, 1], [0, width / 2]), height: 1.5, backgroundColor: gold }} />
    </div>
  );
};
