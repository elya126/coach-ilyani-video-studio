import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE_AREA } from "../config/video";

/** Keeps content away from the app buttons/usernames on Reels & TikTok. */
export const SafeArea: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  gap?: number;
}> = ({ children, justify = "center", align = "flex-start", gap = 36 }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE_AREA.top,
      paddingBottom: SAFE_AREA.bottom,
      paddingLeft: SAFE_AREA.left,
      paddingRight: SAFE_AREA.right,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      alignItems: align,
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);
