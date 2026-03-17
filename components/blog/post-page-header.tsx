import Link from "next/link";
import { Hash } from "lucide-react";
import type { PostContent } from "@/lib/types/posts";
import { PostMeta } from "./post-meta";

type PostPageHeaderProps = {
  post: PostContent;
};

export function PostPageHeader({ post }: PostPageHeaderProps) {
  const primaryTopic = post.topics[0];

  return (
    <header className="mb-10 sm:mb-12 lg:mb-14">
      <div className="mb-6 h-44 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-inset))] sm:mb-8 sm:h-56 md:h-64 lg:mb-10 lg:h-72 lg:rounded-xl">
        <div className="flex h-full w-full items-end p-4 sm:p-6 lg:p-8">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)] lg:text-[0.82rem]">
            {primaryTopic ?? "Engineering note"}
          </span>
        </div>
      </div>

      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--accent)] lg:mb-5 lg:text-[0.82rem]">
        {primaryTopic ? (
          <Link href={`/blog?topic=${encodeURIComponent(primaryTopic)}`} className="focus-ring rounded-sm">
            {primaryTopic}
          </Link>
        ) : (
          "Engineering note"
        )}
      </p>
      <h1
        className="mb-5 text-3xl leading-tight text-[var(--foreground)] sm:mb-6 sm:text-4xl md:text-5xl lg:text-[4rem]"
        style={{ fontWeight: 600 }}
      >
        {post.title}
      </h1>
      {post.description ? (
        <p className="max-w-2xl text-base leading-relaxed text-[var(--foreground-soft)] sm:text-lg lg:max-w-3xl lg:text-[1.24rem] lg:leading-9">
          {post.description}
        </p>
      ) : null}

      <PostMeta
        date={post.date}
        updated={post.updated}
        readingTime={post.readingTime}
        published={post.published}
        className="mt-6 lg:mt-7"
      />

      <div className="mt-6 flex flex-wrap gap-2 text-xs lg:mt-7 lg:gap-2.5 lg:text-[0.82rem]">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted)] lg:px-3 lg:py-1.5"
          >
            <Hash aria-hidden="true" className="size-3.5 lg:size-4" />
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
}
