import { unstable_cache } from "next/cache";
import { collectTopics, filterPublishedPosts, sortPostsByDateDescending } from "@/lib/server/posts/collections";
import { discoverPostFiles } from "@/lib/server/posts/filesystem";
import { toPostSummary } from "@/lib/server/posts/mappers";
import { resolveIncludeDrafts } from "@/lib/server/posts/options";
import { parsePostFile } from "@/lib/server/posts/parser";
import { normalizeSlug } from "@/lib/server/posts/slug";
import type { PostQueryOptions } from "@/lib/server/posts/types";
import type { PostContent, PostSummary } from "@/lib/types/posts";

const loadAllPostContent = unstable_cache(async (): Promise<PostContent[]> => {
  const files = await discoverPostFiles();
  return Promise.all(files.map((file) => parsePostFile(file)));
}, ["posts:content"]);

const getAllPostsCached = unstable_cache(async (includeDrafts: boolean): Promise<PostSummary[]> => {
  const posts = await loadAllPostContent();

  return sortPostsByDateDescending(filterPublishedPosts(posts, includeDrafts)).map((post) => toPostSummary(post));
}, ["posts:summaries"]);

const getAllTopicsCached = unstable_cache(async (includeDrafts: boolean): Promise<string[]> => {
  const posts = await getAllPostsCached(includeDrafts);
  return collectTopics(posts);
}, ["posts:topics"]);

const getPostBySlugCached = unstable_cache(async (slug: string, includeDrafts: boolean): Promise<PostContent | null> => {
  const normalizedSlug = normalizeSlug(slug);
  const posts = await loadAllPostContent();
  const post = posts.find((item) => item.slug === normalizedSlug);

  if (!post) {
    return null;
  }

  if (!includeDrafts && !post.published) {
    return null;
  }

  return post;
}, ["posts:by-slug"]);

export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostSummary[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return getAllPostsCached(includeDrafts);
}

export async function getPostBySlug(slug: string, options: PostQueryOptions = {}): Promise<PostContent | null> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return getPostBySlugCached(slug, includeDrafts);
}

export async function getAllTopics(options: PostQueryOptions = {}): Promise<string[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return getAllTopicsCached(includeDrafts);
}
