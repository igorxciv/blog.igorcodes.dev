import Link from "next/link";
import { type ReactNode } from "react";
import { SiteNav } from "@/components/blog/site-nav";
import { siteConfig } from "@/lib/site";

type SiteShellProps = {
  children: ReactNode;
};

/** One narrow column for every page: the name and links on top, feeds at the foot. */
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

      <footer className="site-footer">
        <p>
          <span className="site-footer-name">{siteConfig.name}</span>
          <span className="site-footer-domain">{siteConfig.domain}</span>
        </p>
        <p>
          <a href="/rss.xml">RSS</a>
          <a href="/feed.json">JSON Feed</a>
          <a href="/llms.txt">llms.txt</a>
        </p>
      </footer>
    </>
  );
}
