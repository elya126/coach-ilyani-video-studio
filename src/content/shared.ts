/**
 * Settings reused by several videos. Change once, applies everywhere
 * that imports them.
 */
import type { AudioSettings, Cta } from "../lib/schemas";

/** Default audio: placeholder ambient track + soft whoosh between scenes. */
export const defaultAudio: AudioSettings = {
  music: { src: "music/calm-ambient.mp3" }, // replace with your licensed track, or "" for none
  transitionSound: "sfx/whoosh.mp3", // "" to turn off
  soundEffects: [],
};

export const followCta: Cta = {
  title: "Save this for **later**",
  subtitle: "Follow for simple, realistic wellness habits for busy women.",
  buttonText: "Follow @coachilyani",
  durationInSeconds: 5,
};

/** Honest, general disclaimer for education videos. */
export const generalDisclaimer =
  "General wellness information only — not medical advice. Speak to your doctor about your personal needs.";
