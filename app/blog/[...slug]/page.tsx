import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Hash } from "lucide-react";
import { PostMeta } from "@/components/blog/post-meta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { getAllPosts, getPostBySlug } from "@/lib/server/posts";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
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
  const socialImagePath = `/api/og?slug=${encodeURIComponent(post.slug)}`;

  return {
    title: post.title,
    description,
    keywords: [...post.topics, ...post.tags],
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      url: canonicalPath,
      siteName: siteConfig.name,
      title: post.title,
      description,
      locale: siteConfig.locale,
      images: [
        {
          url: socialImagePath,
          width: 1200,
          height: 630,
          alt: `${post.title} social preview`,
        },
      ],
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [siteConfig.author.name],
      section: post.topics[0],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [socialImagePath],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug.join("/"));

  if (!post) {
    notFound();
  }

  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="fade-in mx-auto max-w-3xl lg:max-w-4xl">
        <Link href="/blog" className="focus-ring mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--foreground-soft)] transition hover:text-[var(--foreground)] sm:mb-8 lg:mb-10 lg:gap-2.5 lg:text-[0.95rem]">
          <ArrowLeft aria-hidden="true" className="size-4 lg:size-[1.05rem]" />
          Back to articles
        </Link>

        <article>
          <header className="mb-10 sm:mb-12 lg:mb-14">
            <div className="mb-6 h-44 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-inset))] sm:mb-8 sm:h-56 md:h-64 lg:mb-10 lg:h-72 lg:rounded-xl">
              <div className="flex h-full w-full items-end p-4 sm:p-6 lg:p-8">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)] lg:text-[0.82rem]">{post.topics[0] ?? "Engineering note"}</span>
              </div>
            </div>

            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--accent)] lg:mb-5 lg:text-[0.82rem]">
              {post.topics[0] ? (
                <Link href={`/blog?topic=${encodeURIComponent(post.topics[0])}`} className="focus-ring rounded-sm">
                  {post.topics[0]}
                </Link>
              ) : (
                "Engineering note"
              )}
            </p>
            <h1 className="mb-5 text-3xl leading-tight text-[var(--foreground)] sm:mb-6 sm:text-4xl md:text-5xl lg:text-[4rem]" style={{ fontWeight: 600 }}>
              {post.title}
            </h1>
            {post.description ? <p className="max-w-2xl text-base leading-relaxed text-[var(--foreground-soft)] sm:text-lg lg:max-w-3xl lg:text-[1.24rem] lg:leading-9">{post.description}</p> : null}

            <PostMeta date={post.date} updated={post.updated} readingTime={post.readingTime} published={post.published} className="mt-6 lg:mt-7" />

            <div className="mt-6 flex flex-wrap gap-2 text-xs lg:mt-7 lg:gap-2.5 lg:text-[0.82rem]">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted)] lg:px-3 lg:py-1.5">
                  <Hash aria-hidden="true" className="size-3.5 lg:size-4" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose-blog max-w-none">
            <MDXRemote source={post.body} components={mdxComponents} />
          </div>

          <footer className="mt-12 border-t border-[var(--border)] pt-8 sm:mt-16 lg:mt-20 lg:pt-10">
            <p className="text-sm text-[var(--foreground-soft)] lg:text-[0.98rem]">
              End of note. Return to the <Link href="/blog" className="focus-ring rounded-sm text-[var(--foreground)]">archive</Link> for the next article.
            </p>
          </footer>
        </article>
      </section>
    </>
  );
}
