"use client";

import { useTheme } from "@/hooks/useTheme";

/**
 * Renders on the server with both labels; CSS shows the one naming the other
 * theme, so there is no hydration flash and no JS needed to stay current when
 * the system preference changes.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      <span className="theme-label-light">
        Night
        <span className="sr-only"> theme: switch to dark</span>
      </span>
      <span className="theme-label-dark">
        Day
        <span className="sr-only"> theme: switch to light</span>
      </span>
    </button>
  );
}
