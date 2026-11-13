export type Theme = "light" | "dark";

// Dark is the default. The key holds "light" only while the reader has
// switched to the light theme (see hooks/useTheme.ts).
export const THEME_STORAGE_KEY = "fm-theme";
// Browser chrome matches the page ground in each theme.
export const DARK_THEME_COLOR = "#0a0a0a";
export const LIGHT_THEME_COLOR = "#f6f1e8";
