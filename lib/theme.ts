export type Theme = "light" | "dark";

// Stored only when the reader overrides their system preference; absent means
// "follow the system" (see hooks/useTheme.ts).
export const THEME_STORAGE_KEY = "fm-theme";
// Browser chrome takes the colour of the book-cloth band at the top of every
// page, in each theme.
export const LIGHT_THEME_COLOR = "#203a2f";
export const DARK_THEME_COLOR = "#0f1a15";
