"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function syncProgress() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = totalHeight <= 0 ? 0 : Math.min(window.scrollY / totalHeight, 1);
      setProgress(nextProgress);
    }

    syncProgress();
    window.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress);

    return () => {
      window.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", syncProgress);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-px bg-white/5">
      <div className="h-full origin-left bg-[var(--accent)] transition-[transform] duration-150 ease-out" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
