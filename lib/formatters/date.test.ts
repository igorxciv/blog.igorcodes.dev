import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/formatters/date";

describe("formatDate", () => {
  it("formats an ISO date as a long US date", () => {
    expect(formatDate("2026-01-02")).toBe("January 2, 2026");
  });

  it("returns the original string when the value is unparseable", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});
