import Link from "next/link";
import { type ReactNode } from "react";
import { SiteNav } from "@/components/blog/site-nav";

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

      <header className="site-header">
        <Link href="/blog" className="wordmark">
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
