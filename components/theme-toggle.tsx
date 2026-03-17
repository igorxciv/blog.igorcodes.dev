"use client";

import { useEffect, useId, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

const THEME_TRANSITION_ATTRIBUTE = "data-theme-transition";
const THEME_TRANSITION_DURATION_MS = 320;

let themeTransitionTimeout: number | null = null;

function readStoredTheme(): Theme | null {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function updateThemeColorMeta(theme: Theme) {
  const content = theme === "light" ? LIGHT_THEME_COLOR : DARK_THEME_COLOR;
  const meta = document.querySelector('meta[name="theme-color"]');

  if (meta) {
    meta.setAttribute("content", content);
    return;
  }

  const createdMeta = document.createElement("meta");
  createdMeta.setAttribute("name", "theme-color");
  createdMeta.setAttribute("content", content);
  document.head.appendChild(createdMeta);
}

function setThemeTransition(animate: boolean) {
  const root = document.documentElement;

  if (!animate) {
    root.removeAttribute(THEME_TRANSITION_ATTRIBUTE);

    if (themeTransitionTimeout !== null) {
      window.clearTimeout(themeTransitionTimeout);
      themeTransitionTimeout = null;
    }

    return;
  }

  root.setAttribute(THEME_TRANSITION_ATTRIBUTE, "true");

  if (themeTransitionTimeout !== null) {
    window.clearTimeout(themeTransitionTimeout);
  }

  themeTransitionTimeout = window.setTimeout(() => {
    root.removeAttribute(THEME_TRANSITION_ATTRIBUTE);
    themeTransitionTimeout = null;
  }, THEME_TRANSITION_DURATION_MS);
}

function applyTheme(theme: Theme, animate = false) {
  const root = document.documentElement;
  setThemeTransition(animate);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  updateThemeColorMeta(theme);
}

function getInitialTheme(): Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light"
    ? "light"
    : readStoredTheme() ?? getSystemTheme();
}

export function ThemeToggle() {
  const labelId = useId();
  const descriptionId = useId();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

    const handleChange = () => {
      if (readStoredTheme()) {
        return;
      }

      const nextTheme = mediaQuery.matches ? "light" : "dark";
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  function toggleTheme() {
    const currentTheme =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme, true);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  const isDarkTheme = theme === "dark";

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
