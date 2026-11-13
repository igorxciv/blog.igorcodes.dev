"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

/** The header links. The current section reads brighter, with a cyan underline. */
export function SiteNav() {
  const pathname = usePathname() ?? "";
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
          >
            Writing
          </Link>
        </li>
        <li>
          <Link
            href="/blog#topics"
            data-current={inTopics ? "true" : undefined}
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
