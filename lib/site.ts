export const siteConfig = {
  name: "Day-Book of Igor",
  shortName: "Day-Book",
  domain: "blog.igorcodes.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.igorcodes.dev",
  description:
    "One working engineer's day-book: dated entries on AI, software architecture, technical debt, and engineering judgment.",
  tagline:
    "Notes from one working engineer, entered as they happen. Opinions on AI, debt, and architecture.",
  locale: "en_US",
  author: {
    name: "Igor",
  },
} as const;

export function toAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
