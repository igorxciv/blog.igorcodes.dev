import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CalendarDays, Clock3, FilePenLine, Hash, RefreshCw, Shapes } from "lucide-react";
import { formatDate } from "@/lib/formatters/date";
import { getAllPosts, getPostBySlug } from "@/lib/server/posts";
import { mdxComponents } from "@/mdx-components";

type PostPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const post = await getPostBySlug(slugPath);

  if (!post) {
    return {};
  }

  const description = post.description ?? "Read this blog post.";
  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug.join("/"));

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">
        <header className="space-y-4 border-b border-[var(--border)] pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            {post.updated ? (
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw aria-hidden="true" className="size-3.5" />
                Updated {formatDate(post.updated)}
              </span>
            ) : null}
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

          <h1 className="text-4xl font-semibold leading-tight tracking-tight">{post.title}</h1>
          {post.description ? <p className="text-lg text-[var(--muted)]">{post.description}</p> : null}

          <div className="flex flex-wrap gap-2 text-xs">
            {post.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted)]"
              >
                <Shapes aria-hidden="true" className="size-3.5" />
                {topic}
              </span>
            ))}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted)]"
              >
                <Hash aria-hidden="true" className="size-3.5" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <MDXRemote source={post.body} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
