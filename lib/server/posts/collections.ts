import type { PostContent } from "@/lib/types/posts";

export function sortPostsByDateDescending(posts: PostContent[]) {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function filterPublishedPosts(posts: PostContent[], includeDrafts: boolean) {
  return includeDrafts ? posts : posts.filter((post) => post.published);
}

export function collectTopics(posts: { topics: string[] }[]) {
  return Array.from(new Set(posts.flatMap((post) => post.topics))).sort((a, b) => a.localeCompare(b));
}
