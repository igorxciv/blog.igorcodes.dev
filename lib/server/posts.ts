import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { PostContent, PostFrontmatter, PostSummary } from "@/lib/types/posts";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");
const POST_EXTENSIONS = new Set([".md", ".mdx"]);

const dateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Must be a parseable date string.");

const arrayFromStringOrArraySchema = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
}, z.array(z.string().min(1)));

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  topics: arrayFromStringOrArraySchema,
  tags: arrayFromStringOrArraySchema,
  published: z.boolean().default(true),
  featured: z.boolean().optional(),
  readingTime: z.number().int().positive().optional(),
});

type PostQueryOptions = {
  includeDrafts?: boolean;
};

function resolveIncludeDrafts(includeDrafts?: boolean) {
  if (typeof includeDrafts === "boolean") {
    return includeDrafts;
  }

  return process.env.NODE_ENV !== "production";
}

function toSlug(filePath: string): string {
  return path
    .relative(POSTS_DIRECTORY, filePath)
    .replace(/\\/g, "/")
    .replace(/\.(md|mdx)$/i, "");
}

async function discoverPostFiles(directory: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return discoverPostFiles(fullPath);
        }

        if (entry.isFile() && POST_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
          return [fullPath];
        }

        return [];
      }),
    );

    return files.flat();
  } catch {
    return [];
  }
}

async function parsePostFile(filePath: string): Promise<PostContent> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(`Invalid frontmatter for ${toSlug(filePath)}: ${parsed.error.message}`);
  }

  const frontmatter: PostFrontmatter = parsed.data;
  const slug = toSlug(filePath);

  return {
    ...frontmatter,
    slug,
    body: content,
  };
}

async function resolvePostFilePath(slug: string): Promise<string | null> {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");

  for (const extension of POST_EXTENSIONS) {
    const candidate = path.join(POSTS_DIRECTORY, `${normalizedSlug}${extension}`);

    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep checking alternate extensions.
    }
  }

  return null;
}

function toPostSummary(post: PostContent): PostSummary {
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

export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostSummary[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  const files = await discoverPostFiles(POSTS_DIRECTORY);

  const posts = await Promise.all(files.map((file) => parsePostFile(file)));

  return posts
    .filter((post) => includeDrafts || post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => toPostSummary(post));
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
  return Array.from(new Set(posts.flatMap((post) => post.topics))).sort((a, b) => a.localeCompare(b));
}
