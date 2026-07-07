import { describe, expect, it } from "vitest";
import {
  buildLlmsFull,
  buildLlmsIndex,
  postMarkdownPath,
  postToMarkdown,
} from "@/lib/llms";
import { type PostContent } from "@/lib/types/posts";

function post(
  overrides: Partial<PostContent> & Pick<PostContent, "slug">,
): PostContent {
  return {
    title: overrides.slug,
    date: "2026-01-01",
    topics: [],
    tags: [],
    published: true,
    body: "Body prose.",
    ...overrides,
  };
}

describe("postMarkdownPath", () => {
  it("mirrors a post slug under /api/md", () => {
    expect(postMarkdownPath("2026/01/01/hello")).toBe(
      "/api/md/2026/01/01/hello",
    );
  });
});

describe("postToMarkdown", () => {
  it("renders title, description, metadata, and body", () => {
    const md = postToMarkdown(
      post({
        slug: "2026/01/01/hello",
        title: "Hello World",
        description: "A short intro.",
        topics: ["architecture"],
        tags: ["a", "b"],
        readingTime: 4,
        body: "The **body**.",
      }),
    );

    expect(md).toContain("# Hello World");
    expect(md).toContain("> A short intro.");
    expect(md).toContain(
      "- Canonical: https://blog.igorcodes.dev/blog/2026/01/01/hello",
    );
    expect(md).toContain("- Published: 2026-01-01");
    expect(md).toContain("- Topics: architecture");
    expect(md).toContain("- Tags: a, b");
    expect(md).toContain("- Reading time: 4 min");
    expect(md).toContain("The **body**.");
  });

  it("omits optional metadata that is absent", () => {
    const md = postToMarkdown(post({ slug: "x" }));
    expect(md).not.toContain("Updated:");
    expect(md).not.toContain("Topics:");
    expect(md).not.toContain("Tags:");
    expect(md).not.toContain("Reading time:");
  });
});

describe("buildLlmsIndex", () => {
  it("lists each post with page and markdown links", () => {
    const index = buildLlmsIndex([
      post({ slug: "2026/01/01/a", title: "Post A", description: "First." }),
    ]);

    expect(index).toContain("# Engineering Notes");
    expect(index).toContain("/llms-full.txt");
    expect(index).toContain(
      "- [Post A](https://blog.igorcodes.dev/blog/2026/01/01/a): First. — Markdown: https://blog.igorcodes.dev/api/md/2026/01/01/a",
    );
  });

  it("handles an empty corpus", () => {
    expect(buildLlmsIndex([])).toContain("_No published posts yet._");
  });
});

describe("buildLlmsFull", () => {
  it("concatenates every post and reports the count", () => {
    const full = buildLlmsFull([
      post({ slug: "a", title: "Post A" }),
      post({ slug: "b", title: "Post B" }),
    ]);

    expect(full).toContain("2 published post(s).");
    expect(full).toContain("# Post A");
    expect(full).toContain("# Post B");
    expect(full).toContain("\n---\n");
  });
});
