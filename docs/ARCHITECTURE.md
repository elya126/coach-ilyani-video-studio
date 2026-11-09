# Project architecture

This page explains every folder and file in **Coach Ilyani Video Studio**, and how they fit together.

## The big picture

```
 studio.config.ts         src/content/*.ts            public/
 (look & feel)            (words, timings, media)     (music, sfx, b-roll, photos)
        │                          │                          │
        └────────────┬─────────────┘                          │
                     ▼                                        │
            src/templates/*.tsx  ◄── built from ──  src/components/*.tsx
            (6 video layouts)                       (reusable building blocks)
                     │                                        │
                     ▼                                        │
               src/Root.tsx  ── registers each template ──────┘
                     │
                     ▼
     Remotion Studio (preview)  →  npm run render  →  out/*.mp4  →  npm run optimize  →  out/social/*.mp4
```

There are three layers, so you only have to touch the part you care about:

| Layer | What it controls | Who edits it |
|---|---|---|
| `studio.config.ts` | Colours, fonts, text sizes, watermark, progress bar, transitions, audio levels | You, once in a while |
| `src/content/*.ts` | The words, durations, music and media of each video | You, for every new video |
| `src/templates/` + `src/components/` | How things look and move | A developer (or you, when you're ready) |

## Folder tree

```
coach-ilyani-video-studio/
├── studio.config.ts          ← MAIN EDITING FILE (brand, colours, fonts, animation, audio)
├── remotion.config.ts        ← render settings (codec, quality) — rarely changed
├── package.json              ← dependencies + npm commands
├── tsconfig.json             ← TypeScript settings
├── README.md                 ← setup & how-to guide
├── docs/ARCHITECTURE.md      ← this file
│
├── public/                   ← your media files (referenced by path, e.g. "broll/walk.mp4")
│   ├── music/                ← background music (calm-ambient.mp3 = generated placeholder)
│   ├── sfx/                  ← sound effects (whoosh, pop, chime — generated placeholders)
│   ├── broll/                ← b-roll clips and lifestyle footage
│   ├── images/               ← photos (product shots, consented client photos)
│   └── videos/               ← talking-head recordings
│
├── scripts/
│   ├── render-all.mjs        ← renders every template to out/*.mp4
│   ├── optimize-for-social.mjs ← FFmpeg polish: -14 LUFS loudness, yuv420p, faststart
│   ├── srt-to-captions.mjs   ← converts .srt subtitles into caption data
│   └── generate-sample-audio.sh ← re-creates the placeholder music & sfx with FFmpeg
│
└── src/
    ├── index.ts              ← Remotion entry point (registerRoot)
    ├── Root.tsx              ← lists all 6 compositions (videos) for the Studio
    ├── fonts.ts              ← loads Playfair Display + Montserrat locally
    │
    ├── config/
    │   ├── video.ts          ← 1080×1920, 30 fps, social-media safe area
    │   └── theme.ts          ← turns studio.config.ts into light/dark themes
    │
    ├── lib/                  ← small helpers (no visuals)
    │   ├── schemas.ts        ← shared editable-prop definitions (hook, CTA, audio, captions)
    │   ├── timing.ts         ← seconds→frames, total length incl. transitions
    │   ├── animation.ts      ← spring "enter", rise, exit helpers
    │   ├── text.ts           ← **highlight** parsing and word splitting
    │   └── media.ts          ← resolves media paths, detects video vs image
    │
    ├── components/           ← reusable building blocks
    │   ├── VideoShell.tsx    ← wraps every video: theme, background, audio, watermark, progress bar
    │   ├── SceneSeries.tsx   ← plays scenes in order with smooth transitions
    │   ├── BrandBackground.tsx ← ivory/black background with drifting champagne glow + frame line
    │   ├── AnimatedTitle.tsx ← serif title, words rise in one by one
    │   ├── BodyText.tsx      ← paragraph text with fade/rise
    │   ├── HighlightText.tsx ← **gold** words with sweeping underline
    │   ├── AnimatedCaptions.tsx ← pop / karaoke / fade captions for talking-head videos
    │   ├── Kicker.tsx        ← small uppercase label with gold line
    │   ├── GoldDivider.tsx   ← self-drawing gold divider
    │   ├── NumberBadge.tsx   ← "01 / 04" circular step numbers
    │   ├── MediaFrame.tsx    ← b-roll / photo / video slot with Ken Burns + placeholder
    │   ├── HookScene.tsx     ← the scroll-stopping opening scene
    │   ├── CallToAction.tsx  ← end card with gold button and handle
    │   ├── Disclaimer.tsx    ← small honest disclaimer line
    │   ├── ProgressBar.tsx   ← thin gold playback progress bar
    │   ├── Watermark.tsx     ← subtle @coachilyani
    │   ├── AudioLayer.tsx    ← music (loop, fade, ducking), transition sounds, sound effects
    │   ├── StudioNotices.tsx ← preview-only length warning; DRAFT consent banner
    │   ├── SafeArea.tsx      ← keeps content clear of app buttons
    │   ├── ThemeContext.tsx  ← shares light/dark colours with all components
    │   ├── Icons.tsx         ← check, cross, arrow, sparkle, bookmark, quote icons
    │   └── index.ts          ← exports everything above
    │
    ├── templates/            ← the 6 video layouts
    │   ├── EducationalReel.tsx      ← hook → numbered points → recap → CTA
    │   ├── TalkingHeadReel.tsx      ← your clip + captions + hook + name tag + CTA
    │   ├── NutritionTips.tsx        ← "instead of → try" swap cards
    │   ├── LifestyleReel.tsx        ← b-roll montage + quote card
    │   ├── ClientTransformation.tsx ← consent-first client story
    │   └── ProductEducation.tsx     ← what it is, how to use, label facts, good to know
    │
    └── content/              ← THE WORDS of each video (sample content included)
        ├── shared.ts         ← default audio, follow CTA, general disclaimer
        ├── educational.ts
        ├── talkingHead.ts
        ├── nutritionTips.ts  ← sample in Bahasa Melayu
        ├── lifestyle.ts
        ├── transformation.ts ← placeholders only — needs a real, consented story
        └── productEducation.ts ← placeholders for label values
```

## How a template works

Each template file follows the same four-part pattern:

1. **Schema** (`educationalSchema`) — describes the editable props with `zod`. Remotion Studio reads it and shows an editing panel.
2. **Scene list** — a function lists each scene's duration. `calculateMetadata` adds them up (minus transition overlaps) so the video length always matches the content.
3. **Scenes** — small components built from `src/components`.
4. **Template component** — wraps the scenes in `<VideoShell>` (background, audio, watermark, progress bar) and `<SceneSeries>` (transitions).

## Responsible-content safeguards

- **Client Transformation** renders a red *DRAFT · CLIENT CONSENT NOT CONFIRMED* banner until `consentConfirmed: true` is set, and always shows a "results vary" disclaimer. Sample content uses placeholders, not invented stories.
- **Product Education** sample uses `[from label]` placeholders and includes a standard "not intended to diagnose, treat, cure or prevent any disease" disclaimer.
- Sample copy talks about habits, not promised outcomes or weight-loss numbers.
- A preview-only warning appears when a video is shorter than 30 s or longer than 60 s.
