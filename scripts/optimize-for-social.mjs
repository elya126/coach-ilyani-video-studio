/**
 * Final polish with FFmpeg before uploading to Instagram / TikTok / Facebook:
 *  - loudness normalised to -14 LUFS (the level social apps expect)
 *  - standard yuv420p colour (best compatibility)
 *  - "faststart" so the video begins playing immediately
 *
 *   npm run optimize -- out/educational-reel.mp4
 *   npm run optimize            (optimises every MP4 in /out)
 * Output: out/social/<name>.mp4   — Requires FFmpeg installed (see README).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

const check = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
if (check.error || check.status !== 0) {
  console.error("FFmpeg was not found. Install it first (see README → Installing FFmpeg).");
  process.exit(1);
}

let inputs = process.argv.slice(2);
if (!inputs.length) {
  if (!existsSync("out")) {
    console.error("No /out folder yet. Render a video first: npm run render:all");
    process.exit(1);
  }
  inputs = readdirSync("out").filter((f) => f.endsWith(".mp4")).map((f) => join("out", f));
}

mkdirSync(join("out", "social"), { recursive: true });

for (const input of inputs) {
  const output = join("out", "social", basename(input));
  console.log(`▶ ${input} → ${output}`);
  const r = spawnSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error", "-i", input,
      "-c:v", "libx264", "-preset", "slow", "-crf", "18",
      "-pix_fmt", "yuv420p", "-color_range", "tv", "-r", "30",
      "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
      "-movflags", "+faststart",
      output,
    ],
    { stdio: "inherit" },
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log("✔ Ready to upload: out/social/");
