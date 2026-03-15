import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpenText } from "lucide-react";

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
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-5 px-6 py-6">
          <Link href="/blog" className="focus-ring inline-flex items-center gap-3 text-current transition hover:text-[var(--accent)]">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-[rgb(0_217_255_/_0.1)] text-[var(--accent)]">
              <BookOpenText aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--foreground)]">Engineering Notes</span>
              <span className="block text-xs text-[var(--foreground-soft)]">Thoughts on software systems</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-6 text-sm text-[var(--foreground-soft)]">
            <Link href="/blog" className="focus-ring transition hover:text-[var(--foreground)]">
              Articles
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12">
        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="mt-24 border-t border-[var(--border)] pt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted)]">
            <p>© 2026 blog.igorcodes.dev. Building in public.</p>
            <p>Minimal notes, clear thinking.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
