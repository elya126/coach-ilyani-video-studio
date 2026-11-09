/**
 * Shared building blocks for every template's editable properties.
 *
 * These "schemas" describe what each video accepts. Remotion Studio reads
 * them to show an editing panel (right-hand sidebar → "Props"), so you can
 * change text, durations and audio without touching code.
 */
import { z } from "zod";

export const themeSchema = z.enum(["light", "dark"]).describe("Light (ivory) or dark (black) look");

/** Media path inside /public (e.g. "broll/walk.mp4") or a URL. Empty = placeholder. */
export const mediaSrc = z.string().describe('Path inside /public, e.g. "broll/clip.mp4". Leave empty for a placeholder.');

export const seconds = (fallback: number) =>
  z.number().min(1).max(60).default(fallback).describe("Duration in seconds");

export const musicSchema = z.object({
  src: mediaSrc,
  volume: z.number().min(0).max(1).optional().describe("Overrides studio.config.ts musicVolume"),
  startFromSecond: z.number().min(0).optional().describe("Skip the start of the track"),
});

export const soundEffectSchema = z.object({
  src: mediaSrc,
  atSecond: z.number().min(0),
  volume: z.number().min(0).max(1).optional(),
});

export const audioSchema = z.object({
  music: musicSchema,
  /** Played automatically at the start of every scene change. Empty = off. */
  transitionSound: mediaSrc,
  soundEffects: z.array(soundEffectSchema),
});

export const hookSchema = z.object({
  kicker: z.string().describe("Small label above the title"),
  title: z.string().describe("Use **double asterisks** to highlight words in gold"),
  subtitle: z.string(),
  durationInSeconds: seconds(4),
});

export const ctaSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  durationInSeconds: seconds(5),
});

export const captionSchema = z.object({
  start: z.number().min(0).describe("Second the caption appears"),
  end: z.number().min(0).describe("Second the caption disappears"),
  text: z.string().describe("Use **double asterisks** to highlight words"),
});

export type AudioSettings = z.infer<typeof audioSchema>;
export type Hook = z.infer<typeof hookSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type Caption = z.infer<typeof captionSchema>;
