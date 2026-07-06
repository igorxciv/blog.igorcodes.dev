import { describe, expect, it } from "vitest";
import {
  collectTopics,
  filterPublishedPosts,
  sortPostsByDateDescending,
} from "@/lib/server/posts/helpers";
import { estimateReadingTime } from "@/lib/server/posts/parser";
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
    body: "",
    ...overrides,
  };
}

describe("collectTopics", () => {
  it("returns an empty list for no posts", () => {
    expect(collectTopics([])).toEqual([]);
  });

  it("dedupes topics across posts", () => {
    const result = collectTopics([
      { topics: ["react", "ai"] },
      { topics: ["react", "css"] },
    ]);
    expect(result).toEqual(["ai", "css", "react"]);
  });

  it("sorts topics with locale comparison", () => {
    expect(collectTopics([{ topics: ["Zebra", "apple", "Banana"] }])).toEqual([
      "apple",
      "Banana",
      "Zebra",
    ]);
  });
});

describe("sortPostsByDateDescending", () => {
  it("orders posts newest first without mutating the input", () => {
    const input = [
      post({ slug: "old", date: "2026-01-01" }),
      post({ slug: "new", date: "2026-03-01" }),
      post({ slug: "mid", date: "2026-02-01" }),
    ];
    const result = sortPostsByDateDescending(input);
    expect(result.map((p) => p.slug)).toEqual(["new", "mid", "old"]);
    expect(input.map((p) => p.slug)).toEqual(["old", "new", "mid"]);
  });

  it("handles an empty list", () => {
    expect(sortPostsByDateDescending([])).toEqual([]);
  });
});

describe("filterPublishedPosts", () => {
  const posts = [
    post({ slug: "published", published: true }),
    post({ slug: "draft", published: false }),
  ];

  it("drops drafts when includeDrafts is false", () => {
    expect(filterPublishedPosts(posts, false).map((p) => p.slug)).toEqual([
      "published",
    ]);
  });

  it("keeps drafts when includeDrafts is true", () => {
    expect(filterPublishedPosts(posts, true).map((p) => p.slug)).toEqual([
      "published",
      "draft",
    ]);
  });
});

describe("estimateReadingTime", () => {
  it("returns a 1-minute floor when there are no words", () => {
    expect(estimateReadingTime("")).toBe(1);
    expect(estimateReadingTime("   ")).toBe(1);
  });

  it("rounds words at ~225 wpm", () => {
    expect(estimateReadingTime("word ".repeat(225))).toBe(1);
    expect(estimateReadingTime("word ".repeat(400))).toBe(2);
    expect(estimateReadingTime("word ".repeat(675))).toBe(3);
  });
});
