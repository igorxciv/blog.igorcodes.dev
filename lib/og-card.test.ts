import { describe, expect, it } from "vitest";
import { truncateDescription } from "@/lib/og-card";

describe("truncateDescription", () => {
  it("keeps short text as is", () => {
    expect(truncateDescription("Short claim.", 40)).toBe("Short claim.");
  });

  it("cuts at a word boundary and attaches the ellipsis", () => {
    expect(truncateDescription("one two three four five", 12)).toBe("one two…");
    expect(truncateDescription("alpha, beta, gamma delta", 13)).toBe(
      "alpha, beta…",
    );
  });
});
