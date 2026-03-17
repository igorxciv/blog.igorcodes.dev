import { CalendarDays, Clock3, FilePenLine, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "@/lib/formatters/date";

type PostMetaProps = {
  date: string;
  readingTime?: number;
  updated?: string;
  published?: boolean;
  className?: string;
};

export function PostMeta({ date, readingTime, updated, published = true, className }: PostMetaProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)] lg:gap-x-5 lg:text-[0.82rem]",
          className
        )
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden="true" className="size-3.5 lg:size-4" />
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
      {updated ? (
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw aria-hidden="true" className="size-3.5 lg:size-4" />
          Updated <time dateTime={updated}>{formatDate(updated)}</time>
        </span>
      ) : null}
      {readingTime ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock3 aria-hidden="true" className="size-3.5 lg:size-4" />
          {readingTime} min read
        </span>
      ) : null}
      {!published ? (
        <span className="inline-flex items-center gap-1.5 rounded bg-[var(--accent-soft)] px-2 py-0.5 text-[var(--accent)] lg:px-2.5 lg:py-1">
          <FilePenLine aria-hidden="true" className="size-3.5 lg:size-4" />
          Draft
        </span>
      ) : null}
    </div>
  );
}
