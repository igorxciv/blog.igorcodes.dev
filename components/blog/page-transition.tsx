import { type ReactNode, ViewTransition } from "react";
import { NAV_BACK, NAV_FORWARD } from "@/lib/view-transitions";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Wraps one page's content so client navigations animate it: the old page
 * leaves and the new one arrives, in the direction the link declares through
 * `transitionTypes`. Each page renders its own wrapper, so the two pages are an
 * exit and an enter rather than one morphing box (which would slide between two
 * scroll positions). In-page updates do not animate. CSS: app/globals.css.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <ViewTransition
      enter={{
        [NAV_FORWARD]: "page-enter-forward",
        [NAV_BACK]: "page-enter-back",
        default: "page-enter",
      }}
      exit={{
        [NAV_FORWARD]: "page-exit-forward",
        [NAV_BACK]: "page-exit-back",
        default: "page-exit",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
