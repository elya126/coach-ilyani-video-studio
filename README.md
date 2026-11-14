# Coach Ilyani Video Studio

Beautiful, on-brand vertical videos for **Instagram Reels, TikTok and Facebook Reels** — built with [Remotion](https://www.remotion.dev), React and TypeScript.

- 1080 × 1920 vertical, 30 fps, 30–60 seconds
- Animated captions, highlighted text, smooth transitions, progress bar
- Background music, sound effects and b-roll support
- White, black & champagne-gold brand look with a subtle `@coachilyani` watermark
- Exports ready-to-post MP4 files

## The 6 templates

| Template | ID (for rendering) | Edit the words in | Sample length |
|---|---|---|---|
| Educational Reel | `EducationalReel` | `src/content/educational.ts` | 40 s |
| Talking Head Reel | `TalkingHeadReel` | `src/content/talkingHead.ts` | 36 s |
| Nutrition Tips (Bahasa Melayu sample) | `NutritionTips` | `src/content/nutritionTips.ts` | 36 s |
| Lifestyle Reel | `LifestyleReel` | `src/content/lifestyle.ts` | 35.5 s |
| Client Transformation | `ClientTransformation` | `src/content/transformation.ts` | 32.5 s |
| Product Education | `ProductEducation` | `src/content/productEducation.ts` | 36.5 s |
| **Coach Reel** (talking reel with timed captions, b-roll, graphics) | `Reel01-ProgramCoaching` | `src/content/reels/reel01-program-coaching.ts` | 45 s |

---

> 🇲🇾 **Panduan Bahasa Melayu untuk beginner:** [`docs/PANDUAN-LAPTOP.md`](docs/PANDUAN-LAPTOP.md)

## 1. One-time setup

You need:

1. **Node.js 18 or newer** (20 or 22 recommended) — download the "LTS" version from <https://nodejs.org>.
2. **A code editor** — [Visual Studio Code](https://code.visualstudio.com) is free and easy.
3. **FFmpeg** (optional, only for `npm run optimize` and `npm run audio:samples`):
   - Mac: `brew install ffmpeg`
   - Windows: `winget install ffmpeg`
   - Linux: `sudo apt install ffmpeg`

Then open a terminal in this folder and run:

```bash
npm install
```

That's it. (Remotion downloads its own browser for rendering the first time you render.)

## 2. Preview & edit

```bash
npm start
```

This opens **Remotion Studio** in your browser. Pick a video from the left sidebar and press play.

There are **two ways to edit**:

- **In the files (recommended):** open `src/content/<video>.ts`, change the text, save — the preview updates instantly.
- **In the Studio:** click the *Props* panel on the right to change text and timings visually. (Changes there are for previewing; copy them into the content file to keep them.)

### Highlighting words

Wrap words in double asterisks to make them champagne gold:

```ts
title: "Feeling **tired** by 3pm?",
```

### Changing scene length

Every scene has `durationInSeconds`. The total video length is calculated automatically. If a video is shorter than 30 s or longer than 60 s, a red note appears **in the preview only**.

## 3. Change the brand look — `studio.config.ts`

This one file controls every video:

| Section | What you can change |
|---|---|
| `colors` / `themes` | All brand colours, separately for light (ivory) and dark (black) videos |
| `fonts` | Heading & body fonts |
| `typography` | Text sizes |
| `watermark` | Show/hide, text, opacity, corner |
| `progressBar` | Show/hide, top/bottom, thickness |
| `animation` | Transition style (`fade`, `slide`, `wipe`, `none`), speed, bounciness, Ken Burns zoom, caption style |
| `audio` | Music & sound-effect volume, fade in/out |
| `duration` | The min/max length check (default 30–60 s) |

Each content file also chooses `theme: "light"` or `theme: "dark"`.

### Changing fonts

Fonts are bundled locally (no internet needed when rendering). To use a different Google Font, e.g. *Cormorant Garamond*:

1. `npm install @fontsource/cormorant-garamond`
2. In `src/fonts.ts`, replace the Playfair imports with `import "@fontsource/cormorant-garamond/600.css";` (etc.) and update `FONT_FACES`.
3. In `studio.config.ts`, set `heading: '"Cormorant Garamond", Georgia, serif'`.

## 4. Adding your media

Put files in the `public/` folder and refer to them **without** the word `public`:

| Media | Folder | Example in a content file |
|---|---|---|
| Background music | `public/music/` | `music: { src: "music/my-track.mp3" }` |
| Sound effects | `public/sfx/` | `{ src: "sfx/pop.mp3", atSecond: 4 }` |
| B-roll video / photos | `public/broll/` | `brollSrc: "broll/kitchen.mp4"` |
| Product & client photos | `public/images/` | `imageSrc: "images/product.png"` |
| Talking-head recordings | `public/videos/` | `videoSrc: "videos/talking-head.mp4"` |

- Leave a media path empty (`""`) to show an elegant animated gold backdrop instead. In the Studio preview the backdrop also shows a hint of which file to add (the hint never appears in exported videos).
- **Music:** the included `calm-ambient.mp3` and sound effects are simple placeholders generated with FFmpeg. Replace them with music you have the **licence** to use (e.g. from a royalty-free library). Set `src: ""` for no music.
- `transitionSound` plays a soft whoosh at each scene change — set it to `""` to turn it off.
- In the Talking Head template, music is automatically lowered under your voice.

## 5. Talking Head captions

1. Film your video vertically and save it as `public/videos/talking-head.mp4`.
2. In `src/content/talkingHead.ts` set `videoSrc` and `durationInSeconds` to match your clip.
3. Type captions with start/end seconds — or export subtitles as `.srt` from CapCut / Premiere / Descript and convert them:

```bash
npm run captions:srt -- path/to/my-video.srt
```

This creates `src/content/captions/my-video.json`. Use it in `talkingHead.ts`:

```ts
import captions from "./captions/my-video.json";
// ...
captions,
```

Caption styles (`captionStyle`): `"karaoke"` (spoken word lights up gold), `"pop"` (words pop in one by one) or `"fade"`.

## 6. Export MP4s

```bash
npm run render:educational      # one video → out/educational-reel.mp4
npm run render:all              # all six → out/
npm run optimize                # FFmpeg polish → out/social/  (needs FFmpeg)
```

Other single renders: `render:talking-head`, `render:nutrition`, `render:lifestyle`, `render:transformation`, `render:product`.

`npm run optimize` normalises loudness to −14 LUFS (the level Instagram/TikTok expect), converts to standard `yuv420p` colour and enables fast start. Upload the files from `out/social/`.

You can also render from the Studio: click **Render** in the top-right.

## 7. Make a new video from a template

1. Copy a content file, e.g. `src/content/educational.ts` → `src/content/educational-sleep.ts`, and rename the export (`educationalSleepContent`).
2. In `src/Root.tsx`, copy the matching `<Composition>` block, give it a new `id` (e.g. `"EducationalSleep"`) and set `defaultProps={educationalSleepContent}` (import it at the top).
3. Render it: `npx remotion render EducationalSleep out/educational-sleep.mp4`.

## 8. Responsible content (please read)

These templates are designed to keep your content honest:

- **No fake testimonials.** The Client Transformation template contains placeholders only. It shows a red **DRAFT** banner on the video until you set `consentConfirmed: true` — do that only after the client has given **written permission** to share their words and photos. Use their exact words.
- **No promised results.** Avoid specific weight-loss numbers or timelines as promises. Keep the "Individual results vary" disclaimer.
- **No health claims.** Don't say a product treats, cures or prevents anything. Copy product facts exactly from the label (the sample uses `[from label]` placeholders).
- **Disclaimers** are set per video in each content file (`disclaimer`). Keep them readable.

## 9. Commands

| Command | What it does |
|---|---|
| `npm start` | Open Remotion Studio (preview & edit) |
| `npm run build` | Type-check + bundle — confirms the project builds |
| `npm run typecheck` | Check for TypeScript mistakes only |
| `npm run render:all` | Render all six videos to `out/` |
| `npm run optimize` | FFmpeg social-media polish → `out/social/` |
| `npm run captions:srt -- file.srt` | Convert subtitles to captions |
| `npm run audio:samples` | Re-create the placeholder music & sound effects (FFmpeg) |
| `npx remotion still EducationalReel out/cover.png --frame=60` | Export a single frame (e.g. a cover image) |

## 10. Troubleshooting

- **"Cannot find module"** → run `npm install` again.
- **Red error about a media file** → check the file is inside `public/` and the path has no `public/` prefix and the exact same spelling/capitals.
- **Text runs off the screen** → shorten it, or reduce sizes in `studio.config.ts → typography`.
- **Video too short/long** → adjust `durationInSeconds` values in the content file.
- **Rendering is slow** → normal for the first render; try `npm run render:all -- --concurrency=2` on lower-memory computers.

## Project structure

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a file-by-file explanation.

## Licensing note

Remotion is free for individuals and small companies; larger companies need a company licence — see <https://www.remotion.dev/license>.
