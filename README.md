# blog.igorcodes.dev

Blog-only Next.js App Router application powered by file-based MDX content.

## Overview

- `app/page.tsx` redirects `/` to `/blog`.
- Blog index is rendered at `/blog`; topic-filtered views are static routes at `/blog/topics/[topic]`.
- Blog posts are rendered at `/blog/[...slug]` from files in `content/posts/**`.
- Frontmatter is validated with `zod` in `lib/server/posts/schema.ts`.
- Draft posts (`published: false`) are visible in development and excluded in production.
- Syndication feeds are served at `/rss.xml` and `/feed.json`.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript (strict)
- MDX rendered at runtime via `next-mdx-remote/rsc` with element mapping in `mdx-components.tsx` (no compile-time MDX plugin; `pageExtensions` stays `ts`/`tsx` only)
- Tailwind CSS v4 utility classes
- Biome for linting and formatting
- lefthook for git hooks
- Vitest for unit tests
- pnpm as the package manager

## Project Structure

```text
.
├─ app/
│  ├─ _tools/                 # build/CLI scripts (font fetch/upload, icon gen)
│  │  ├─ generate-icons.mjs
│  ├─ api/og/route.tsx        # dynamic OpenGraph card renderer
│  ├─ blog/
│  │  ├─ [...slug]/page.tsx
│  │  ├─ topics/[topic]/page.tsx
│  │  └─ page.tsx
│  ├─ feed.json/route.ts      # JSON feed
│  ├─ rss.xml/route.ts        # RSS feed
│  ├─ fonts.ts                # next/font/local declarations
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ manifest.ts
│  ├─ opengraph-image.tsx
│  ├─ robots.ts
│  ├─ sitemap.ts
│  └─ page.tsx
├─ components/
│  ├─ blog/                   # blog UI (cards, lists, shell, theme toggle, etc.)
│  └─ mdx/                    # MDX-rendered components (callout, visuals, images)
├─ content/
│  └─ posts/
│     └─ YYYY/MM/DD/*.mdx
├─ hooks/                     # reusable client hooks (useTheme, useReadingProgress)
├─ lib/
│  ├─ formatters/date.ts
│  ├─ mdx/                    # remark plugins (strip-mdx, text-fences)
│  ├─ server/
│  │  ├─ posts.ts             # server-only posts facade
│  │  ├─ posts/               # loader, schema, parser, helpers, related
│  │  ├─ feed.ts
│  │  └─ mdx-to-html.ts
│  ├─ post-images.ts
│  ├─ seo.ts
│  └─ site.ts
├─ public/                    # static assets, including public/images/posts/**
├─ mdx-components.tsx
├─ next.config.ts
├─ vitest.config.ts
├─ biome.json
├─ lefthook.yml
└─ package.json
```

## Blog Content

Add posts under `content/posts/**` with `.md` or `.mdx` extensions.

Example path:

```text
content/posts/2026/02/05/hello-mdx.mdx
```

Supported frontmatter schema:

```yaml
title: "Required title"
description: "Optional summary"
date: "2026-02-05" # required, YYYY-MM-DD
updated: "2026-02-07" # optional, YYYY-MM-DD
topics: ["engineering", "nextjs"] # optional, array or comma-separated string (defaults to [])
tags: ["mdx", "app-router"] # optional, array or comma-separated string (defaults to [])
published: true # optional, defaults to true
featured: true # optional
readingTime: 4 # optional, positive integer
```

Authoring conventions for posts live in `content/posts/AGENTS.md`.

## MDX Setup

- MDX is rendered at runtime with `next-mdx-remote/rsc`; no compile-time MDX toolchain is used, so `pageExtensions` in `next.config.ts` is `ts`/`tsx` only.
- Custom MDX element mapping lives in `mdx-components.tsx`.
- Reusable MDX UI components live in `components/mdx/`.
- Remark/rehype plugins are passed directly to `<MDXRemote>` (see `app/blog/[...slug]/page.tsx`).

## Scripts

All scripts are run with pnpm.

```bash
pnpm dev             # start local dev server
pnpm build           # fetch fonts, then create a production build
pnpm start           # run the production server
pnpm lint            # Biome check (lint + format diagnostics)
pnpm lint:fix        # Biome check with --write (apply fixes)
pnpm format          # Biome format --write
pnpm typecheck       # tsc --noEmit
pnpm test            # run Vitest once
pnpm test:watch      # Vitest in watch mode
pnpm check           # lint + typecheck + test (the full local gate)
pnpm icons:generate  # regenerate app icons
```

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) (redirects to `/blog`).

Git hooks are installed automatically via the `prepare` script (`lefthook install`). Pre-commit runs Biome on staged files; pre-push runs `pnpm test` and `pnpm typecheck`.

## Fonts

Source Serif 4 (prose and titles), Archivo (the ledger apparatus: column heads, dates, accounts, folios), and JetBrains Mono (code) are open-licensed (SIL OFL). `app/fonts.ts` loads them with `next/font/google`, which downloads and self-hosts them at build time, so the CSP's `font-src 'self'` still holds and no font files live in the repo.

## Environment

Copy `.env.example` to `.env.local` and fill in as needed.

- `NEXT_PUBLIC_SITE_URL` (optional): canonical site origin used by `app/layout.tsx` for `metadataBase`. Falls back to the production URL.
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (optional): Umami analytics website ID. Leave unset to disable analytics (e.g. local dev).
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (optional): Umami script URL.

All `NEXT_PUBLIC_*` variables are exposed to the browser and are non-secret.

## Answer Engine Optimization (AEO)

The site exposes clean, agent-readable surfaces so AI answer engines (ChatGPT,
Claude, Perplexity, Google AI Overviews, …) can consume and cite it accurately:

- **`/llms.txt`** — an [llms.txt](https://llmstxt.org/) index: site summary plus
  a linked list of every published post and its Markdown mirror.
- **`/llms-full.txt`** — the entire published corpus concatenated as one Markdown
  file, for agents that prefer a single fetch over crawling.
- **`/api/md/<slug>`** — a per-post Markdown mirror (title, metadata block, then
  the post's Markdown/MDX source). Interactive components are left as JSX source
  so prop-encoded data stays intact and information-complete for agents, the same
  way docs platforms serve `.mdx`. Statically prerendered for each published post
  and advertised on every post via `<link rel="alternate" type="text/markdown">`.
- **`robots.txt`** — explicitly allows the major AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, …); this blog opts *into* answer engines.
- **Structured data** — `Article` JSON-LD carries AEO signals (`isAccessibleForFree`,
  `timeRequired`, `about`) alongside the existing `WebSite`/`Person`/`BlogPosting`/
  `BreadcrumbList` graphs. Serialization and formatting live in `lib/llms.ts` and
  `lib/seo.ts` (both pure and unit-tested).

Everything is derived from the same post pipeline (`lib/server/posts`), so drafts
never leak and the surfaces stay in sync with `/blog`.

## Notes

- Tests use Vitest and live in `lib/**/*.test.ts`.
- Do not commit build output (`.next/`), licensed fonts (`app/fonts/`), or secrets (`.env*` except `.env.example`).
- Dependency pinning: framework packages (`next`, `react`, `react-dom`) are pinned to **exact** versions; libraries use **caret** (`^`) ranges. Dependabot (`.github/dependabot.yml`) opens a weekly grouped PR for minor/patch bumps and a separate PR for framework majors.
