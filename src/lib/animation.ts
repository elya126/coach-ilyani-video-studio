import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { studioConfig } from "../../studio.config";
import { VIDEO } from "../config/video";

/**
 * Smooth 0 → 1 value that starts after `delay` frames.
 * Damping comes from studio.config.ts → animation.springDamping.
 */
export const useEnter = (delay = 0, durationInFrames?: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    durationInFrames,
    config: { damping: studioConfig.animation.springDamping, mass: 0.9, stiffness: 110 },
  });
};

/** Fade + rise style for an element. `progress` is 0 → 1. */
export const riseStyle = (progress: number, distance = 40): React.CSSProperties => ({
  opacity: progress,
  transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
});

/** Fade-out over the last `frames` frames of a scene. */
export const useExit = (frames = 10): number => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - frames, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Frames between each word in animated titles. */
export const wordStaggerFrames = (): number => {
  return Math.max(1, Math.round(studioConfig.animation.wordStagger * VIDEO.fps));
};
