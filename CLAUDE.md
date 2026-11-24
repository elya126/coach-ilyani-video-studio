# Coach Ilyani Video Studio — memory for Claude

Coach Ilyani is a wellness coach making short vertical reels in Bahasa Melayu.
Topics: weight loss, healthy eating, body health, healthy ageing, energy & stamina.
Keep claims general and safe (no medical/cure claims).

## Video tool: HyperFrames (HeyGen, open source — HTML → MP4)

- Requirements: Node.js 22+ and FFmpeg (both present in the cloud container).
- New project (vertical reel, 1080x1920):
  `npx hyperframes init <name> --example blank --resolution portrait --non-interactive`
- Inside a project: `npm run check` (lint/safe-zone/contrast), `npx hyperframes snapshot --at 1,3,5`,
  `npm run render` (or `npx hyperframes render -o renders/<name>.mp4`).
- AI skills: `npx skills add heygen-com/hyperframes` (choose Core Skills) or `npx hyperframes skills update`.
  Claude Code plugin: `claude plugin marketplace add heygen-com/hyperframes` then
  `claude plugin install hyperframes@hyperframes`. Skills install into `~/.agents/skills`, which is
  NOT kept between cloud sessions — re-run `npx hyperframes skills update` in a new session.
- Each project folder has its own CLAUDE.md with the HyperFrames render rules — read it before editing.

## House style (from first reel)

- Palette: deep green `#0f3d2e`, light green `#a8d5ba`, cream `#fdf8ef`, gold accent `#f4b63f`.
- Fonts: Montserrat (headlines, 800–900), Poppins (body).
- Structure (15 s): hook on frame 0 (3 s) → 3 numbered tips (3 s each) → CTA "Komen \"KATA\"" + "Coach Ilyani".
- Keep all text inside the Reels/TikTok safe zone: x 130–770 px, y 300–1240 px.

## Projects

- `reel-tenaga-petang/` — "3 tips tenaga waktu petang" (15 s, silent). Render: `renders/reel-tenaga-petang.mp4`.
