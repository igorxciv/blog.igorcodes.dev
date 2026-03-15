# blog.igorcodes.dev

Blog-only Next.js App Router application powered by file-based MDX content.

## Overview

- `app/page.tsx` redirects `/` to `/blog`.
- Blog index is rendered at `/blog`.
- Blog posts are rendered at `/blog/[...slug]` from files in `content/posts/**`.
- Frontmatter is validated with `zod` in `lib/server/posts.ts`.
- Draft posts (`published: false`) are visible in development and excluded in production.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- MDX via `@next/mdx` + `next-mdx-remote/rsc`
- Tailwind CSS v4 utility classes
- ESLint + Stylelint + Husky + lint-staged

## Project Structure

```text
.
├─ app/
│  ├─ blog/
│  │  ├─ [...slug]/page.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  └─ mdx/
│     └─ mdx-callout.tsx
├─ content/
│  └─ posts/
│     └─ YYYY/MM/DD/*.mdx
├─ lib/
│  ├─ formatters/date.ts
│  ├─ server/posts.ts
│  ├─ styles/cn.ts
│  └─ types/posts.ts
├─ public/
├─ mdx-components.tsx
├─ next.config.ts
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
date: "2026-02-05" # required, parseable date
updated: "2026-02-07" # optional, parseable date
topics: ["engineering", "nextjs"] # required, array or comma-separated string
tags: ["mdx", "app-router"] # required, array or comma-separated string
published: true # optional, defaults to true
featured: true # optional
readingTime: 4 # optional, positive integer
```

## MDX Setup

- MDX support is configured in `next.config.ts` using `@next/mdx`.
- `pageExtensions` includes `ts`, `tsx`, `md`, and `mdx`.
- Custom MDX element mapping lives in `mdx-components.tsx`.
- Reusable MDX UI components live in `components/mdx/`.

## Scripts

```bash
npm run dev          # start local dev server
npm run build        # create production build
npm run start        # run production server
npm run lint         # run ESLint + Stylelint
npm run lint:eslint  # run ESLint only
npm run lint:styles  # run Stylelint for app/**/*.css
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) (redirects to `/blog`).

## Environment

- `NEXT_PUBLIC_SITE_URL` (optional): used by `app/layout.tsx` to set `metadataBase`.
- Defaults to `http://localhost:3000` when unset.

## Notes

- No testing framework is configured yet.
- Do not commit build output (`.next/`) or secrets (`.env*`).
