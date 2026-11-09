/**
 * remotion.config.ts — RENDER settings (rarely needs editing).
 * Brand, colours, fonts and animation live in `studio.config.ts` instead.
 * Docs: https://www.remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

// H.264 MP4 + AAC audio: the most compatible format for Instagram, TikTok and Facebook.
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
// Lower CRF = higher quality / larger file. 18 is visually lossless for social media.
Config.setCrf(18);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
