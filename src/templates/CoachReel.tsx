/**
 * TEMPLATE 7 — COACH REEL (talking reel, "every sentence becomes an effect")
 *
 * Your talking video + layers on top, all placed by SECONDS:
 *   zooms     → gentle punch-ins / "second camera" cuts (max 108%)
 *   broll     → full-screen clips that match what you're saying (your voice keeps playing)
 *   beats     → on-screen graphics: headline, flying cards, compare, big number,
 *               checklist, proof chip, comment bar (see components/ReelBeats.tsx)
 *   captions  → 3–4 words at a time, spoken word in gold, **keywords** bigger
 *
 * Edit a reel in: src/content/reels/*.ts
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { CaptionBand, Disclaimer, MediaFrame, ReelBeat, ReelCaptions, VideoShell, beatSchema } from "../components";
import { audioSchema, captionSchema, mediaSrc } from "../lib/schemas";
import { sec } from "../lib/timing";

export const coachReelSchema = z.object({
  videoSrc: mediaSrc.describe('Your talking video, e.g. "videos/reel01.mp4"'),
  durationInSeconds: z.number().min(5).max(90).describe("Match the length of your edited talking video"),
  zooms: z.array(
    z.object({
      start: z.number().min(0),
      end: z.number().min(0),
      scale: z.number().min(1).max(1.08).describe("1.04 = close shot, 1.08 = punchline"),
      smooth: z.boolean().describe("true = slow push-in, false = instant cut"),
    }),
  ),
  broll: z.array(
    z.object({ src: mediaSrc, start: z.number().min(0), end: z.number().min(0), label: z.string() }),
  ),
  beats: z.array(beatSchema),
  captions: z.array(captionSchema),
  disclaimer: z.string(),
  audio: audioSchema,
});
export type CoachReelProps = z.infer<typeof coachReelSchema>;

export const calculateCoachReelMetadata: CalculateMetadataFunction<CoachReelProps> = ({ props }) => ({
  durationInFrames: sec(props.durationInSeconds),
});

/** Your talking video with zooms applied. */
const TalkingLayer: React.FC<{ props: CoachReelProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const zoom = props.zooms.find((z) => t >= z.start && t < z.end);
  let scale = 1;
  if (zoom) {
    scale = zoom.smooth
      ? interpolate(t, [zoom.start, zoom.start + Math.min(1.2, (zoom.end - zoom.start) * 0.6)], [1, zoom.scale], {
          extrapolateRight: "clamp",
        })
      : zoom.scale;
  }
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 35%" }}>
      <MediaFrame src={props.videoSrc} withSound label="Talking video: set videoSrc (e.g. videos/reel01.mp4)" />
    </AbsoluteFill>
  );
};

/** Full-screen b-roll with a quick, soft whip in. */
const BrollClip: React.FC<{ src: string; label: string }> = ({ src, label }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const outP = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inP, outP),
        transform: `translateX(${interpolate(inP, [0, 1], [60, 0])}px) scale(${interpolate(inP, [0, 1], [1.06, 1])})`,
        filter: `blur(${interpolate(inP, [0, 1], [8, 0])}px)`,
      }}
    >
      <MediaFrame src={src} label={`B-roll: ${label}`} />
    </AbsoluteFill>
  );
};

export const CoachReel: React.FC<CoachReelProps> = (props) => {
  const { fps } = useVideoConfig();
  const window = (start: number, end: number) => ({
    from: Math.round(start * fps),
    durationInFrames: Math.max(1, Math.round((end - start) * fps)),
  });

  return (
    <VideoShell theme="dark" audio={props.audio} overFootage showBackground={false} duckMusic watermarkPosition="top-right">
      <TalkingLayer props={props} />
      {props.broll.map((b, i) => (
        <Sequence key={`b-${i}`} {...window(b.start, b.end)}>
          <BrollClip src={b.src} label={b.label} />
        </Sequence>
      ))}
      <CaptionBand />
      {props.beats.map((beat, i) => (
        <Sequence key={`beat-${i}`} {...window(beat.start, beat.end)} layout="absolute-fill">
          <ReelBeat beat={beat} />
        </Sequence>
      ))}
      <ReelCaptions captions={props.captions} />
      <Disclaimer text={props.disclaimer} forceLight bottom={300} />
    </VideoShell>
  );
};
