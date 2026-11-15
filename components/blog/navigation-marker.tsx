"use client";

import { useClientNavigationMarker } from "@/hooks/useClientNavigationMarker";

/**
 * Renders nothing. Lives in the root layout's shell so it sees every client
 * navigation and can mark <html data-navigated> (see the hook).
 */
export function NavigationMarker() {
  useClientNavigationMarker();
  return null;
}
