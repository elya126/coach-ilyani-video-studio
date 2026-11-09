import { studioConfig, type ThemeName } from "../../studio.config";

export type Theme = (typeof studioConfig.themes)[ThemeName] & { name: ThemeName };

/** Returns the colour set for "light" or "dark" videos. */
export const getTheme = (name: ThemeName): Theme => ({
  ...studioConfig.themes[name],
  name,
});

export const fonts = studioConfig.fonts;
export const type = studioConfig.typography;
export const colors = studioConfig.colors;
