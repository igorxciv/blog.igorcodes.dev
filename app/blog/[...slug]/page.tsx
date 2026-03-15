import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Hash } from "lucide-react";
import { PostMeta, ReadingProgress } from "@/components/blog";
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
    <>
      <ReadingProgress />

      <section className="fade-in mx-auto max-w-3xl">
        <Link href="/blog" className="focus-ring mb-8 inline-flex items-center gap-2 text-sm text-[var(--foreground-soft)] transition hover:text-[var(--foreground)]">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to articles
        </Link>

        <article>
          <header className="mb-12">
            <div className="mb-8 h-64 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[linear-gradient(180deg,#121212,#0f0f0f)]">
              <div className="flex h-full w-full items-end p-6">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">{post.topics[0] ?? "Engineering note"}</span>
              </div>
            </div>

            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">{post.topics[0] ?? "Engineering note"}</p>
            <h1 className="mb-6 text-4xl leading-tight text-[var(--foreground)] md:text-5xl" style={{ fontWeight: 600 }}>
              {post.title}
            </h1>
            {post.description ? <p className="max-w-2xl text-lg leading-relaxed text-[var(--foreground-soft)]">{post.description}</p> : null}

            <PostMeta date={post.date} updated={post.updated} readingTime={post.readingTime} published={post.published} className="mt-6" />

            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted)]">
                  <Hash aria-hidden="true" className="size-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose-blog max-w-none">
            <MDXRemote source={post.body} components={mdxComponents} />
          </div>

          <footer className="mt-16 border-t border-[var(--border)] pt-8">
            <p className="text-sm text-[var(--foreground-soft)]">End of note. Return to the archive for the next article.</p>
          </footer>
        </article>
      </section>
    </>
  );
}
