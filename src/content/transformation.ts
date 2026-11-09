/**
 * CONTENT — Client Transformation
 *
 * ⚠️  READ BEFORE USING
 *  - Only use REAL client stories, with the client's WRITTEN permission
 *    for their words, photos and name.
 *  - Use the client's exact words. Do not edit, exaggerate or invent them.
 *  - Focus on habits and how the client feels — do not promise or imply
 *    that viewers will get the same results.
 *  - Set `consentConfirmed: true` only after you have written consent.
 *    Until then, a red DRAFT banner is rendered on the video.
 *
 * Everything in [square brackets] below is a PLACEHOLDER to replace.
 */
import type { TransformationProps } from "../templates/ClientTransformation";
import { defaultAudio } from "./shared";

export const transformationContent: TransformationProps = {
  theme: "light",
  consentConfirmed: false,
  intro: {
    kicker: "Client journey",
    title: "[Client first name]'s **journey**",
    subtitle: "[e.g. 12 weeks] of small, consistent habits.",
    durationInSeconds: 4,
  },
  photos: {
    beforeSrc: "", // e.g. "images/client-before.jpg"
    afterSrc: "", // e.g. "images/client-after.jpg"
    beforeLabel: "Week 1",
    afterLabel: "[Week X]",
    durationInSeconds: 6,
  },
  startingPoint: {
    title: "The **starting** point",
    items: ["[Starting habit 1, as the client described it]", "[Starting habit 2]", "[Their main goal, in their own words]"],
    durationInSeconds: 6,
  },
  habits: {
    title: "Habits we **built** together",
    items: ["[Habit 1 — e.g. a balanced breakfast]", "[Habit 2]", "[Habit 3]"],
    durationInSeconds: 7,
  },
  clientWords: {
    quote: "[Paste your client's own words here — exactly as they wrote them, with their written permission.]",
    attribution: "— [Client first name], shared with permission",
    durationInSeconds: 7,
  },
  cta: {
    title: "Ready to build **your** habits?",
    subtitle: "Everyone's journey is different. Let's find what works for you.",
    buttonText: "DM @coachilyani",
    durationInSeconds: 5,
  },
  disclaimer:
    "Shared with the client's written permission. Individual results vary and depend on many factors. Not a guarantee of results.",
  audio: { ...defaultAudio, soundEffects: [{ src: "sfx/chime.mp3", atSecond: 4 }] },
};
