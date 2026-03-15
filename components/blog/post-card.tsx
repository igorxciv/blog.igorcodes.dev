import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { PostSummary } from "@/lib/types/posts";
import { cn } from "@/lib/styles/cn";
import { PostMeta } from "./post-meta";

type PostCardProps = ComponentPropsWithoutRef<"article"> & {
  post: PostSummary;
  featured?: boolean;
};

export function PostCard({ post, featured = false, className, ...restProps }: PostCardProps) {
  const topicLabel = post.topics[0] ?? "General";

  return (
    <article className={cn("group border-b border-[var(--border)] py-8 transition-colors hover:border-[var(--border-strong)]", className)} {...restProps}>
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">{topicLabel}</span>
            {featured ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-[rgb(0_217_255_/_0.1)] px-2 py-0.5 text-xs text-[var(--accent)]">
                <Sparkles aria-hidden="true" className="size-3.5" />
                Featured
              </span>
            ) : null}
          </div>

          <h2 className={cn("tracking-tight text-[var(--foreground)]", featured ? "text-2xl" : "text-xl")}>
            <Link href={`/blog/${post.slug}`} className="focus-ring transition-colors hover:text-[var(--accent)]">
              {post.title}
            </Link>
          </h2>

          {post.description ? <p className="mt-3 max-w-2xl leading-relaxed text-[var(--foreground-soft)]">{post.description}</p> : null}

          <PostMeta date={post.date} readingTime={post.readingTime} published={post.published} className="mt-4" />
        </div>

        <div className={cn("hidden shrink-0 overflow-hidden rounded-lg border border-[var(--border)] md:block", featured ? "h-32 w-32" : "h-28 w-28")}>
          <div className="flex h-full w-full items-end bg-[linear-gradient(180deg,#121212,#0f0f0f)] p-4">
            <div className="w-full">
              <div className="h-px w-full bg-[var(--border-strong)]" />
              <p className="mt-3 text-[10px] uppercase tracking-wide text-[var(--accent)]">{topicLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
