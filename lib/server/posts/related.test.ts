import { describe, expect, it } from "vitest";
import { getRelatedPosts } from "@/lib/server/posts/related";
import { type PostSummary } from "@/lib/types/posts";

function post(
  overrides: Partial<PostSummary> & Pick<PostSummary, "slug">,
): PostSummary {
  return {
    title: overrides.slug,
    date: "2026-01-01",
    topics: [],
    tags: [],
    published: true,
    ...overrides,
  };
}

const source = post({
  slug: "src",
  topics: ["react"],
  tags: ["hooks", "perf"],
});

describe("getRelatedPosts", () => {
  it("excludes the source post", () => {
    const result = getRelatedPosts(source, [
      source,
      post({ slug: "a", topics: ["react"] }),
    ]);
    expect(result.map((item) => item.slug)).not.toContain("src");
  });

  it("ranks a shared topic (x3) above shared tags (x1)", () => {
    const byTopic = post({ slug: "topic", topics: ["react"] });
    const byTags = post({ slug: "tags", tags: ["hooks", "perf"] });
    const result = getRelatedPosts(source, [byTags, byTopic]);
    expect(result[0]?.slug).toBe("topic");
  });

  it("breaks score ties by the most recent date", () => {
    const older = post({
      slug: "older",
      topics: ["react"],
      date: "2026-01-01",
    });
    const newer = post({
      slug: "newer",
      topics: ["react"],
      date: "2026-06-01",
    });
    const result = getRelatedPosts(source, [older, newer]);
    expect(result[0]?.slug).toBe("newer");
  });

  it("never includes a draft candidate in the results", () => {
    const draft = post({
      slug: "draft",
      topics: ["react"],
      tags: ["hooks", "perf"],
      published: false,
    });
    const result = getRelatedPosts(source, [
      draft,
      post({ slug: "published", topics: ["react"] }),
    ]);
    expect(result.map((item) => item.slug)).not.toContain("draft");
  });

  it("fills with unrelated posts up to the limit", () => {
    const related = post({ slug: "rel", topics: ["react"] });
    const result = getRelatedPosts(
      source,
      [related, post({ slug: "u1" }), post({ slug: "u2" })],
      2,
    );
    expect(result).toHaveLength(2);
    expect(result[0]?.slug).toBe("rel");
  });
});
