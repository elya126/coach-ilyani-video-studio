/**
 * Converts an .srt subtitle file (from CapCut, Premiere, Descript, Whisper…)
 * into the caption format used by the Talking Head template.
 *
 *   node scripts/srt-to-captions.mjs my-video.srt
 *   → writes src/content/captions/my-video.json
 *
 * Then in src/content/talkingHead.ts:
 *   import captions from "./captions/my-video.json";
 *   ...  captions,
 * Add **double asterisks** around words in the JSON to highlight them.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/srt-to-captions.mjs <file.srt>");
  process.exit(1);
}

const toSeconds = (t) => {
  const [h, m, rest] = t.trim().split(":");
  const [s, ms] = rest.split(/[,.]/);
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
};

const blocks = readFileSync(file, "utf8").replace(/\r/g, "").split(/\n\s*\n/);
const captions = [];
for (const block of blocks) {
  const lines = block.trim().split("\n");
  const timeLine = lines.find((l) => l.includes("-->"));
  if (!timeLine) continue;
  const [start, end] = timeLine.split("-->").map(toSeconds);
  const text = lines.slice(lines.indexOf(timeLine) + 1).join(" ").replace(/<[^>]+>/g, "").trim();
  if (text) captions.push({ start: Math.round(start * 100) / 100, end: Math.round(end * 100) / 100, text });
}

const outDir = join("src", "content", "captions");
mkdirSync(outDir, { recursive: true });
const out = join(outDir, basename(file).replace(/\.srt$/i, "") + ".json");
writeFileSync(out, JSON.stringify(captions, null, 2) + "\n");
console.log(`✔ ${captions.length} captions written to ${out}`);
