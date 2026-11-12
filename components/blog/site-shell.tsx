import Link from "next/link";
import { type ReactNode } from "react";
import { BandNav } from "@/components/daybook/band-nav";
import { getVolume, getVolumeLabel } from "@/lib/daybook";
import { getAllPosts } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

type SiteShellProps = {
  children: ReactNode;
};

/**
 * The book's boards: a cloth band with the gilt label and the site links at
 * the top, a matching band at the foot. Pages draw the ruled sheet between.
 */
export async function SiteShell({ children }: SiteShellProps) {
  const posts = await getAllPosts();
  const volume = getVolume(posts);
  const volumeLine = getVolumeLabel(posts);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="band">
        <div className="band-inner">
          <Link href="/blog" className="label">
            <span className="label-title">{siteConfig.name}</span>
            {volumeLine ? (
              <span className="label-volume">{volumeLine}</span>
            ) : null}
          </Link>
          <BandNav />
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="band band-foot">
        <div className="band-inner">
          <span>
            {siteConfig.name}
            {volume ? `, Vol. ${volume.numeral}` : null}
          </span>
          <span>
            Kept by {siteConfig.author.name} at{" "}
            <Link href="/blog">{siteConfig.domain}</Link>
          </span>
          <span>
            <a href="/rss.xml">RSS</a> · <a href="/feed.json">JSON Feed</a>
          </span>
        </div>
      </footer>
    </>
  );
}
