/**
 * CONTENT — Talking Head Reel
 * 1. Put your filmed clip in public/videos/ (e.g. talking-head.mp4)
 * 2. Set `videoSrc` and `durationInSeconds` to match your clip.
 * 3. Type your captions with start/end times in seconds.
 *    (Tip: export an .srt from CapCut and run `node scripts/srt-to-captions.mjs file.srt`)
 */
import type { TalkingHeadProps } from "../templates/TalkingHeadReel";
import { defaultAudio, followCta } from "./shared";

export const talkingHeadContent: TalkingHeadProps = {
  theme: "light", // used for the end card
  videoSrc: "", // e.g. "videos/talking-head.mp4" — empty shows a placeholder
  durationInSeconds: 36,
  hook: { text: "The **3 habits** I start with", durationInSeconds: 3.5 },
  speaker: { name: "Coach Ilyani", title: "Wellness Coach" },
  captionStyle: "karaoke",
  captions: [
    { start: 0.3, end: 3.4, text: "When a client starts with me" },
    { start: 3.4, end: 6.6, text: "we don't change **everything** at once." },
    { start: 6.6, end: 9.8, text: "We start with three **simple** habits." },
    { start: 9.8, end: 13.2, text: "One: a **balanced breakfast** most mornings." },
    { start: 13.2, end: 16.6, text: "Something with protein, so you're not running on empty." },
    { start: 16.6, end: 20.0, text: "Two: **water first**, before your coffee." },
    { start: 20.0, end: 23.4, text: "Three: **move** a little every day." },
    { start: 23.4, end: 26.8, text: "A walk after dinner counts." },
    { start: 26.8, end: 30.6, text: "Small, **consistent** steps are easier to keep." },
  ],
  cta: { ...followCta, title: "Which habit will you **start**?", durationInSeconds: 5 },
  disclaimer: "",
  // Music is automatically lowered (ducked) under your voice in this template.
  audio: { ...defaultAudio, transitionSound: "" },
};
