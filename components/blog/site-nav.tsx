"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClientNavigationMarker } from "@/hooks/useClientNavigationMarker";
import { NAV_BACK } from "@/lib/view-transitions";

/** The header links. The current section reads brighter, with a cyan underline. */
export function SiteNav() {
  const pathname = usePathname() ?? "";
  // The nav lives in the root layout, so it sees every client navigation.
  useClientNavigationMarker();
  const inTopics = pathname.startsWith("/blog/topics/");
  const inWriting = !inTopics && pathname.startsWith("/blog");

  return (
    <nav aria-label="Site" className="site-nav">
      <ul>
        <li>
          <Link
            href="/blog"
            aria-current={pathname === "/blog" ? "page" : undefined}
            data-current={inWriting ? "true" : undefined}
            transitionTypes={[NAV_BACK]}
          >
            Writing
          </Link>
        </li>
        <li>
          <Link
            href="/blog#topics"
            data-current={inTopics ? "true" : undefined}
            transitionTypes={[NAV_BACK]}
          >
            Topics
          </Link>
        </li>
        <li>
          <a href="/rss.xml">RSS</a>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
