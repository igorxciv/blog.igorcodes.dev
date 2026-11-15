import { describe, expect, it } from "vitest";
import { postTitleTransitionName } from "@/lib/view-transitions";

describe("postTitleTransitionName", () => {
  it("prefixes a plain slug", () => {
    expect(postTitleTransitionName("technical-debt")).toBe(
      "post-title-technical-debt",
    );
  });

  it("turns characters that are invalid in a CSS identifier into dashes", () => {
    expect(postTitleTransitionName("2024/notes.on ai")).toBe(
      "post-title-2024-notes-on-ai",
    );
  });

  it("never starts with a digit, so the name stays a valid identifier", () => {
    expect(postTitleTransitionName("10-rules")).toMatch(/^[a-z]/);
  });
});
