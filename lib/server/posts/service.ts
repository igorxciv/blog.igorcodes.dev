import { unstable_cache } from "next/cache";
import { collectTopics, filterPublishedPosts, sortPostsByDateDescending } from "@/lib/server/posts/collections";
import { discoverPostFiles } from "@/lib/server/posts/filesystem";
import { toPostSummary } from "@/lib/server/posts/mappers";
import { resolveIncludeDrafts } from "@/lib/server/posts/options";
import { parsePostFile } from "@/lib/server/posts/parser";
import { normalizeSlug } from "@/lib/server/posts/slug";
import type { PostQueryOptions } from "@/lib/server/posts/types";
import type { PostContent, PostSummary } from "@/lib/types/posts";

const shouldBypassCache = process.env.NODE_ENV !== "production";

async function loadAllPostContentUncached(): Promise<PostContent[]> {
  const files = await discoverPostFiles();
  return Promise.all(files.map((file) => parsePostFile(file)));
}

const loadAllPostContentCached = unstable_cache(async (): Promise<PostContent[]> => {
  return loadAllPostContentUncached();
}, ["posts:content"]);

async function loadAllPostContent(): Promise<PostContent[]> {
  return shouldBypassCache ? loadAllPostContentUncached() : loadAllPostContentCached();
}

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
  if (shouldBypassCache) {
    const posts = await loadAllPostContent();
    return sortPostsByDateDescending(filterPublishedPosts(posts, includeDrafts)).map((post) => toPostSummary(post));
  }

  return getAllPostsCached(includeDrafts);
}

export async function getPostBySlug(slug: string, options: PostQueryOptions = {}): Promise<PostContent | null> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  if (shouldBypassCache) {
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
  }

  return getPostBySlugCached(slug, includeDrafts);
}

export async function getAllTopics(options: PostQueryOptions = {}): Promise<string[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  if (shouldBypassCache) {
    const posts = await getAllPosts({ includeDrafts });
    return collectTopics(posts);
  }

  return getAllTopicsCached(includeDrafts);
}
