import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { EntryContents } from "@/components/daybook/entry-contents";
import { MarkReadOnReach, ReadTick } from "@/components/daybook/tick";
import {
  extractSections,
  formatLedgerDate,
  formatTopic,
  getAdjacentEntries,
  getFolioNumbers,
} from "@/lib/daybook";
import { postMarkdownPath } from "@/lib/llms";
import { remarkTextFences } from "@/lib/mdx/remark-text-fences";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdString,
} from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/server/posts";
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

  const description = post.description ?? "Read this entry.";
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

type ForwardEntry = { slug: string; title: string; date: string } | null;

function ForwardRow({
  label,
  entry,
  emptyText,
}: {
  label: string;
  entry: ForwardEntry;
  emptyText: string;
}) {
  const date = entry ? formatLedgerDate(entry.date) : null;
  return (
    <li>
      <span className="col-head">{label}</span>
      {entry && date ? (
        <>
          <Link href={`/blog/${entry.slug}`}>{entry.title}</Link>
          <time dateTime={entry.date}>
            {date.day} {date.year}
          </time>
        </>
      ) : (
        <span className="entry-forward-empty">{emptyText}</span>
      )}
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
  const folio = getFolioNumbers(posts).get(post.slug);
  const folioLabel = folio ? `Fo. ${folio}` : "Fo. –";
  const { broughtForward, carriedForward } = getAdjacentEntries(
    posts,
    post.slug,
  );
  const date = formatLedgerDate(post.date);
  const updated = post.updated ? formatLedgerDate(post.updated) : null;
  const sections = extractSections(post.body);
  const hasContents = sections.length > 1;

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

      <article className="entry" data-contents={hasContents ? "true" : "false"}>
        <div className="entry-heads" aria-hidden="true">
          <span className="col-head entry-heads-date">Date</span>
          <span className="col-head">Particulars</span>
          <span className="col-head entry-heads-acct">Account</span>
        </div>
        <div className="entry-rule" aria-hidden="true" />

        <div className="entry-row">
          <p className="entry-date">
            <time dateTime={post.date}>
              {date.day}
              <small>{date.year}</small>
            </time>
          </p>
          <header className="entry-part">
            <h1 id="entry-title" className="entry-title">
              {post.title}
            </h1>
            {post.description ? (
              <p className="entry-lede">{post.description}</p>
            ) : null}
          </header>
          <dl className="entry-acct">
            <div className="entry-acct-date">
              <dt>Date</dt>
              <dd>
                <time dateTime={post.date}>
                  {date.day} {date.year}
                </time>
              </dd>
            </div>
            <div className="entry-acct-account">
              <dt>Account</dt>
              <dd>
                <ul>
                  {post.topics.map((topic) => (
                    <li key={topic}>
                      <Link href={topicHref(topic)}>{formatTopic(topic)}</Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Folio</dt>
              <dd>
                {folio ?? "–"}
                <ReadTick slug={post.slug} />
                {post.published ? null : " · Draft"}
              </dd>
            </div>
            {post.readingTime ? (
              <div>
                <dt>Minutes</dt>
                <dd>{post.readingTime}</dd>
              </div>
            ) : null}
            {updated && post.updated ? (
              <div>
                <dt>Revised</dt>
                <dd>
                  <time dateTime={post.updated}>
                    {updated.day} {updated.year}
                  </time>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {hasContents ? (
          <EntryContents
            folioLabel={folioLabel}
            sections={sections}
            titleId="entry-title"
          />
        ) : null}

        <div className="entry-body">
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

        <footer className="entry-close">
          <p className="entry-signed">
            Entered by {siteConfig.author.name},{" "}
            <time dateTime={post.date}>
              {date.day} {date.year}
            </time>
            .
          </p>
          <MarkReadOnReach slug={post.slug} />
          <nav aria-label="Neighbouring entries">
            <ul className="entry-forward">
              <ForwardRow
                label="Brought forward"
                entry={broughtForward}
                emptyText="This is the first entry in the book."
              />
              <ForwardRow
                label="Carried forward"
                entry={carriedForward}
                emptyText="This is the latest entry. The next one goes here."
              />
            </ul>
          </nav>
          <p className="entry-feeds">
            New entries arrive by <a href="/rss.xml">RSS</a> or{" "}
            <a href="/feed.json">JSON Feed</a>.
          </p>
        </footer>
      </article>
    </>
  );
}
