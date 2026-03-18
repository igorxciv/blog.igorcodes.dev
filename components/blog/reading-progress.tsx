"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

export function ReadingProgress() {
  const barRef = useReadingProgress<HTMLDivElement>();

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-px bg-white/5">
      <div
        ref={barRef}
        className="h-full origin-left bg-(--accent) transition-[transform] duration-150 ease-out will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
