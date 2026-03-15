import type { PostContent, PostSummary } from "@/lib/types/posts";

export function toPostSummary(post: PostContent): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    updated: post.updated,
    topics: post.topics,
    tags: post.tags,
    published: post.published,
    featured: post.featured,
    readingTime: post.readingTime,
  };
}
