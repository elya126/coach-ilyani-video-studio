import { VIDEO } from "../config/video";
import { studioConfig } from "../../studio.config";

/** Converts seconds to frames (30 fps → 1 second = 30 frames). */
export const sec = (seconds: number): number => Math.max(1, Math.round(seconds * VIDEO.fps));

/** Frames used by each scene transition (0 when transitions are off). */
export const transitionFrames = (): number =>
  studioConfig.animation.transition === "none" ? 0 : sec(studioConfig.animation.transitionSeconds);

/**
 * Total frames for a list of scenes played back-to-back.
 * Transitions overlap neighbouring scenes, so each one shortens the total.
 */
export const totalSceneFrames = (sceneSeconds: number[]): number => {
  const frames = sceneSeconds.reduce((sum, s) => sum + sec(s), 0);
  const overlaps = Math.max(0, sceneSeconds.length - 1) * transitionFrames();
  return Math.max(1, frames - overlaps);
};

/** Frame at which each scene starts (used to place transition sound effects). */
export const sceneStartFrames = (sceneSeconds: number[]): number[] => {
  const starts: number[] = [];
  let cursor = 0;
  sceneSeconds.forEach((s, i) => {
    starts.push(cursor);
    cursor += sec(s) - (i < sceneSeconds.length - 1 ? transitionFrames() : 0);
  });
  return starts;
};
