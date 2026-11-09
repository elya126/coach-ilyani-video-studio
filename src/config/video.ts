/**
 * Fixed technical settings shared by every template.
 * Vertical 9:16 Full HD at 30 frames per second.
 */
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/**
 * "Safe area" — space kept clear of the app interface
 * (username, caption, like/comment buttons) on Reels & TikTok.
 */
export const SAFE_AREA = {
  top: 210,
  bottom: 380,
  left: 84,
  right: 130,
} as const;
