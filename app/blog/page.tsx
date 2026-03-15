import Link from "next/link";
import type { Metadata } from "next";
import { PostCard, RandomPostButton } from "@/components/blog";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Writing on software architecture, frontend engineering, AI systems, and technical thinking.",
    alternates: {
      canonical: "/blog",
    },
  };
}

type BlogPageProps = {
  searchParams: Promise<{
    topic?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { topic } = await searchParams;
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);

  if (posts.length === 0) {
    return (
      <section className="py-16">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--foreground-soft)]">
          No posts are available yet. Add `.md` or `.mdx` files in `content/posts`.
        </p>
      </section>
    );
  }

  const activeTopic = topic && topics.includes(topic) ? topic : null;
  const filteredPosts = activeTopic ? posts.filter((post) => post.topics.includes(activeTopic)) : posts;
  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const recentPosts = filteredPosts.filter((post) => !post.featured || activeTopic);
  const topicChipClassName = "focus-ring inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors";
  const inactiveTopicChipStyle = {
    backgroundColor: "var(--surface-strong)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  } as const;
  const activeTopicChipStyle = {
    backgroundColor: "var(--surface-strong)",
    borderColor: "var(--accent)",
    color: "var(--foreground)",
    boxShadow: "inset 0 0 0 1px rgb(0 217 255 / 0.24)",
  } as const;

  return (
    <section className="fade-in">
      <header className="mb-16">
        <h1 className="mb-4 text-4xl text-[var(--foreground)]" style={{ fontWeight: 600 }}>
          Engineering Notes
        </h1>
        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-[var(--foreground-soft)]">
          A collection of thoughts on software architecture, frontend engineering, AI systems, and technical thinking.
          Written for developers who care about craft.
        </p>
        <RandomPostButton slugs={posts.map((post) => post.slug)} />
      </header>

      <section className="mb-12" aria-labelledby="topic-filter-heading">
        <h2 id="topic-filter-heading" className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Filter by topic
        </h2>
        <ul className="flex flex-wrap gap-2" aria-label="Topics">
          <li>
            <Link
              href="/blog"
              aria-current={activeTopic === null ? "page" : undefined}
              className={topicChipClassName}
              style={activeTopic === null ? activeTopicChipStyle : inactiveTopicChipStyle}
            >
              {activeTopic === null ? <span aria-hidden="true" className="size-2 rounded-full bg-[var(--accent)]" /> : null}
              All articles
            </Link>
          </li>
          {topics.map((item) => (
            <li key={item}>
              <Link
                href={`/blog?topic=${encodeURIComponent(item)}`}
                aria-current={activeTopic === item ? "page" : undefined}
                className={topicChipClassName}
                style={activeTopic === item ? activeTopicChipStyle : inactiveTopicChipStyle}
              >
                {activeTopic === item ? <span aria-hidden="true" className="size-2 rounded-full bg-[var(--accent)]" /> : null}
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {!activeTopic && featuredPosts.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-6 text-sm uppercase tracking-wide text-[var(--muted)]">Featured</h2>
          <div>
            {featuredPosts.map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-6 text-sm uppercase tracking-wide text-[var(--muted)]">
          {activeTopic ? activeTopic : "Recent Articles"}
        </h2>
        <div>
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8" aria-labelledby="stay-updated-heading">
        <h2 id="stay-updated-heading" className="mb-3 text-xl text-[var(--foreground)]">
          Stay Updated
        </h2>
        <p className="mb-6 text-[var(--foreground-soft)]">
          New writing is published here first. The email subscription flow is not live yet, so the archive remains the canonical way to follow updates.
        </p>
        <p className="text-sm text-[var(--muted)]">Bookmark this page or use the topic filters above to check for new posts.</p>
      </section>
    </section>
  );
}
