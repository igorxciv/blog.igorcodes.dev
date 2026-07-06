import { z } from "zod";
import { type PostFrontmatter } from "@/lib/types/posts";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isValidCalendarDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const date = new Date(`${value}T00:00:00Z`);

  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() + 1 === Number(month) &&
    date.getUTCDate() === Number(day)
  );
}

const dateStringSchema = z
  .string()
  .refine(
    isValidCalendarDate,
    "Must be a real calendar date in YYYY-MM-DD format.",
  );

const arrayFromStringOrArraySchema = z.preprocess(
  (value) => {
    if (value == null) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value;
  },
  z.array(z.string().min(1)),
);

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  topics: arrayFromStringOrArraySchema.default([]),
  tags: arrayFromStringOrArraySchema.default([]),
  published: z.boolean().default(true),
  featured: z.boolean().optional(),
  readingTime: z.number().int().positive().optional(),
});

export function parseFrontmatter(
  input: unknown,
  slug: string,
): PostFrontmatter {
  const parsed = frontmatterSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid frontmatter for ${slug}: ${parsed.error.message}`);
  }

  return parsed.data;
}
