import type { PostContent, PostSummary } from "@/lib/types/posts";
import { siteConfig, toAbsoluteUrl } from "@/lib/site";

type JsonLd = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

function isoDate(date: string) {
  return new Date(date).toISOString();
}

export function buildWebsiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: "en",
  };
}

export function buildPersonJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
  };
}

export function buildBlogJsonLd(posts: PostSummary[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: siteConfig.name,
    description: siteConfig.description,
    url: toAbsoluteUrl("/blog"),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description ?? siteConfig.description,
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      datePublished: isoDate(post.date),
      dateModified: isoDate(post.updated ?? post.date),
    })),
  };
}

export function buildCollectionPageJsonLd(posts: PostSummary[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} Blog Archive`,
    description: "Browse published blog posts and filter them by topic.",
    url: toAbsoluteUrl("/blog"),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toAbsoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };
}

export function buildBreadcrumbJsonLd(post: PostContent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: toAbsoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: toAbsoluteUrl(`/blog/${post.slug}`),
      },
    ],
  };
}

export function buildArticleJsonLd(post: PostContent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? siteConfig.description,
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.updated ?? post.date),
    articleSection: post.topics[0],
    keywords: post.tags.join(", "),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}
