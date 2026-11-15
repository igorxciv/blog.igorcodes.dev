"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

/**
 * Marks <html data-navigated> after the first client-side navigation. Page
 * entrance animations run only without this marker (a fresh page load); after
 * a client navigation the view transition animates the page instead, and the
 * two would otherwise stack. A layout effect runs in the same commit as the
 * new page, before any style is computed, so the entrance never starts.
 */
export function useClientNavigationMarker() {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (pathname !== initialPathname.current) {
      document.documentElement.dataset.navigated = "true";
    }
  }, [pathname]);
}
