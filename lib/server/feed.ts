import { getAllPosts } from "@/lib/server/posts";
import { siteConfig, toAbsoluteUrl } from "@/lib/site";
import type { PostSummary } from "@/lib/types/posts";

type FeedItem = {
  id: string;
  url: string;
  title: string;
  summary: string;
  publishedAt: string;
  modifiedAt: string;
  tags: string[];
};

type FeedManifest = {
  title: string;
  homePageUrl: string;
  rssUrl: string;
  jsonUrl: string;
  description: string;
  language: string;
  updatedAt: string;
  items: FeedItem[];
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRssLanguage(locale: string) {
  return locale.replace("_", "-").toLowerCase();
}

function toFeedSummary(post: Pick<PostSummary, "description">) {
  if (post.description?.trim()) {
    return post.description.trim();
  }

  return "Read the full post on the site.";
}

async function getFeedItems(): Promise<FeedItem[]> {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    id: toAbsoluteUrl(`/blog/${post.slug}`),
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    title: post.title,
    summary: toFeedSummary(post),
    publishedAt: new Date(post.date).toISOString(),
    modifiedAt: new Date(post.updated ?? post.date).toISOString(),
    tags: [...post.topics, ...post.tags],
  }));
}

export async function getFeedManifest(): Promise<FeedManifest> {
  const items = await getFeedItems();

  return {
    title: siteConfig.name,
    homePageUrl: toAbsoluteUrl("/blog"),
    rssUrl: toAbsoluteUrl("/rss.xml"),
    jsonUrl: toAbsoluteUrl("/feed.json"),
    description: siteConfig.description,
    language: toRssLanguage(siteConfig.locale),
    updatedAt: items[0]?.modifiedAt ?? new Date().toISOString(),
    items,
  };
}

export async function buildJsonFeed() {
  const feed = await getFeedManifest();

  return {
    version: "https://jsonfeed.org/version/1.1",
    title: feed.title,
    home_page_url: feed.homePageUrl,
    feed_url: feed.jsonUrl,
    description: feed.description,
    language: feed.language,
    authors: [{ name: siteConfig.author.name }],
    items: feed.items.map((item) => ({
      id: item.id,
      url: item.url,
      title: item.title,
      summary: item.summary,
      content_text: item.summary,
      date_published: item.publishedAt,
      date_modified: item.modifiedAt,
      tags: item.tags,
      authors: [{ name: siteConfig.author.name }],
    })),
  };
}

export async function buildRssFeed() {
  const feed = await getFeedManifest();

  const itemsXml = feed.items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.id)}</guid>
      <description>${escapeXml(item.summary)}</description>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
${item.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(feed.homePageUrl)}</link>
    <description>${escapeXml(feed.description)}</description>
    <language>${escapeXml(feed.language)}</language>
    <lastBuildDate>${new Date(feed.updatedAt).toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${escapeXml(feed.rssUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;
}
