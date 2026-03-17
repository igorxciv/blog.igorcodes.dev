export const siteConfig = {
  name: "Engineering Notes",
  shortName: "Notes",
  domain: "blog.igorcodes.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.igorcodes.dev",
  description: "A minimal, MDX-powered engineering blog focused on software architecture, frontend engineering, and AI systems.",
  locale: "en_US",
  author: {
    name: "Igor",
  },
} as const;

export function toAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
