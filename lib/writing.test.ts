import { describe, expect, it } from "vitest";
import { type PostSummary } from "@/lib/types/posts";
import {
  extractSections,
  formatIsoDate,
  formatLongDate,
  formatTopic,
  getAdjacentPosts,
  slugifyHeading,
  stripHeadingNumber,
} from "@/lib/writing";

function post(slug: string, date: string): PostSummary {
  return { slug, date, title: slug, topics: [], tags: [], published: true };
}

describe("formatTopic", () => {
  it("uppercases known acronyms and capitalises the rest", () => {
    expect(formatTopic("ai")).toBe("AI");
    expect(formatTopic("engineering")).toBe("Engineering");
    expect(formatTopic("frontend-work")).toBe("Frontend work");
  });
});

describe("getAdjacentPosts", () => {
  const posts = [
    post("2026/05/12/b", "2026-05-12"),
    post("2026/04/14/a", "2026-04-14"),
    post("2026/05/12/a", "2026-05-12"),
  ];

  it("finds the posts before and after in publishing order", () => {
    const middle = getAdjacentPosts(posts, "2026/05/12/a");
    expect(middle.previous?.slug).toBe("2026/04/14/a");
    expect(middle.next?.slug).toBe("2026/05/12/b");
  });

  it("returns null at either end and for unknown slugs", () => {
    expect(getAdjacentPosts(posts, "2026/04/14/a").previous).toBeNull();
    expect(getAdjacentPosts(posts, "2026/05/12/b").next).toBeNull();
    expect(getAdjacentPosts(posts, "missing")).toEqual({
      previous: null,
      next: null,
    });
  });
});

describe("dates", () => {
  it("prints the calendar date of an ISO value", () => {
    expect(formatIsoDate("2026-05-12")).toBe("2026-05-12");
    expect(formatIsoDate("2026-05-12T09:00:00Z")).toBe("2026-05-12");
    expect(formatIsoDate("soon")).toBe("soon");
  });

  it("writes a long date for prose", () => {
    expect(formatLongDate("2026-04-04")).toBe("4 Apr 2026");
    expect(formatLongDate("2026-12-31T23:00:00Z")).toBe("31 Dec 2026");
    expect(formatLongDate("soon")).toBe("soon");
  });
});

describe("headings", () => {
  it("strips authored numbering", () => {
    expect(stripHeadingNumber("1. Problem: one sentence")).toBe(
      "Problem: one sentence",
    );
    expect(stripHeadingNumber("2026 roadmap")).toBe("2026 roadmap");
  });

  it("slugifies curly quotes, punctuation, and authored numbers", () => {
    expect(slugifyHeading("The “paste and pray” loop")).toBe(
      "the-paste-and-pray-loop",
    );
    expect(slugifyHeading("1. Problem: one sentence")).toBe(
      "problem-one-sentence",
    );
  });
});

describe("extractSections", () => {
  it("reads h1-h3 headings as written and skips fenced code", () => {
    const body = [
      "# Opening",
      "## First",
      "text",
      "```md",
      "## Not a heading",
      "```",
      "### 1. Try it *manually*",
      "## [Linked](https://example.com) `code`",
    ].join("\n");

    expect(extractSections(body)).toEqual([
      { depth: 2, id: "opening", title: "Opening" },
      { depth: 2, id: "first", title: "First" },
      { depth: 3, id: "try-it-manually", title: "1. Try it manually" },
      { depth: 2, id: "linked-code", title: "Linked code" },
    ]);
  });
});
