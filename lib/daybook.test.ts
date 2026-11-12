import { describe, expect, it } from "vitest";
import {
  extractSections,
  formatLedgerDate,
  formatTopic,
  getAdjacentEntries,
  getFolioNumbers,
  getVolume,
  getVolumeLabel,
  slugifyHeading,
  stripHeadingNumber,
  toRoman,
} from "@/lib/daybook";
import { type PostSummary } from "@/lib/types/posts";

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

describe("getFolioNumbers", () => {
  it("numbers posts oldest first, breaking date ties by slug", () => {
    const numbers = getFolioNumbers([
      post("2026/05/12/b", "2026-05-12"),
      post("2026/04/14/a", "2026-04-14"),
      post("2026/05/12/a", "2026-05-12"),
    ]);
    expect(numbers.get("2026/04/14/a")).toBe(1);
    expect(numbers.get("2026/05/12/a")).toBe(2);
    expect(numbers.get("2026/05/12/b")).toBe(3);
  });
});

describe("getAdjacentEntries", () => {
  const posts = [
    post("2026/05/12/b", "2026-05-12"),
    post("2026/04/14/a", "2026-04-14"),
    post("2026/05/12/a", "2026-05-12"),
  ];

  it("finds the entries before and after in book order", () => {
    const middle = getAdjacentEntries(posts, "2026/05/12/a");
    expect(middle.broughtForward?.slug).toBe("2026/04/14/a");
    expect(middle.carriedForward?.slug).toBe("2026/05/12/b");
  });

  it("returns null at either end of the book and for unknown slugs", () => {
    expect(getAdjacentEntries(posts, "2026/04/14/a").broughtForward).toBeNull();
    expect(getAdjacentEntries(posts, "2026/05/12/b").carriedForward).toBeNull();
    expect(getAdjacentEntries(posts, "missing")).toEqual({
      broughtForward: null,
      carriedForward: null,
    });
  });
});

describe("formatLedgerDate", () => {
  it("splits an ISO date into day-month and year", () => {
    expect(formatLedgerDate("2026-05-12")).toEqual({
      day: "12 May",
      year: "2026",
    });
    expect(formatLedgerDate("2026-04-04")).toEqual({
      day: "4 Apr",
      year: "2026",
    });
  });

  it("passes through a value it cannot read", () => {
    expect(formatLedgerDate("someday")).toEqual({ day: "someday", year: "" });
  });
});

describe("volumes", () => {
  it("writes Roman numerals", () => {
    expect(toRoman(1)).toBe("I");
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(14)).toBe("XIV");
  });

  it("counts one volume per year from the first entry", () => {
    expect(getVolume([post("a", "2026-04-14")])).toEqual({
      numeral: "I",
      year: "2026",
    });
    expect(
      getVolume([post("a", "2026-04-14"), post("b", "2028-01-02")]),
    ).toEqual({ numeral: "III", year: "2028" });
    expect(getVolume([])).toBeNull();
  });

  it("labels the volume for the book's cloth", () => {
    expect(getVolumeLabel([post("a", "2026-04-14")])).toBe("Vol. I · 2026");
    expect(getVolumeLabel([])).toBeNull();
  });
});

describe("headings", () => {
  it("strips authored numbering", () => {
    expect(stripHeadingNumber("1. Problem: one sentence")).toBe(
      "Problem: one sentence",
    );
    expect(stripHeadingNumber("2026 roadmap")).toBe("2026 roadmap");
  });

  it("slugifies curly quotes and punctuation", () => {
    expect(slugifyHeading("The “paste and pray” loop")).toBe(
      "the-paste-and-pray-loop",
    );
    expect(slugifyHeading("Managers do not prioritize “clean code”")).toBe(
      "managers-do-not-prioritize-clean-code",
    );
  });
});

describe("extractSections", () => {
  it("numbers h2 and h3 headings and skips fenced code", () => {
    const body = [
      "## First",
      "text",
      "```md",
      "## Not a heading",
      "```",
      "## How I would use AI",
      "### 1. Try it manually",
      "### 2. Ask for *concepts*",
      "## Last",
    ].join("\n");

    expect(
      extractSections(body).map(({ startMinute: _, ...rest }) => rest),
    ).toEqual([
      { depth: 2, id: "first", number: "1", title: "First" },
      {
        depth: 2,
        id: "how-i-would-use-ai",
        number: "2",
        title: "How I would use AI",
      },
      {
        depth: 3,
        id: "try-it-manually",
        number: "2.1",
        title: "Try it manually",
      },
      {
        depth: 3,
        id: "ask-for-concepts",
        number: "2.2",
        title: "Ask for concepts",
      },
      { depth: 2, id: "last", number: "3", title: "Last" },
    ]);
  });

  it("estimates the reading minute each section starts at", () => {
    const words = (count: number) => Array(count).fill("word").join(" ");
    const body = ["## One", words(460), "## Two", words(10), "## Three"].join(
      "\n",
    );
    expect(extractSections(body).map((section) => section.startMinute)).toEqual(
      [0, 2, 2],
    );
  });
});
