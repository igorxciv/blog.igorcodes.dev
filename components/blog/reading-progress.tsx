"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const barElement = barRef.current;

    if (!barElement) {
      return;
    }

    const progressBar = barElement;

    let frameId = 0;

    function syncProgress() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = totalHeight <= 0 ? 0 : Math.min(window.scrollY / totalHeight, 1);
      progressBar.style.transform = `scaleX(${nextProgress})`;
    }

    function requestSync() {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncProgress();
      });
    }

    syncProgress();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-px bg-white/5">
      <div
        ref={barRef}
        className="h-full origin-left bg-[var(--accent)] transition-[transform] duration-150 ease-out will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
