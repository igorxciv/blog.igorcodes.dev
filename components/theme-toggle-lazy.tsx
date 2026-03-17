"use client";

import dynamic from "next/dynamic";

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
