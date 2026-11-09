import { staticFile } from "remotion";

/**
 * Turns a path from a content file into a playable URL.
 *  - "broll/kitchen.mp4"            → file inside the /public folder
 *  - "https://example.com/clip.mp4" → used as-is
 *  - ""                             → no media (a placeholder is shown)
 */
export const resolveMedia = (src: string | undefined): string | null => {
  if (!src || !src.trim()) return null;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  return staticFile(src.replace(/^\/?public\//, "").replace(/^\//, ""));
};

const VIDEO_EXT = /\.(mp4|mov|webm|m4v|mkv)(\?.*)?$/i;

export const isVideoFile = (src: string): boolean => VIDEO_EXT.test(src);
