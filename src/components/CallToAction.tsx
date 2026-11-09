import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { studioConfig } from "../../studio.config";
import { fonts, type } from "../config/theme";
import { riseStyle, useEnter } from "../lib/animation";
import type { Cta } from "../lib/schemas";
import { AnimatedTitle } from "./AnimatedTitle";
import { BodyText } from "./BodyText";
import { GoldDivider } from "./GoldDivider";
import { BookmarkIcon } from "./Icons";
import { SafeArea } from "./SafeArea";
import { useTheme } from "./ThemeContext";

/** End card: title, subtitle, gold "button" and handle. */
export const CallToAction: React.FC<{ cta: Cta }> = ({ cta }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const btn = useEnter(22);
  const handle = useEnter(32);
  const shimmer = interpolate((frame % 75) / 75, [0, 1], [-120, 220]);
  const { gold, goldLight, black } = studioConfig.colors;

  return (
    <SafeArea align="center" gap={44}>
      <BookmarkIcon color={theme.accent} size={72} />
      <AnimatedTitle text={cta.title} align="center" size={type.heading + 6} />
      <GoldDivider align="center" delay={10} />
      <BodyText text={cta.subtitle} align="center" muted delay={14} />
      {cta.buttonText ? (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: 16,
            padding: "30px 64px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
            color: black,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 2,
            boxShadow: `0 18px 40px ${theme.glow}`,
            ...riseStyle(btn, 30),
          }}
        >
          {cta.buttonText}
          <span
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shimmer}%`,
              width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        </div>
      ) : null}
      <div
        style={{
          fontFamily: fonts.heading,
          fontStyle: "italic",
          fontSize: 44,
          color: theme.accent,
          ...riseStyle(handle, 20),
        }}
      >
        {studioConfig.brand.handle}
      </div>
    </SafeArea>
  );
};
