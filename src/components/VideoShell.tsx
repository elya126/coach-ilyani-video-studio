import React from "react";
import { AbsoluteFill } from "remotion";
import type { ThemeName } from "../../studio.config";
import type { AudioSettings } from "../lib/schemas";
import { sceneStartFrames } from "../lib/timing";
import { AudioLayer } from "./AudioLayer";
import { BrandBackground } from "./BrandBackground";
import { ProgressBar } from "./ProgressBar";
import { DurationWarning } from "./StudioNotices";
import { ThemeProvider } from "./ThemeContext";
import { Watermark } from "./Watermark";

/**
 * The frame around every video: theme, background, audio, progress bar,
 * watermark and the preview-only duration check. Templates put their
 * scenes inside it.
 */
export const VideoShell: React.FC<{
  theme: ThemeName;
  audio: AudioSettings;
  sceneSeconds?: number[];
  /** Use white watermark/progress on top of full-screen footage. */
  overFootage?: boolean;
  showBackground?: boolean;
  duckMusic?: boolean;
  children: React.ReactNode;
}> = ({ theme, audio, sceneSeconds = [], overFootage = false, showBackground = true, duckMusic = false, children }) => (
  <ThemeProvider theme={theme}>
    <AbsoluteFill>
      {showBackground ? <BrandBackground /> : null}
      {children}
      <Watermark forceLight={overFootage} />
      <ProgressBar />
      <AudioLayer audio={audio} sceneStarts={sceneStartFrames(sceneSeconds)} duck={duckMusic} />
      <DurationWarning />
    </AbsoluteFill>
  </ThemeProvider>
);
