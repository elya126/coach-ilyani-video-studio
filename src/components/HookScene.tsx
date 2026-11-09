import React from "react";
import { AbsoluteFill } from "remotion";
import type { Hook } from "../lib/schemas";
import { AnimatedTitle } from "./AnimatedTitle";
import { BodyText } from "./BodyText";
import { GoldDivider } from "./GoldDivider";
import { Kicker } from "./Kicker";
import { MediaFrame } from "./MediaFrame";
import { SafeArea } from "./SafeArea";
import { ThemeProvider } from "./ThemeContext";

/**
 * Opening "hook" scene — the first 2–4 seconds that stop the scroll.
 * Optional background image/video (`backgroundSrc`) switches to white text.
 */
export const HookScene: React.FC<{ hook: Hook; backgroundSrc?: string }> = ({ hook, backgroundSrc }) => {
  const content = (
    <SafeArea gap={40}>
      <Kicker text={hook.kicker} />
      <AnimatedTitle text={hook.title} delay={6} />
      <GoldDivider delay={18} />
      <BodyText text={hook.subtitle} delay={22} muted />
    </SafeArea>
  );
  if (!backgroundSrc) return content;
  return (
    <AbsoluteFill>
      <MediaFrame src={backgroundSrc} overlay={0.65} />
      <ThemeProvider theme="dark">{content}</ThemeProvider>
    </AbsoluteFill>
  );
};
