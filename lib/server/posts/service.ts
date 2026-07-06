import { unstable_cache } from "next/cache";
import {
  collectTopics,
  filterPublishedPosts,
  sortPostsByDateDescending,
} from "@/lib/server/posts/collections";
import { discoverPostFiles } from "@/lib/server/posts/filesystem";
import { toPostSummary } from "@/lib/server/posts/mappers";
import { resolveIncludeDrafts } from "@/lib/server/posts/options";
import { parsePostFile } from "@/lib/server/posts/parser";
import { normalizeSlug } from "@/lib/server/posts/slug";
import { type PostQueryOptions } from "@/lib/server/posts/types";
import { type PostContent, type PostSummary } from "@/lib/types/posts";

// Each query has one implementation (compute*) wrapped once by unstable_cache.
// In dev we bypass the cache so draft/content edits show without a rebuild; in
// production the cached variant is used. This avoids the previous copy-pasted
// cached/uncached pairs that could silently drift apart.
const shouldBypassCache = process.env.NODE_ENV !== "production";

// Scope the Vercel Data Cache to the current deployment so cached post content
// does not persist across deployments and serve stale content.
const deployId = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

async function computeAllPostContent(): Promise<PostContent[]> {
  const files = await discoverPostFiles();
  const results = await Promise.allSettled(
    files.map((file) => parsePostFile(file)),
  );

  const posts: PostContent[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      posts.push(result.value);
      return;
    }

    const message =
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
    console.error(`Failed to parse post file ${files[index]}: ${message}`);
  });

  return posts;
}

const loadAllPostContentCached = unstable_cache(computeAllPostContent, [
  "posts:content",
  deployId,
]);

function loadAllPostContent(): Promise<PostContent[]> {
  return shouldBypassCache
    ? computeAllPostContent()
    : loadAllPostContentCached();
}

async function computeAllPosts(includeDrafts: boolean): Promise<PostSummary[]> {
  const posts = await loadAllPostContent();
  return sortPostsByDateDescending(
    filterPublishedPosts(posts, includeDrafts),
  ).map((post) => toPostSummary(post));
}

const getAllPostsCached = unstable_cache(computeAllPosts, [
  "posts:summaries",
  deployId,
]);

async function computePostBySlug(
  slug: string,
  includeDrafts: boolean,
): Promise<PostContent | null> {
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

const getPostBySlugCached = unstable_cache(computePostBySlug, [
  "posts:by-slug",
  deployId,
]);

async function computeAllTopics(includeDrafts: boolean): Promise<string[]> {
  const posts = await computeAllPosts(includeDrafts);
  return collectTopics(posts);
}

const getAllTopicsCached = unstable_cache(computeAllTopics, [
  "posts:topics",
  deployId,
]);

export async function getAllPosts(
  options: PostQueryOptions = {},
): Promise<PostSummary[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return shouldBypassCache
    ? computeAllPosts(includeDrafts)
    : getAllPostsCached(includeDrafts);
}

export async function getPostBySlug(
  slug: string,
  options: PostQueryOptions = {},
): Promise<PostContent | null> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return shouldBypassCache
    ? computePostBySlug(slug, includeDrafts)
    : getPostBySlugCached(slug, includeDrafts);
}

export async function getAllTopics(
  options: PostQueryOptions = {},
): Promise<string[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return shouldBypassCache
    ? computeAllTopics(includeDrafts)
    : getAllTopicsCached(includeDrafts);
}
