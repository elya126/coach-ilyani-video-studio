/**
 * Renders every template to /out as MP4.
 *   npm run render:all
 *   npm run render:all -- EducationalReel NutritionTips   (only some)
 * Extra Remotion flags can follow after "--", e.g. --concurrency=2
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const ALL = {
  EducationalReel: "educational-reel.mp4",
  TalkingHeadReel: "talking-head-reel.mp4",
  NutritionTips: "nutrition-tips.mp4",
  LifestyleReel: "lifestyle-reel.mp4",
  ClientTransformation: "client-transformation.mp4",
  ProductEducation: "product-education.mp4",
};

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith("-"));
const flags = args.filter((a) => a.startsWith("-"));
const selected = ids.length ? ids : Object.keys(ALL);

mkdirSync("out", { recursive: true });
const failed = [];

for (const id of selected) {
  if (!ALL[id]) {
    console.error(`Unknown composition "${id}". Choose from: ${Object.keys(ALL).join(", ")}`);
    process.exit(1);
  }
  console.log(`\n▶ Rendering ${id} → out/${ALL[id]}`);
  const result = spawnSync("npx", ["remotion", "render", id, `out/${ALL[id]}`, ...flags], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) failed.push(id);
}

if (failed.length) {
  console.error(`\n✖ Failed: ${failed.join(", ")}`);
  process.exit(1);
}
console.log("\n✔ All done! Your videos are in the /out folder.");
