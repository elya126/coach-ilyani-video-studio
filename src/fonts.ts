/**
 * Loads the brand fonts from local npm packages (no internet needed while
 * rendering) and pauses rendering until they are ready, so the first frames
 * never show a fallback font.
 */
import { continueRender, delayRender } from "remotion";

import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";

const FONT_FACES = [
  '400 1em "Playfair Display"',
  'italic 400 1em "Playfair Display"',
  '600 1em "Playfair Display"',
  '700 1em "Playfair Display"',
  '300 1em "Montserrat"',
  '400 1em "Montserrat"',
  '500 1em "Montserrat"',
  '600 1em "Montserrat"',
  '700 1em "Montserrat"',
  '800 1em "Montserrat"',
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading brand fonts");
  Promise.all(FONT_FACES.map((face) => document.fonts.load(face)))
    .catch((err) => console.warn("Font loading issue:", err))
    .finally(() => continueRender(handle));
}
