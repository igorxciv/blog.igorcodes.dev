import { cache } from "react";
import { collectTopics, filterPublishedPosts, sortPostsByDateDescending } from "@/lib/server/posts/collections";
import { discoverPostFiles, resolvePostFilePath } from "@/lib/server/posts/filesystem";
import { toPostSummary } from "@/lib/server/posts/mappers";
import { resolveIncludeDrafts } from "@/lib/server/posts/options";
import { parsePostFile } from "@/lib/server/posts/parser";
import type { PostQueryOptions } from "@/lib/server/posts/types";
import type { PostContent, PostSummary } from "@/lib/types/posts";

const loadAllPostContent = cache(async (): Promise<PostContent[]> => {
  const files = await discoverPostFiles();
  return Promise.all(files.map((file) => parsePostFile(file)));
});

const getAllPostsCached = cache(async (includeDrafts: boolean): Promise<PostSummary[]> => {
  const posts = await loadAllPostContent();

  return sortPostsByDateDescending(filterPublishedPosts(posts, includeDrafts)).map((post) => toPostSummary(post));
});

const getPostBySlugCached = cache(async (slug: string, includeDrafts: boolean): Promise<PostContent | null> => {
  const filePath = await resolvePostFilePath(slug);

  if (!filePath) {
    return null;
  }

  const post = await parsePostFile(filePath);

  if (!includeDrafts && !post.published) {
    return null;
  }

  return post;
});

export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostSummary[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return getAllPostsCached(includeDrafts);
}

export async function getPostBySlug(slug: string, options: PostQueryOptions = {}): Promise<PostContent | null> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return getPostBySlugCached(slug, includeDrafts);
}

export async function getAllTopics(options: PostQueryOptions = {}): Promise<string[]> {
  const posts = await getAllPosts(options);
  return collectTopics(posts);
}
