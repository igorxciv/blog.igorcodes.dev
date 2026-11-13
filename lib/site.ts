export const siteConfig = {
  name: "Igor writes",
  shortName: "Igor writes",
  domain: "blog.igorcodes.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.igorcodes.dev",
  description:
    "Essays from a working engineer on AI and learning, software architecture, technical debt, and engineering judgment.",
  tagline: "Writing from a working engineer.",
  intro:
    "One claim per essay, argued with real examples: AI and learning, technical debt, architecture, leadership.",
  locale: "en_US",
  author: {
    name: "Igor",
  },
} as const;

export function toAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
