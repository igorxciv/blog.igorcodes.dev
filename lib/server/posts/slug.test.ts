import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  normalizeSlug,
  POSTS_DIRECTORY,
  toSlug,
} from "@/lib/server/posts/helpers";

describe("normalizeSlug", () => {
  it("strips leading and trailing slashes", () => {
    expect(normalizeSlug("/blog/post/")).toBe("blog/post");
    expect(normalizeSlug("///a///")).toBe("a");
  });

  it("leaves an already-clean slug unchanged", () => {
    expect(normalizeSlug("2026/01/02/x")).toBe("2026/01/02/x");
  });
});

describe("toSlug", () => {
  it("derives a slug relative to the posts dir without extension", () => {
    const file = path.join(POSTS_DIRECTORY, "2026", "01", "02", "my-post.mdx");
    expect(toSlug(file)).toBe("2026/01/02/my-post");
  });

  it("strips the extension case-insensitively", () => {
    const file = path.join(POSTS_DIRECTORY, "hello.MD");
    expect(toSlug(file)).toBe("hello");
  });
});
