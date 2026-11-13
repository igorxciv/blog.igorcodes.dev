import { type Metadata } from "next";
import { PostLog } from "@/components/blog/post-log";
import { TopicList } from "@/components/blog/topic-list";
import {
  buildBlogJsonLd,
  buildCollectionPageJsonLd,
  jsonLdString,
} from "@/lib/seo";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";
import { formatIsoDate } from "@/lib/writing";

const BLOG_DESCRIPTION = siteConfig.description;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: siteConfig.name },
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      type: "website",
      url: "/blog",
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: BLOG_DESCRIPTION,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: BLOG_DESCRIPTION,
    },
  };
}

function lastUpdated(posts: { date: string; updated?: string }[]) {
  return posts
    .map((post) => formatIsoDate(post.updated ?? post.date))
    .sort()
    .at(-1);
}

export default async function BlogPage() {
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);
  const blogJsonLd = buildBlogJsonLd(posts);
  const collectionPageJsonLd = buildCollectionPageJsonLd(posts);
  const updated = lastUpdated(posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(collectionPageJsonLd),
        }}
      />

      <div className="page">
        <header className="page-intro">
          <h1>{siteConfig.tagline}</h1>
          <p>{siteConfig.intro}</p>
        </header>
        {posts.length > 0 ? (
          <>
            <PostLog posts={posts} label="All essays, newest first" />
            <p className="log-foot">
              {posts.length} {posts.length === 1 ? "essay" : "essays"}
              {updated ? (
                <>
                  {" "}
                  · updated <time dateTime={updated}>{updated}</time>
                </>
              ) : null}
            </p>
          </>
        ) : (
          <p className="page-empty">The first essay is on its way.</p>
        )}
        {topics.length > 0 ? (
          <TopicList posts={posts} topics={topics} current={null} />
        ) : null}
      </div>
    </>
  );
}
