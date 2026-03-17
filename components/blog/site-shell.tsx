import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { FeedLinks } from "./feed-links";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="skip-link focus-ring rounded-md bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)]"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgb(10_10_10_/_0.84)] backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <Link href="/blog" className="focus-ring inline-flex min-h-11 items-center gap-3 text-current transition hover:text-[var(--accent)] lg:gap-4">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-[rgb(0_217_255_/_0.1)] text-[var(--accent)] lg:size-9 lg:rounded-lg">
              <BookOpenText aria-hidden="true" className="size-5 lg:size-[1.35rem]" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--foreground)] lg:text-base">Engineering Notes</span>
              <span className="block text-xs text-[var(--foreground-soft)] lg:text-sm">Thoughts on software systems</span>
            </span>
          </Link>

        </div>
      </header>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8 lg:py-14">
        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="mt-16 border-t border-[var(--border)] pt-8 sm:mt-20 sm:pt-10 md:mt-24 md:pt-12">
          <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 lg:text-[0.95rem]">
            <p>© 2026 blog.igorcodes.dev. Building in public.</p>
            <FeedLinks compact />
          </div>
        </footer>
      </div>
    </div>
  );
}
