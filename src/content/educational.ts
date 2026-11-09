/**
 * CONTENT — Educational Reel
 * Change the words, durations and media below. Save to preview.
 * **double asterisks** = gold highlight.
 * Target: 30–60 seconds total (the preview warns you if not).
 */
import type { EducationalProps } from "../templates/EducationalReel";
import { defaultAudio, followCta, generalDisclaimer } from "./shared";

export const educationalContent: EducationalProps = {
  theme: "light",
  hook: {
    kicker: "Energy & stamina",
    title: "Feeling **tired** by 3pm?",
    subtitle: "4 everyday habits worth checking first.",
    durationInSeconds: 4,
  },
  points: [
    {
      heading: "Rushing past breakfast",
      body: "A balanced breakfast with **protein** and fibre can help you feel fuller through the morning.",
      brollSrc: "", // e.g. "broll/breakfast.mp4"
      durationInSeconds: 7,
    },
    {
      heading: "Forgetting to drink water",
      body: "Keep a **water bottle** within reach and sip through the day — it's an easy habit to build.",
      brollSrc: "",
      durationInSeconds: 7,
    },
    {
      heading: "Sitting for hours",
      body: "Try a **5-minute walk** or stretch every hour. Small movement adds up.",
      brollSrc: "",
      durationInSeconds: 7,
    },
    {
      heading: "Late, short nights",
      body: "A regular **wind-down routine** makes it easier to get to bed on time.",
      brollSrc: "",
      durationInSeconds: 7,
    },
  ],
  recap: {
    title: "Start with **one** habit",
    items: ["Balanced breakfast", "Water within reach", "Move every hour", "Consistent bedtime"],
    durationInSeconds: 6,
  },
  cta: followCta,
  disclaimer: generalDisclaimer,
  audio: { ...defaultAudio, soundEffects: [{ src: "sfx/chime.mp3", atSecond: 35 }] },
};
