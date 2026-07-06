"use client";

import { useEffect, useRef } from "react";

export function useReadingProgress<T extends HTMLElement>(targetId: string) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    let frameId = 0;

    const syncProgress = () => {
      const target = document.getElementById(targetId);

      if (!target) {
        element.style.transform = "scaleX(0)";
        return;
      }

      // Measure the article body only, so 100% is reached when its last
      // paragraph scrolls past — not somewhere beyond the page footer.
      const scrollableDistance = target.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - target.offsetTop;
      const nextProgress =
        scrollableDistance <= 0
          ? 0
          : Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
      element.style.transform = `scaleX(${nextProgress})`;
    };

    const requestSync = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncProgress();
      });
    };

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
  }, [targetId]);

  return elementRef;
}
