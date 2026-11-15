import Link from "next/link";
import { type ReactNode } from "react";
import { NavigationMarker } from "@/components/blog/navigation-marker";
import { SiteNav } from "@/components/blog/site-nav";
import { NAV_BACK } from "@/lib/view-transitions";

type SiteShellProps = {
  children: ReactNode;
};

/** One narrow column for every page: the name and links on top, then the page. */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <NavigationMarker />

      <header className="site-header">
        <Link href="/blog" className="wordmark" transitionTypes={[NAV_BACK]}>
          <span className="wordmark-name">Igor</span>{" "}
          <span className="wordmark-verb">writes</span>
        </Link>
        <SiteNav />
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
