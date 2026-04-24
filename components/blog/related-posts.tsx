import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostSummary } from "@/lib/types/posts";
import { PostMeta } from "./post-meta";

type RelatedPostsProps = {
  posts: PostSummary[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-(--border) pt-8 sm:mt-16 lg:mt-20 lg:pt-10" aria-labelledby="related-posts-title">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
        <div>
          <h2 id="related-posts-title" className="text-sm uppercase tracking-wide text-(--muted) lg:text-[0.82rem]">
            Further reading
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--foreground-soft) lg:text-[0.98rem]">
            Related notes that continue the same thread.
          </p>
        </div>
        <Link href="/blog" className="focus-ring inline-flex min-h-10 items-center gap-2 self-start rounded-sm text-sm text-(--foreground-soft) transition hover:text-(--foreground) sm:self-auto lg:text-[0.95rem]">
          Archive
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const topicLabel = post.topics[0] ?? "General";

          return (
            <article key={post.slug} className="group rounded-lg border border-(--border) bg-(--surface) p-4 transition-colors hover:border-(--border-strong) hover:bg-(--surface-hover) lg:p-5">
              <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-wide text-(--accent) lg:text-xs">
                {topicLabel}
              </p>
              <h3 className="text-base leading-snug text-(--foreground) lg:text-lg">
                <Link href={`/blog/${post.slug}`} className="focus-ring rounded-sm transition-colors group-hover:text-(--accent)">
                  {post.title}
                </Link>
              </h3>
              {post.description ? (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-(--foreground-soft)">
                  {post.description}
                </p>
              ) : null}
              <PostMeta date={post.date} readingTime={post.readingTime} published={post.published} className="mt-4" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
