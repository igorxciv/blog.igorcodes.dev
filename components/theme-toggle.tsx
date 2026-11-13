"use client";

import { useTheme } from "@/hooks/useTheme";

/**
 * One button with both icons. CSS shows the icon and label for the theme
 * you would switch to, so the server render is already right and nothing flashes.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      <svg
        className="theme-icon theme-icon-sun"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
      <svg
        className="theme-icon theme-icon-moon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
      {/* Only the label for the current theme is displayed, so only it names the button. */}
      <span className="sr-only theme-when-dark">Switch to light theme</span>
      <span className="sr-only theme-when-light">Switch to dark theme</span>
    </button>
  );
}
