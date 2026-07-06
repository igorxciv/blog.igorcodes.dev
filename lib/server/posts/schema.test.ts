import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/server/posts/schema";

const base = {
  title: "T",
  date: "2026-01-02",
  topics: ["a"],
  tags: ["b"],
};

describe("parseFrontmatter", () => {
  it("splits comma-separated strings into trimmed arrays", () => {
    const fm = parseFrontmatter(
      { ...base, topics: "x, y ,z", tags: "one,two" },
      "s",
    );
    expect(fm.topics).toEqual(["x", "y", "z"]);
    expect(fm.tags).toEqual(["one", "two"]);
  });

  it("drops empty items from comma strings", () => {
    const fm = parseFrontmatter({ ...base, tags: "a,,  ,b" }, "s");
    expect(fm.tags).toEqual(["a", "b"]);
  });

  it("defaults published to true", () => {
    expect(parseFrontmatter(base, "s").published).toBe(true);
  });

  it("respects an explicit published:false", () => {
    expect(parseFrontmatter({ ...base, published: false }, "s").published).toBe(
      false,
    );
  });

  it("throws with the slug in the message on a missing title", () => {
    expect(() => parseFrontmatter({ ...base, title: "" }, "s")).toThrow(
      /Invalid frontmatter for s/,
    );
  });

  it("throws on an unparseable date", () => {
    expect(() =>
      parseFrontmatter({ ...base, date: "not-a-date" }, "s"),
    ).toThrow();
  });

  it("accepts a well-formed YYYY-MM-DD date", () => {
    expect(parseFrontmatter({ ...base, date: "2026-04-14" }, "s").date).toBe(
      "2026-04-14",
    );
  });

  it("rejects a malformed date shape", () => {
    expect(() =>
      parseFrontmatter({ ...base, date: "2026/04/14" }, "s"),
    ).toThrow();
    expect(() => parseFrontmatter({ ...base, date: "April 4" }, "s")).toThrow();
  });

  it("rejects an impossible calendar date", () => {
    expect(() =>
      parseFrontmatter({ ...base, date: "2026-02-31" }, "s"),
    ).toThrow();
  });

  it("defaults topics and tags to [] when omitted", () => {
    const fm = parseFrontmatter({ title: "x", date: "2026-01-01" }, "slug");
    expect(fm.topics).toEqual([]);
    expect(fm.tags).toEqual([]);
  });
});
