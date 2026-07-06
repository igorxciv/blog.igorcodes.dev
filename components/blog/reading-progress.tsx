"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

type ReadingProgressProps = {
  targetId: string;
};

export function ReadingProgress({ targetId }: ReadingProgressProps) {
  const barRef = useReadingProgress<HTMLDivElement>(targetId);

  // Purely decorative reading indicator — hidden from assistive tech.
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-px bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-(--accent) will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
