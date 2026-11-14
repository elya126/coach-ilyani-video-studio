/**
 * ============================================================
 *  COACH ILYANI VIDEO STUDIO — MAIN EDITING FILE
 * ============================================================
 *  This is the ONE file you edit to change the look and feel of
 *  EVERY video: colours, fonts, text sizes, watermark, progress
 *  bar, animation speed, transitions and audio levels.
 *
 *  To change the WORDS of a video, edit the matching file in
 *  `src/content/` instead (e.g. `src/content/educational.ts`).
 *
 *  Tip: save the file while `npm start` is running and the
 *  preview updates instantly.
 * ============================================================
 */

export const studioConfig = {
  // ----------------------------------------------------------
  // BRAND
  // ----------------------------------------------------------
  brand: {
    name: "Coach Ilyani",
    handle: "@coachilyani",
    tagline: "Wellness Coach",
  },

  // ----------------------------------------------------------
  // COLOURS — white, black and champagne gold
  // Use any CSS colour: "#C9A96E", "rgb(201,169,110)", "white"...
  // ----------------------------------------------------------
  colors: {
    white: "#FFFFFF",
    ivory: "#FAF7F2", // warm off-white background
    sand: "#F1EADF", // light card colour
    black: "#0E0E0E",
    charcoal: "#1B1A18", // dark card colour
    gold: "#C9A96E", // champagne gold (main accent)
    goldLight: "#E7D5AE",
    goldDeep: "#A8864A", // darker gold for text on light backgrounds
    grey: "#7D776D",
  },

  // Each video chooses "light" or "dark" in its content file.
  themes: {
    light: {
      background: "#FAF7F2",
      surface: "#FFFFFF",
      text: "#0E0E0E",
      mutedText: "#5E594F",
      accent: "#A8864A",
      accentSoft: "#E7D5AE",
      glow: "rgba(201, 169, 110, 0.30)",
    },
    dark: {
      background: "#0E0E0E",
      surface: "#1B1A18",
      text: "#FFFFFF",
      mutedText: "#B9B2A5",
      accent: "#C9A96E",
      accentSoft: "#5A4A2C",
      glow: "rgba(201, 169, 110, 0.22)",
    },
  },

  // ----------------------------------------------------------
  // FONTS — bundled locally, so rendering works offline.
  // To swap fonts, see "Changing fonts" in README.md.
  // ----------------------------------------------------------
  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
  },

  // Text sizes in pixels (the video is 1080 px wide).
  typography: {
    title: 104, // big hook titles
    heading: 76, // scene headings
    body: 44, // paragraphs
    caption: 60, // talking-head captions
    small: 30, // labels, disclaimers
    kicker: 28, // small uppercase label above titles
  },

  // ----------------------------------------------------------
  // WATERMARK — subtle handle in the corner
  // ----------------------------------------------------------
  watermark: {
    show: true,
    text: "@coachilyani",
    opacity: 0.55,
    position: "bottom-left" as "bottom-left" | "bottom-right" | "top-left" | "top-right",
  },

  // ----------------------------------------------------------
  // PROGRESS BAR
  // ----------------------------------------------------------
  progressBar: {
    show: true,
    position: "top" as "top" | "bottom",
    height: 8,
  },

  // ----------------------------------------------------------
  // ANIMATION
  // ----------------------------------------------------------
  animation: {
    // Transition between scenes: "fade" | "slide" | "wipe" | "none"
    transition: "fade" as "fade" | "slide" | "wipe" | "none",
    transitionSeconds: 0.5,
    // Seconds between each word appearing in titles (lower = faster)
    wordStagger: 0.06,
    // Spring "bounciness": higher damping = calmer, more premium motion
    springDamping: 200,
    // Gentle slow zoom on photos / b-roll (1 = off, 1.08 = subtle)
    kenBurnsZoom: 1.08,
    // Caption style for talking-head videos: "pop" | "karaoke" | "fade"
    captionStyle: "karaoke" as "pop" | "karaoke" | "fade",
  },

  // ----------------------------------------------------------
  // REEL CAPTIONS (used by the "Coach Reel" talking template)
  // ----------------------------------------------------------
  reelCaptions: {
    wordsPerLine: 4, // 3–4 words on screen at a time
    size: 58,
    activeColor: "#C9A96E", // the word being spoken lights up gold
    textColor: "#FFFFFF",
    keywordColor: "#FFFFFF", // **keywords**: white, bigger, with a small bounce
    keywordScale: 1.3,
    bottom: 430, // distance from the bottom of the video (px)
  },

  // ----------------------------------------------------------
  // AUDIO (0 = silent, 1 = full volume)
  // ----------------------------------------------------------
  audio: {
    musicVolume: 0.3,
    soundEffectVolume: 0.6,
    musicFadeInSeconds: 1,
    musicFadeOutSeconds: 2,
  },

  // ----------------------------------------------------------
  // VIDEO LENGTH CHECK (seconds). The Studio preview shows a
  // warning if a video is shorter or longer than this.
  // ----------------------------------------------------------
  duration: {
    min: 30,
    max: 60,
  },
};

export type StudioConfig = typeof studioConfig;
export type ThemeName = keyof typeof studioConfig.themes;
