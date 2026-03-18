import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { PostPageHeader } from "@/components/blog/post-page-header";
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
        <Link href="/blog" className="focus-ring mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-(--foreground-soft) transition hover:text-(--foreground) sm:mb-8 lg:mb-10 lg:gap-2.5 lg:text-[0.95rem]">
          <ArrowLeft aria-hidden="true" className="size-4 lg:size-[1.05rem]" />
          Back to articles
        </Link>

        <article>
          <PostPageHeader post={post} />

          <div className="prose-blog max-w-none">
            <MDXRemote source={post.body} components={mdxComponents} />
          </div>

          <footer className="mt-12 border-t border-(--border) pt-8 sm:mt-16 lg:mt-20 lg:pt-10">
            <p className="text-sm text-(--foreground-soft) lg:text-[0.98rem]">
              End of note. Return to the <Link href="/blog" className="focus-ring rounded-sm text-(--foreground)">archive</Link> for the next article.
            </p>
          </footer>
        </article>
      </section>
    </>
  );
}
