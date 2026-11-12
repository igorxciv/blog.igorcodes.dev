"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

/** The links stamped on the book cloth. The red underline marks where you are. */
export function BandNav() {
  const pathname = usePathname() ?? "";
  const inAccounts = pathname.startsWith("/blog/topics/");
  const inEntries = !inAccounts && pathname.startsWith("/blog");

  return (
    <nav aria-label="Site" className="band-nav">
      <ul>
        <li>
          <Link
            href="/blog"
            aria-current={pathname === "/blog" ? "page" : undefined}
            data-current={inEntries ? "true" : undefined}
          >
            Entries
          </Link>
        </li>
        <li>
          <Link
            href="/blog#accounts"
            data-current={inAccounts ? "true" : undefined}
          >
            Accounts
          </Link>
        </li>
        <li>
          <a href="/rss.xml">Feed</a>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
