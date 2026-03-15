import { CalendarDays, Clock3, FilePenLine, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/styles/cn";

type PostMetaProps = {
  date: string;
  readingTime?: number;
  updated?: string;
  published?: boolean;
  className?: string;
};

export function PostMeta({ date, readingTime, updated, published = true, className }: PostMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]", className)}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden="true" className="size-3.5" />
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
      {updated ? (
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw aria-hidden="true" className="size-3.5" />
          Updated <time dateTime={updated}>{formatDate(updated)}</time>
        </span>
      ) : null}
      {readingTime ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock3 aria-hidden="true" className="size-3.5" />
          {readingTime} min read
        </span>
      ) : null}
      {!published ? (
        <span className="inline-flex items-center gap-1.5 rounded bg-[rgb(0_217_255_/_0.1)] px-2 py-0.5 text-[var(--accent)]">
          <FilePenLine aria-hidden="true" className="size-3.5" />
          Draft
        </span>
      ) : null}
    </div>
  );
}
