// Pakai: node render.js <folder-video> [stills]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2]); const stills = process.argv[3] === 'stills';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + dir + '/video.html'); await p.waitForTimeout(500);
  const DUR = await p.evaluate(() => window.DUR);
  if (stills) {
    for (const t of [0.6, 3.5, 7.5, 11.8, 15.5, 18.5, 22]) {
      await p.evaluate(t => render(t), t); await p.screenshot({ path: `${process.env.OUT}/still-${t}.png` });
    }
  } else {
    const fps = 30, n = Math.round(DUR * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', dir + '/senyap.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => render(t), i / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
