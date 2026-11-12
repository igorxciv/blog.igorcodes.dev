// Pure helpers for the day-book presentation: folio numbers, ledger dates,
// volumes, section outlines, and display labels. No server-only imports, so
// client components and tests can use them too.

import { type PostSummary } from "@/lib/types/posts";

export type EntrySection = {
  depth: 2 | 3;
  id: string;
  /** Display number, e.g. "4" or "7.2". */
  number: string;
  title: string;
  /** Approximate reading minute at which the section starts (for the contents leaders). */
  startMinute: number;
};

const WORDS_PER_MINUTE = 230;

function countWords(line: string): number {
  return line.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

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
function byEntryOrder(a: PostSummary, b: PostSummary): number {
  return a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug);
}

/** Folios follow the order entries were made: the oldest post is folio 1. */
export function getFolioNumbers(posts: PostSummary[]): Map<string, number> {
  const ordered = [...posts].sort(byEntryOrder);
  return new Map(ordered.map((post, index) => [post.slug, index + 1]));
}

/**
 * The entries either side of one in the book: "brought forward" is the entry
 * before it, "carried forward" the entry after it.
 */
export function getAdjacentEntries<T extends PostSummary>(
  posts: T[],
  slug: string,
): { broughtForward: T | null; carriedForward: T | null } {
  const ordered = [...posts].sort(byEntryOrder);
  const index = ordered.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { broughtForward: null, carriedForward: null };
  }
  return {
    broughtForward: ordered[index - 1] ?? null,
    carriedForward: ordered[index + 1] ?? null,
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

/** "2026-05-12" -> { day: "12 May", year: "2026" }, the way a ledger's date column reads. */
export function formatLedgerDate(isoDate: string): {
  day: string;
  year: string;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match?.[1] || !match[3] || !month) {
    return { day: isoDate, year: "" };
  }
  return { day: `${Number(match[3])} ${month}`, year: match[1] };
}

const ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(value: number): string {
  let rest = Math.max(1, Math.floor(value));
  let out = "";
  for (const [amount, numeral] of ROMAN) {
    while (rest >= amount) {
      out += numeral;
      rest -= amount;
    }
  }
  return out;
}

/**
 * One volume per calendar year, counted from the first entry: the label reads
 * "Vol. II · 2027" in the book's second year. Null for an empty book.
 */
export function getVolume(
  posts: PostSummary[],
): { numeral: string; year: string } | null {
  const years = posts
    .map((post) => Number(post.date.slice(0, 4)))
    .filter((year) => Number.isFinite(year) && year > 0);
  if (years.length === 0) {
    return null;
  }
  const first = Math.min(...years);
  const latest = Math.max(...years);
  return { numeral: toRoman(latest - first + 1), year: String(latest) };
}

/** "Vol. I · 2026" for the label on the book's cloth; null for an empty book. */
export function getVolumeLabel(posts: PostSummary[]): string | null {
  const volume = getVolume(posts);
  return volume ? `Vol. ${volume.numeral} · ${volume.year}` : null;
}

/** Authored headings like "1. Problem: ..." drop the manual number; the entry numbers sections itself. */
export function stripHeadingNumber(text: string): string {
  return text.replace(/^\s*\d+[.)]\s+/, "");
}

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
 * Reads the `##` and `###` headings of an MDX body (outside fenced code) and
 * numbers them the way the rendered entry does: h2 -> "n", h3 -> "n.m".
 * The article CSS uses counters over the same headings, so the two agree as
 * long as headings are top-level Markdown headings.
 */
export function extractSections(body: string): EntrySection[] {
  const sections: EntrySection[] = [];
  let inFence = false;
  let h2 = 0;
  let h3 = 0;
  let wordsBefore = 0;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      wordsBefore += countWords(line);
      continue;
    }
    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match?.[1] || !match[2]) {
      // JSX tags and attributes are not read; count only prose-looking lines.
      if (!/^\s*<\/?[A-Za-z]/.test(line)) {
        wordsBefore += countWords(line);
      }
      continue;
    }
    // A content-level `#` renders as an <h2> (the page owns the only <h1>).
    const depth = match[1].length === 3 ? 3 : 2;
    const title = stripHeadingNumber(plainHeadingText(match[2]));

    if (depth === 2) {
      h2 += 1;
      h3 = 0;
    } else {
      h3 += 1;
    }

    sections.push({
      depth,
      // Must match the id the MDX heading component derives from the same text.
      id: slugifyHeading(title),
      number: depth === 2 ? String(h2) : `${h2}.${h3}`,
      title,
      startMinute: Math.floor(wordsBefore / WORDS_PER_MINUTE),
    });
    wordsBefore += countWords(title);
  }

  return sections;
}
