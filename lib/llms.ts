import { siteConfig, toAbsoluteUrl } from "@/lib/site";
import { type PostContent, type PostSummary } from "@/lib/types/posts";

// AEO (Answer Engine Optimization) helpers. These produce plain-text/Markdown
// representations of the site for AI agents and answer engines: an llms.txt
// index (https://llmstxt.org/), a single-file corpus, and per-post Markdown
// mirrors. Kept dependency-free and pure so they unit-test without server-only.

// Path of a post's Markdown mirror. See app/api/md/[...slug]/route.ts.
export function postMarkdownPath(slug: string): string {
  return `/api/md/${slug}`;
}

// Escape the `[` / `]` that would otherwise break Markdown link-text syntax.
function escapeLinkText(text: string): string {
  return text.replace(/[[\]]/g, "\\$&");
}

// Collapse any run of whitespace (incl. newlines from multiline YAML) to a
// single space so a value stays on one line inside a list item.
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
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

// One post as a self-contained document: title, description, a compact metadata
// block, then the post's Markdown/MDX source. Interactive components are left as
// their JSX source rather than stripped — that keeps prop-encoded data (tables,
// process flows) intact and information-complete for agents, the same way docs
// platforms serve `.mdx` source. No leading `---` before the body so the corpus
// join delimiter in buildLlmsFull stays unambiguous.
export function postToMarkdown(post: PostContent): string {
  const parts = [`# ${post.title}`];
  if (post.description) {
    parts.push(`> ${oneLine(post.description)}`);
  }
  parts.push(metaLines(post).join("\n"));
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
    const title = escapeLinkText(post.title);
    const description = post.description
      ? `: ${oneLine(post.description)}`
      : "";
    return `- [${title}](${page})${description} — Markdown: ${markdown}`;
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
