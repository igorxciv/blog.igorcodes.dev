"use client";

import { useCallback, useEffect } from "react";
import {
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute(
      "content",
      theme === "light" ? LIGHT_THEME_COLOR : DARK_THEME_COLOR,
    );
  }
}

/**
 * Dark by default; switching to light is remembered on this device. Other
 * open tabs follow the change through the storage event.
 */
export function useTheme() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        apply(event.newValue === "light" ? "light" : "dark");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const target: Theme = currentTheme() === "dark" ? "light" : "dark";
    try {
      if (target === "light") {
        window.localStorage.setItem(THEME_STORAGE_KEY, "light");
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch {
      // Storage blocked: still apply for this page view.
    }
    apply(target);
  }, []);

  return { toggleTheme };
}
