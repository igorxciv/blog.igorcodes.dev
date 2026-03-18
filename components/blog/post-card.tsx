import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PostSummary } from "@/lib/types/posts";
import { PostMeta } from "./post-meta";

type PostCardProps = ComponentPropsWithoutRef<"article"> & {
  post: PostSummary;
  featured?: boolean;
};

export function PostCard({ post, featured = false, className, ...restProps }: PostCardProps) {
  const topicLabel = post.topics[0] ?? "General";

  return (
    <article
      className={twMerge(
        clsx(
          "content-visibility-card group border-b border-(--border) py-6 transition-colors hover:border-(--border-strong) sm:py-8 lg:py-10",
          className
        )
      )}
      {...restProps}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8 lg:gap-10">
        <div
          className={clsx(
            "overflow-hidden rounded-lg border border-(--border) md:hidden",
            featured ? "h-40 w-full" : "h-32 w-full"
          )}
        >
          <div className="flex h-full w-full items-end bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-inset))] p-4">
            <div className="w-full">
              <div className="h-px w-full bg-(--border-strong)" />
              <p className="mt-3 text-[10px] uppercase tracking-wide text-(--accent)">{topicLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3 lg:mb-4">
            <span className="text-xs font-medium uppercase tracking-wide text-(--accent) lg:text-[0.82rem]">{topicLabel}</span>
            {featured ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-(--accent-soft) px-2 py-0.5 text-xs text-(--accent) lg:px-2.5 lg:py-1 lg:text-[0.82rem]">
                <Sparkles aria-hidden="true" className="size-3.5 lg:size-4" />
                Featured
              </span>
            ) : null}
          </div>

          <h2
            className={clsx(
              "tracking-tight text-(--foreground)",
              featured ? "text-2xl sm:text-3xl lg:text-[2.55rem]" : "text-xl sm:text-2xl lg:text-[2rem]"
            )}
          >
            <Link href={`/blog/${post.slug}`} className="focus-ring inline-block py-1 transition-colors hover:text-(--accent)">
              {post.title}
            </Link>
          </h2>

          {post.description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--foreground-soft) sm:text-base lg:mt-4 lg:max-w-3xl lg:text-[1.08rem] lg:leading-8">{post.description}</p> : null}

          <PostMeta date={post.date} readingTime={post.readingTime} published={post.published} className="mt-4 lg:mt-5" />
        </div>

        <div className="hidden h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-(--border) md:block lg:h-40 lg:w-40 lg:rounded-xl">
          <div className="flex h-full w-full items-end bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-inset))] p-4 lg:p-5">
            <div className="w-full">
              <div className="h-px w-full bg-(--border-strong)" />
              <p className="mt-3 text-[10px] uppercase tracking-wide text-(--accent) lg:text-[0.72rem]">{topicLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
