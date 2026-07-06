import { describe, expect, it } from "vitest";
import {
  escapeXml,
  toCdata,
  toFeedSummary,
  toRssLanguage,
} from "@/lib/server/feed-utils";

describe("escapeXml", () => {
  it("escapes all five XML entities", () => {
    expect(escapeXml(`<a href="x" & 'y'>`)).toBe(
      "&lt;a href=&quot;x&quot; &amp; &apos;y&apos;&gt;",
    );
  });

  it("escapes ampersands first so entities are not double-encoded", () => {
    expect(escapeXml("&lt;")).toBe("&amp;lt;");
  });

  it("leaves an empty string unchanged", () => {
    expect(escapeXml("")).toBe("");
  });
});

describe("toFeedSummary", () => {
  it("uses a trimmed description when present", () => {
    expect(toFeedSummary({ description: "  hello  " })).toBe("hello");
  });

  it("falls back when the description is missing or blank", () => {
    const fallback = "Read the full post on the site.";
    expect(toFeedSummary({ description: "   " })).toBe(fallback);
    expect(toFeedSummary({ description: undefined })).toBe(fallback);
  });
});

describe("toRssLanguage", () => {
  it("converts a locale like en_US to en-us", () => {
    expect(toRssLanguage("en_US")).toBe("en-us");
  });
});

describe("toCdata", () => {
  it("wraps content in a CDATA section", () => {
    expect(toCdata("<p>hi</p>")).toBe("<![CDATA[<p>hi</p>]]>");
  });

  it("splits a literal ]]> so it cannot close the section early", () => {
    expect(toCdata("a]]>b")).toBe("<![CDATA[a]]]]><![CDATA[>b]]>");
  });
});
