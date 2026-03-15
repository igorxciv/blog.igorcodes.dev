import { z } from "zod";
import type { PostFrontmatter } from "@/lib/types/posts";

const dateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Must be a parseable date string.");

const arrayFromStringOrArraySchema = z.preprocess((value) => {
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
}, z.array(z.string().min(1)));

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  topics: arrayFromStringOrArraySchema,
  tags: arrayFromStringOrArraySchema,
  published: z.boolean().default(true),
  featured: z.boolean().optional(),
  readingTime: z.number().int().positive().optional(),
});

export function parseFrontmatter(input: unknown, slug: string): PostFrontmatter {
  const parsed = frontmatterSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid frontmatter for ${slug}: ${parsed.error.message}`);
  }

  return parsed.data;
}
