/**
 * CONTENT — Lifestyle Reel
 * Add your own clips/photos to public/broll/ and set each `src`.
 * Empty `src` shows an animated gold backdrop instead.
 */
import type { LifestyleProps } from "../templates/LifestyleReel";
import { defaultAudio } from "./shared";

export const lifestyleContent: LifestyleProps = {
  theme: "dark",
  intro: {
    kicker: "A slow morning",
    title: "My **intentional** morning routine",
    subtitle: "Simple habits that set the tone for my day.",
    backgroundSrc: "", // e.g. "broll/sunrise.mp4"
    durationInSeconds: 4,
  },
  clips: [
    {
      src: "",
      time: "5:45 AM",
      caption: "Subuh & **stillness**",
      subcaption: "A few quiet minutes before the day begins.",
      durationInSeconds: 5,
    },
    {
      src: "",
      time: "6:15 AM",
      caption: "Water **first**",
      subcaption: "A full glass before anything else.",
      durationInSeconds: 5,
    },
    {
      src: "",
      time: "6:30 AM",
      caption: "Gentle **movement**",
      subcaption: "A short walk or stretch — nothing extreme.",
      durationInSeconds: 5,
    },
    {
      src: "",
      time: "7:00 AM",
      caption: "A **balanced** breakfast",
      subcaption: "Protein, fibre and something I enjoy.",
      durationInSeconds: 5,
    },
    {
      src: "",
      time: "7:30 AM",
      caption: "Plan with **intention**",
      subcaption: "Three priorities. That's it.",
      durationInSeconds: 5,
    },
  ],
  quote: {
    text: "Small habits, repeated with **intention**.",
    author: "— Coach Ilyani",
    durationInSeconds: 5,
  },
  cta: {
    title: "What's **your** morning habit?",
    subtitle: "Tell me in the comments.",
    buttonText: "Follow @coachilyani",
    durationInSeconds: 5,
  },
  audio: defaultAudio,
};
