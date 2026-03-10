import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Clock3, FilePenLine, Hash, Star } from "lucide-react";
import { formatDate } from "@/lib/formatters/date";
import { getAllPosts } from "@/lib/server/posts";
import { cn } from "@/lib/styles/cn";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description: "Writing on software, product engineering, and the web.",
    alternates: {
      canonical: "/blog",
    },
  };
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  if (posts.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          No posts are available yet. Add `.md` or `.mdx` files in `content/posts`.
        </p>
      </main>
    );
  }

  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const recentPosts = posts.filter((post) => post.slug !== featuredPost.slug);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <header className="space-y-3">
        <p className="font-mono text-sm uppercase tracking-wide text-[var(--muted)]">Blog</p>
        <h1 className="text-4xl font-semibold tracking-tight">Notes and articles</h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">
          A focused, MDX-first blog with static routing and schema-validated frontmatter.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-[var(--muted)]">
          <Star aria-hidden="true" className="size-4" />
          Featured
        </h2>
        <article className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-4" />
              <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
            </span>
            {featuredPost.readingTime ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 aria-hidden="true" className="size-4" />
                {featuredPost.readingTime} min read
              </span>
            ) : null}
            {!featuredPost.published ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-300">
                <FilePenLine aria-hidden="true" className="size-3.5" />
                Draft
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            <Link className="hover:underline" href={`/blog/${featuredPost.slug}`}>
              {featuredPost.title}
            </Link>
          </h3>
          {featuredPost.description ? (
            <p className="mt-3 text-base text-[var(--muted)]">{featuredPost.description}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {featuredPost.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                <Hash aria-hidden="true" className="size-3.5" />
                {tag}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-sm uppercase tracking-wide text-[var(--muted)]">Recent</h2>
        <ul className="mt-4 space-y-4">
          {recentPosts.map((post) => (
            <li
              key={post.slug}
              className={cn("rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4", "transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.03]")}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="text-lg font-semibold tracking-tight">{post.title}</h3>
                {post.description ? <p className="mt-2 text-sm text-[var(--muted)]">{post.description}</p> : null}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-3.5" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </span>
                  {post.readingTime ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 aria-hidden="true" className="size-3.5" />
                      {post.readingTime} min read
                    </span>
                  ) : null}
                  {!post.published ? (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-300">
                      <FilePenLine aria-hidden="true" className="size-3.5" />
                      Draft
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
