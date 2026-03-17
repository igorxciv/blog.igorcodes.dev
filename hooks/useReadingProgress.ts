"use client";

import { useEffect, useRef } from "react";

export function useReadingProgress<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    let frameId = 0;

    const syncProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = totalHeight <= 0 ? 0 : Math.min(window.scrollY / totalHeight, 1);
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
  }, []);

  return elementRef;
}
