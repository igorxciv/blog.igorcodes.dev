import { collectTopics, filterPublishedPosts, sortPostsByDateDescending } from "@/lib/server/posts/collections";
import { discoverPostFiles, resolvePostFilePath } from "@/lib/server/posts/filesystem";
import { toPostSummary } from "@/lib/server/posts/mappers";
import { resolveIncludeDrafts } from "@/lib/server/posts/options";
import { parsePostFile } from "@/lib/server/posts/parser";
import type { PostQueryOptions } from "@/lib/server/posts/types";
import type { PostContent, PostSummary } from "@/lib/types/posts";

async function loadAllPostContent(): Promise<PostContent[]> {
  const files = await discoverPostFiles();
  return Promise.all(files.map((file) => parsePostFile(file)));
}

export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostSummary[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  const posts = await loadAllPostContent();

  return sortPostsByDateDescending(filterPublishedPosts(posts, includeDrafts)).map((post) => toPostSummary(post));
}

export async function getPostBySlug(slug: string, options: PostQueryOptions = {}): Promise<PostContent | null> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  const filePath = await resolvePostFilePath(slug);

  if (!filePath) {
    return null;
  }

  const post = await parsePostFile(filePath);

  if (!includeDrafts && !post.published) {
    return null;
  }

  return post;
}

export async function getAllTopics(options: PostQueryOptions = {}): Promise<string[]> {
  const posts = await getAllPosts(options);
  return collectTopics(posts);
}
