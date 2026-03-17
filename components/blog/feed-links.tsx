import Link from "next/link";
import { Braces, Rss, type LucideIcon } from "lucide-react";

type FeedLinksProps = {
  compact?: boolean;
};

type FeedLink = {
  href: string;
  label: string;
  description: string;
  icon?: LucideIcon;
};

const links: FeedLink[] = [
  {
    href: "/rss.xml",
    label: "RSS",
    description: "Works in any feed reader.",
    icon: Rss,
  },
  {
    href: "/feed.json",
    label: "JSON Feed",
    description: "Modern format for apps and automations.",
    icon: Braces,
  },
];

export function FeedLinks({ compact = false }: FeedLinksProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="sr-only">Syndication feeds</span>
        {links.map((link) => {
          const Icon = link.icon ?? Rss;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-soft)] transition hover:border-[rgb(0_217_255_/_0.35)] hover:text-[var(--accent)]"
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="sr-only">{link.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" aria-label="Feed formats">
      {links.map((link) => {
        const Icon = link.icon ?? Rss;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="focus-ring group flex min-h-11 items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[rgb(255_255_255_/_0.015)] px-4 py-3 transition hover:border-[rgb(0_217_255_/_0.35)] hover:bg-[rgb(0_217_255_/_0.045)]"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgb(0_217_255_/_0.1)] text-[var(--accent)]">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[var(--foreground)] lg:text-[0.98rem]">{link.label}</span>
                <span className="block text-sm text-[var(--foreground-soft)]">{link.description}</span>
              </span>
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition group-hover:text-[var(--accent)]">
              Open
            </span>
          </Link>
        );
      })}
    </div>
  );
}
