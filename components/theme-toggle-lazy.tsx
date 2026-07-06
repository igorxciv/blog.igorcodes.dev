"use client";

import dynamic from "next/dynamic";

// Known trade-off (intentionally not reworked here): the toggle is loaded with
// `ssr: false`, so the real control does not exist until hydration (a
// placeholder renders server-side). Additionally, a single manual toggle
// permanently stops the OS-preference listener in `hooks/useTheme.ts` — once
// the user picks a theme, later system light/dark changes are ignored. A full
// SSR + three-state (light/system/dark) rework is deferred as out of scope.
const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <div className="theme-toggle-wrap" aria-hidden="true">
        <span className="theme-toggle theme-toggle-placeholder" />
      </div>
    ),
  },
);

export function ThemeToggleLazy() {
  return <ThemeToggle />;
}
