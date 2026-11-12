"use client";

import { useCallback, useEffect } from "react";
import {
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

const systemQuery = "(prefers-color-scheme: dark)";

function systemTheme(): Theme {
  return window.matchMedia(systemQuery).matches ? "dark" : "light";
}

function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function renderedTheme(): Theme {
  const pinned = document.documentElement.dataset.theme;
  return pinned === "light" || pinned === "dark" ? pinned : systemTheme();
}

function apply(override: Theme | null) {
  const root = document.documentElement;
  if (override) {
    root.dataset.theme = override;
  } else {
    delete root.dataset.theme;
  }
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  for (const meta of metas) {
    const media = meta.getAttribute("media") ?? "";
    const forDark = media.includes("dark");
    const theme = override ?? (forDark ? "dark" : "light");
    meta.setAttribute(
      "content",
      theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR,
    );
  }
}

/**
 * Two-state theme toggle over three stored states: no value follows the
 * system; "light" or "dark" pins an override. Toggling to the scheme the system
 * already uses clears the override instead of pinning it.
 */
export function useTheme() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        apply(storedTheme());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const target: Theme = renderedTheme() === "dark" ? "light" : "dark";
    const override = target === systemTheme() ? null : target;
    try {
      if (override) {
        window.localStorage.setItem(THEME_STORAGE_KEY, override);
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch {
      // Storage blocked: still apply for this page view.
    }
    apply(override);
  }, []);

  return { toggleTheme };
}
