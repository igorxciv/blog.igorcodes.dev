import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { PostContents } from "@/components/blog/post-contents";
import { postMarkdownPath } from "@/lib/llms";
import { remarkTextFences } from "@/lib/mdx/remark-text-fences";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdString,
} from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";
import {
  extractSections,
  formatIsoDate,
  formatLongDate,
  formatTopic,
  getAdjacentPosts,
} from "@/lib/writing";
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

  const description = post.description ?? "Read this essay.";
  const canonicalPath = `/blog/${post.slug}`;
  const socialImagePath = `/api/og?slug=${encodeURIComponent(post.slug)}&v=${encodeURIComponent(post.updated ?? post.date)}`;

  return {
    title: post.title,
    description,
    keywords: [...post.topics, ...post.tags],
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    alternates: {
      canonical: canonicalPath,
      // Point AI agents / answer engines at the clean Markdown mirror (AEO).
      types: {
        "text/markdown": postMarkdownPath(post.slug),
      },
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

function topicHref(topic: string) {
  return `/blog/topics/${encodeURIComponent(topic)}`;
}

function MetaIcon({ path }: { path: string }) {
  return (
    <svg
      className="meta-icon"
      viewBox="0 0 16 16"
      width="15"
      height="15"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type AdjacentPost = { slug: string; title: string; date: string } | null;

function AdjacentLink({ label, post }: { label: string; post: AdjacentPost }) {
  if (!post) {
    return null;
  }
  const date = formatIsoDate(post.date);
  return (
    <li>
      <span className="section-label">{label}</span>
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      <time dateTime={post.date}>{date}</time>
    </li>
  );
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
  const { previous, next } = getAdjacentPosts(posts, post.slug);
  const sections = extractSections(post.body);
  const hasContents = sections.length > 1;
  const sectionCount = sections.filter((section) => section.depth === 2).length;
  const isoDate = formatIsoDate(post.date);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />

      <article
        className="post"
        data-contents={hasContents ? "true" : "false"}
        aria-labelledby="post-title"
      >
        <header className="post-header">
          {post.topics.length > 0 ? (
            <ul className="post-kicker" aria-label="Topics">
              {post.topics.map((topic) => (
                <li key={topic}>
                  <Link href={topicHref(topic)}>
                    {formatTopic(topic).toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <h1 id="post-title">{post.title}</h1>
          {post.description ? (
            <p className="post-lede">{post.description}</p>
          ) : null}
          <div className="post-meta">
            <span>
              <MetaIcon path="M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3" />
              <time dateTime={post.date}>{isoDate}</time>
            </span>
            {post.readingTime ? (
              <span>
                <MetaIcon path="M8 2.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5" />
                {post.readingTime} min read
              </span>
            ) : null}
            {sectionCount > 1 ? (
              <span>
                <MetaIcon path="M2.5 4h11M2.5 8h11M2.5 12h7" />
                {sectionCount} sections
              </span>
            ) : null}
            {post.published ? null : <span>draft</span>}
          </div>
        </header>

        {hasContents ? <PostContents sections={sections} /> : null}

        <div className="prose">
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

        <footer className="post-end">
          <p className="post-signed">
            Written by {siteConfig.author.name},{" "}
            <time dateTime={post.date}>{formatLongDate(post.date)}</time>
            {post.updated ? (
              <>
                ; updated{" "}
                <time dateTime={post.updated}>
                  {formatLongDate(post.updated)}
                </time>
              </>
            ) : null}
            .
          </p>
          {previous || next ? (
            <nav aria-label="More essays">
              <ul className="post-adjacent">
                <AdjacentLink label="Previous" post={previous} />
                <AdjacentLink label="Next" post={next} />
              </ul>
            </nav>
          ) : null}
          <p className="post-feeds">
            New essays arrive by <a href="/rss.xml">RSS</a> or{" "}
            <a href="/feed.json">JSON Feed</a>. This essay is also available{" "}
            <a href={postMarkdownPath(post.slug)}>as Markdown</a>.
          </p>
        </footer>
      </article>
    </>
  );
}
