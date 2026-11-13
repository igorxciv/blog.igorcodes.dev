import { describe, expect, it } from "vitest";
import { isTitleCase, lintPost } from "@/lib/prose-lint";

const frontmatter = '---\ntitle: "A plain title"\ndate: "2026-01-01"\n---\n';
const keyPoints = "<KeyPoints>\n\n- One claim.\n\n</KeyPoints>\n";

function rules(body: string, withKeyPoints = true): string[] {
  const source = `${frontmatter}${withKeyPoints ? keyPoints : ""}\n${body}`;
  return lintPost(source).map((finding) => finding.rule);
}

describe("isTitleCase", () => {
  it("flags headings with most words capitalised", () => {
    expect(isTitleCase("Why This Matters For Teams")).toBe(true);
    expect(isTitleCase("AI Doesn't Make You Learn Faster")).toBe(true);
  });

  it("accepts sentence case, acronyms and proper nouns", () => {
    expect(isTitleCase("Why this matters for teams")).toBe(false);
    expect(isTitleCase("Anthropic's study found a gap in AI use")).toBe(false);
    expect(isTitleCase("Ship the SSO plan")).toBe(false);
  });
});

describe("lintPost", () => {
  it("passes clean prose", () => {
    expect(
      rules(
        "## A plain heading\n\nThis paragraph has two sentences. It reads fine.\n",
      ),
    ).toEqual([]);
  });

  it("flags dashes, curly quotes and filler words", () => {
    expect(rules("It works — mostly.\n")).toContain("dash");
    expect(rules("It’s fine.\n")).toContain("curly-quote");
    expect(rules("Let us delve into it.\n")).toContain("slop-term");
    expect(rules("This is not just a fix.\n")).toContain("slop-term");
  });

  it("ignores code, link targets and fenced blocks", () => {
    expect(
      rules(
        "Run `a — b` and read [the docs](https://x.dev/delve).\n\n```ts\nconst crucial = 1;\n```\n",
      ),
    ).toEqual([]);
  });

  it("flags numbered and title-case headings", () => {
    expect(rules("## 1. First step\n")).toContain("numbered-heading");
    expect(rules("## The Hidden Cost Of Reps\n")).toContain("title-case");
  });

  it("flags a title in title case", () => {
    const source = `---\ntitle: "Technical Debt Is a Risk Conversation"\n---\n${keyPoints}`;
    expect(lintPost(source).map((finding) => finding.rule)).toContain(
      "title-case",
    );
  });

  it("flags a chain of one-sentence paragraphs", () => {
    const findings = rules("Nice.\n\nThat is it.\n\nSame idea here.\n");
    expect(findings).toEqual(["one-line-chain"]);
  });

  it("lets a single short paragraph stand", () => {
    expect(
      rules("Nice.\n\nThis one is longer. It has two sentences in it.\n"),
    ).toEqual([]);
  });

  it("flags parentheses in prose but not in tags", () => {
    expect(rules("It broke (again) today.\n")).toContain("parenthesis");
    expect(rules('<Steps title="One (two)">\n\n1. Go\n\n</Steps>\n')).toEqual(
      [],
    );
  });

  it("enforces component budgets", () => {
    expect(rules("Intro text here.\n", false)).toContain("keypoints-missing");
    const quotes = "<PullQuote>\n\nA line.\n\n</PullQuote>\n\n".repeat(3);
    expect(rules(quotes)).toContain("pullquote-count");
    expect(rules("<mark>One.</mark> and <mark>two.</mark>\n")).toContain(
      "mark-density",
    );
    expect(rules("```figure\n+--+\n```\n")).toContain("ascii-figure");
  });
});
