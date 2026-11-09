import React, { createContext, useContext } from "react";
import { getTheme, type Theme } from "../config/theme";
import type { ThemeName } from "../../studio.config";

const ThemeCtx = createContext<Theme>(getTheme("light"));

/** Wrap a video in this so every component knows if it is light or dark. */
export const ThemeProvider: React.FC<{ theme: ThemeName; children: React.ReactNode }> = ({ theme, children }) => (
  <ThemeCtx.Provider value={getTheme(theme)}>{children}</ThemeCtx.Provider>
);

export const useTheme = (): Theme => useContext(ThemeCtx);
