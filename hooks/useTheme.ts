"use client";

import { useCallback, useEffect } from "react";
import {
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";
import { THEME_SWITCH } from "@/lib/view-transitions";

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

export type RevealOrigin = { x: number; y: number };

function canRevealTheme(): boolean {
  return (
    typeof document.startViewTransition === "function" &&
    // Transition types scope the reveal CSS to theme switches only.
    typeof ViewTransition !== "undefined" &&
    "types" in ViewTransition.prototype &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Applies the theme inside a view transition: the new theme grows as a circle
 * from `origin` (the toggle) until it covers the viewport. Without the API, or
 * under reduced motion, the colours cross-fade through the body's existing
 * colour transition instead.
 */
function applyWithReveal(theme: Theme, origin?: RevealOrigin) {
  if (!origin || !canRevealTheme()) {
    apply(theme);
    return;
  }
  const root = document.documentElement;
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
  root.style.setProperty("--reveal-x", `${origin.x}px`);
  root.style.setProperty("--reveal-y", `${origin.y}px`);
  root.style.setProperty("--reveal-r", `${radius}px`);
  document.startViewTransition({
    update: () => apply(theme),
    types: [THEME_SWITCH],
  });
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

  const toggleTheme = useCallback((origin?: RevealOrigin) => {
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
    applyWithReveal(target, origin);
  }, []);

  return { toggleTheme };
}
