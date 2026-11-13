# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Working software engineers and tech leads. They arrive from a feed reader, a shared link, or a search/answer engine, read one post closely, and decide whether the author's thinking is worth following. Their job: understand an argument about engineering practice (AI and learning, technical debt, architecture, leadership) well enough to use it or push back on it.

## Product Purpose

A personal engineering blog by Igor. It exists to build the author's reputation among engineers and to keep a public record of the author's thinking. Success: a reader finishes a post, remembers whose it was, and comes back or subscribes.

## Positioning

Thesis-driven, opinionated essays from one practicing engineer, written in a human voice with honest trade-offs. Every post makes one claim and argues it with concrete engineering examples. Posts are dated entries (`/blog/YYYY/MM/DD/slug`), so the archive is a chronological record of one person's thinking, not a content library.

## Operating Context

- Readers read on desktop and phone, often from RSS/JSON feeds (`/rss.xml`, `/feed.json`) or shared links with OG cards.
- AI agents and answer engines consume the site through `/llms.txt`, `/llms-full.txt`, and `/api/md/[...slug]`.
- The author writes MDX in `content/posts/YYYY/MM/DD/*.mdx`, sometimes with a writing agent following `docs/writing-style.md`.
- Two published posts so far (April and May 2026). The archive is small and grows slowly.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4, MDX rendered at runtime via `next-mdx-remote/rsc` with `mdx-components.tsx` mapping.
- Routes that must keep working: `/blog` index, `/blog/[...slug]` posts, `/blog/topics/[topic]`, 404/error pages, RSS, JSON Feed, sitemap, robots, OG/Twitter images, `/api/og`, `/llms.txt`, `/llms-full.txt`, `/api/md/[...slug]`, `/.well-known/security.txt`.
- Dated post URLs stay stable; changing them breaks inbound links.
- Frontmatter schema (`lib/server/posts/schema.ts`): title, description, date, topics, tags, published, optional featured and readingTime. Drafts show only in development.
- Blog-only scope: no about, projects, resume, or other product routes (AGENTS.md).
- Strict CSP is set in `next.config.ts`; Umami analytics is allowed through it. Any new third-party origin requires a CSP change.
- Fonts: Wotfard and Dank Mono (licensed, shared with the portfolio at igorcodes.dev), supplied at build time from Vercel Blob; never committed.
- Existing MDX components (Callout, VisualCard/VisualGrid, ProcessFlow, TableBlock, PromptBlock, PostImage, StateMachinePlayground) are used by current posts; they can be restyled or redesigned but posts must keep rendering.
- Open decisions: the site name (ships as "Igor writes", set in `lib/site.ts`; earlier names were "Engineering Notes", "Engineering Memos" and "Day-Book of Igor"); whether to link out to the portfolio (igorcodes.dev) or any external profiles (none confirmed).

## Brand Commitments

- Author is presented as "Igor" only. No surname, no photo.
- Visual family with the portfolio at igorcodes.dev: minimal and fresh, near-black ground, dark theme by default with a light theme in the toggle. The portfolio's seasonal scenes stay on the portfolio, not the blog.
- Voice (binding, from `docs/writing-style.md`): human, practical, slightly opinionated, short punchy sentences, honest trade-offs; no corporate tone, hype, or generic AI filler.

## Evidence on Hand

- Two published posts: `content/posts/2026/04/14/ai-doesnt-make-you-learn-faster.mdx`, `content/posts/2026/05/12/technical-debt-is-a-risk-conversation.mdx`.
- The AI post contains a placeholder figure (`learning-loop` image, caption "Replace this placeholder...") that is not final art.
- No testimonials, subscriber counts, bio, or external profile links exist. Do not invent them.

## Product Principles

1. The writing is the product; everything on the page serves reading one argument through to the end.
2. It is one person's record. The author is visible on every page, and nothing should read as a template or a publication.
3. Honest about scale: design for two posts growing slowly, not an imagined library.
4. Machine-readable surfaces are first-class; humans and agents both get clean content.

## Accessibility & Inclusion

Keep current baseline: skip link, visible focus states, `prefers-reduced-motion` and forced-colors support, build-time alt-text enforcement, WCAG AA contrast in both themes.
