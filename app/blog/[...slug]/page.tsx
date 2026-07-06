import { ArrowLeft } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { PostPageHeader } from "@/components/blog/post-page-header";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { remarkTextFences } from "@/lib/mdx/remark-text-fences";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdString,
} from "@/lib/seo";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";
import { createPostMdxComponents } from "@/mdx-components";

type PostPageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

// Build-time syntax highlighting (Shiki via rehype-pretty-code) — zero client JS.
// Dual theme: light is the inline default; dark is exposed as the --shiki-dark
// CSS variable and activated under [data-theme="dark"] in globals.css.
const prettyCodeOptions: Options = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const post = await getPostBySlug(slugPath);

  if (!post) {
    return {};
  }

  const description = post.description ?? "Read this blog post.";
  const canonicalPath = `/blog/${post.slug}`;
  const socialImagePath = `/api/og?slug=${encodeURIComponent(post.slug)}&v=${encodeURIComponent(post.updated ?? post.date)}`;

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
  const postMdxComponents = createPostMdxComponents(post.slug);
  const posts = await getAllPosts();
  const relatedPosts = getRelatedPosts(post, posts);

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />

      <section className="fade-in mx-auto max-w-3xl lg:max-w-4xl">
        <Link
          href="/blog"
          className="focus-ring mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-(--foreground-soft) transition hover:text-(--foreground) sm:mb-8 lg:mb-10 lg:gap-2.5 lg:text-[0.95rem]"
        >
          <ArrowLeft aria-hidden="true" className="size-4 lg:size-[1.05rem]" />
          Back to articles
        </Link>

        <article>
          <PostPageHeader post={post} />

          <div className="prose-blog max-w-none">
            <MDXRemote
              source={post.body}
              components={postMdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkTextFences, remarkGfm],
                  rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
                },
              }}
            />
          </div>

          <RelatedPosts posts={relatedPosts} />
        </article>
      </section>
    </>
  );
}
