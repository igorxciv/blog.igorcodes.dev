import { ThemeToggle } from "@/components/theme-toggle";

/**
 * The header links: the feed and the theme toggle. The wordmark leads home and
 * every essay links its topics, so neither needs its own nav item.
 */
export function SiteNav() {
  return (
    <nav aria-label="Site" className="site-nav">
      <ul>
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
