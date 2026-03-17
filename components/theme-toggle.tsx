"use client";

import { useId } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const labelId = useId();
  const descriptionId = useId();
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-wrap">
      <span id={labelId} className="sr-only">
        Dark theme
      </span>
      <span id={descriptionId} className="sr-only">
        Switch between light and dark color themes.
      </span>
      <button
        type="button"
        role="switch"
        aria-labelledby={labelId}
        aria-checked={isDarkTheme}
        aria-describedby={descriptionId}
        className="theme-toggle"
        suppressHydrationWarning
        onClick={toggleTheme}
      >
        <span aria-hidden="true" className="theme-toggle-icon theme-toggle-icon-sun">
          <Sun className="size-6" strokeWidth={2.1} />
        </span>
        <span aria-hidden="true" className="theme-toggle-icon theme-toggle-icon-moon">
          <Moon className="size-6" strokeWidth={2.1} />
        </span>
      </button>
    </div>
  );
}
