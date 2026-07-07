import { siteConfig, toAbsoluteUrl } from "@/lib/site";
import { type PostContent, type PostSummary } from "@/lib/types/posts";

// AEO (Answer Engine Optimization) helpers. These produce plain-text/Markdown
// representations of the site for AI agents and answer engines: an llms.txt
// index (https://llmstxt.org/), a single-file corpus, and per-post Markdown
// mirrors. Kept dependency-free and pure so they unit-test without server-only.

// Path of a post's clean-Markdown mirror. See app/api/md/[...slug]/route.ts.
export function postMarkdownPath(slug: string): string {
  return `/api/md/${slug}`;
}

function metaLines(post: PostSummary): string[] {
  const lines = [
    `- Canonical: ${toAbsoluteUrl(`/blog/${post.slug}`)}`,
    `- Published: ${post.date}`,
  ];
  if (post.updated) {
    lines.push(`- Updated: ${post.updated}`);
  }
  if (post.topics.length > 0) {
    lines.push(`- Topics: ${post.topics.join(", ")}`);
  }
  if (post.tags.length > 0) {
    lines.push(`- Tags: ${post.tags.join(", ")}`);
  }
  if (post.readingTime) {
    lines.push(`- Reading time: ${post.readingTime} min`);
  }
  return lines;
}

// One post as a self-contained Markdown document: title, description, a compact
// metadata block, then the raw MDX body. Interactive components appear as their
// JSX source (agents read the surrounding prose fine, same as a `.md` mirror on
// docs sites), so no lossy component stripping is applied.
export function postToMarkdown(post: PostContent): string {
  const parts = [`# ${post.title}`];
  if (post.description) {
    parts.push(`> ${post.description}`);
  }
  parts.push(metaLines(post).join("\n"));
  parts.push("---");
  parts.push(post.body.trim());
  return `${parts.join("\n\n")}\n`;
}

// llms.txt index: H1 + summary blockquote, a short guidance paragraph, then a
// linked list of every published post with its Markdown mirror.
export function buildLlmsIndex(posts: PostSummary[]): string {
  const header = [
    `# ${siteConfig.name}`,
    `> ${siteConfig.description}`,
    [
      "This is an AI-friendly index of the site (see https://llmstxt.org/).",
      "Every post below links to its human page and a clean Markdown mirror.",
      `The full corpus in one file is at ${toAbsoluteUrl("/llms-full.txt")}.`,
    ].join(" "),
  ];

  const items = posts.map((post) => {
    const page = toAbsoluteUrl(`/blog/${post.slug}`);
    const markdown = toAbsoluteUrl(postMarkdownPath(post.slug));
    const description = post.description ? `: ${post.description}` : "";
    return `- [${post.title}](${page})${description} — Markdown: ${markdown}`;
  });

  const postsSection =
    items.length > 0
      ? `## Posts\n\n${items.join("\n")}`
      : "## Posts\n\n_No published posts yet._";

  return `${[header.join("\n\n"), postsSection].join("\n\n")}\n`;
}

// llms-full.txt: the whole published corpus concatenated as Markdown, for agents
// that prefer a single fetch over crawling every page.
export function buildLlmsFull(posts: PostContent[]): string {
  const header = [
    `# ${siteConfig.name} — full content`,
    `> ${siteConfig.description}`,
    `Generated for AI agents. ${posts.length} published post(s).`,
  ].join("\n\n");

  return `${[header, ...posts.map(postToMarkdown)].join("\n\n---\n\n")}\n`;
}
