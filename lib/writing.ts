// Pure display helpers for the blog: dates, topic labels, neighbouring posts,
// and the section outline of a post. No server-only imports, so client
// components and tests can use them too.

import { type PostSummary } from "@/lib/types/posts";

export type PostSection = {
  depth: 2 | 3;
  id: string;
  /** Heading text as the author wrote it, Markdown syntax removed. */
  title: string;
};

const ACRONYM_TOPICS: Record<string, string> = {
  ai: "AI",
  api: "API",
  css: "CSS",
  ui: "UI",
  ux: "UX",
};

/** "ai" -> "AI", "engineering" -> "Engineering", "frontend-work" -> "Frontend work". */
export function formatTopic(topic: string): string {
  const known = ACRONYM_TOPICS[topic.toLowerCase()];
  if (known) {
    return known;
  }
  const spaced = topic.replace(/[-_]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Oldest first; posts on the same date are ordered by slug so order stays deterministic. */
function byPublishOrder(a: PostSummary, b: PostSummary): number {
  return a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug);
}

/** The posts published just before and just after this one. */
export function getAdjacentPosts<T extends PostSummary>(
  posts: T[],
  slug: string,
): { previous: T | null; next: T | null } {
  const ordered = [...posts].sort(byPublishOrder);
  const index = ordered.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
  };
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2026-05-12T09:00:00Z" -> "2026-05-12": the calendar date, as the log prints it. */
export function formatIsoDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}/.exec(value)?.[0] ?? value;
}

/** "2026-05-12" -> "12 May 2026", for prose ("Written by Igor, 12 May 2026"). */
export function formatLongDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match?.[1] || !match[3] || !month) {
    return value;
  }
  return `${Number(match[3])} ${month} ${match[1]}`;
}

/** "Problem: one sentence" from "1. Problem: one sentence"; used for stable heading ids. */
export function stripHeadingNumber(text: string): string {
  return text.replace(/^\s*\d+[.)]\s+/, "");
}

/** Heading anchor ids. Authored numbering is dropped so renumbering never breaks a link. */
export function slugifyHeading(text: string): string {
  return stripHeadingNumber(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'"“”`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Plain heading text from Markdown source: drops emphasis, code ticks, and link syntax. */
function plainHeadingText(source: string): string {
  return source
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

/**
 * Reads the `#`, `##` and `###` headings of an MDX body (outside fenced code)
 * for the post's contents list. Ids match the ones the MDX heading component
 * derives from the same text.
 */
export function extractSections(body: string): PostSection[] {
  const sections: PostSection[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match?.[1] || !match[2]) {
      continue;
    }
    // A content-level `#` renders as an <h2> (the page owns the only <h1>).
    const depth = match[1].length === 3 ? 3 : 2;
    const title = plainHeadingText(match[2]);
    sections.push({ depth, id: slugifyHeading(title), title });
  }

  return sections;
}
