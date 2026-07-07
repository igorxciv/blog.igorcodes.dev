import { type MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// This blog opts INTO answer engines / AI crawlers (AEO): the named agents below
// are the major LLM search and training crawlers, all explicitly allowed. The
// clean Markdown surfaces they should prefer — /llms.txt, /llms-full.txt, and
// /api/md/<slug> — are advertised in <link rel="alternate"> and the llms.txt
// index rather than here (robots.txt has no field for them).
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
