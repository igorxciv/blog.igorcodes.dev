# Improvement Proposals — blog.igorcodes.dev

> Best-practices review of a personal engineering blog.
> **Stack:** Next.js `16.2.10` (App Router) · React `19.2.7` · Tailwind CSS `v4` (`@tailwindcss/postcss`) · TypeScript `~6` (strict) · MDX via `next-mdx-remote/rsc` · Biome + Lefthook · pnpm. Deploy target appears to be Vercel (`.vercel` ignored).

## How to use this document

Each proposal is **self-contained and independent** so it can be handed to an implementer one at a time. Every proposal has:

- **ID / Title / Severity / Effort**
- **Problem** — with exact `file:line` evidence.
- **Why it matters**
- **Proposed change** — concrete, step-by-step, with code snippets that can be copied.
- **Acceptance criteria** — how to verify it is done.
- **Risk / notes**

Work top-down (Critical → Low). Where two proposals touch the same file, notes call it out.

**Constraints respected in this doc:** no build-tooling migration (pnpm/Biome/Lefthook kept), no framework change. All suggestions stay within the current stack.

---

## Summary table

| ID | Title | Severity | Effort |
|----|-------|----------|--------|
| P-01 | No security headers / Content-Security-Policy | High | Medium |
| P-02 | No error boundaries (`error.tsx` / `global-error.tsx`) | High | Small |
| P-03 | `remark-gfm` not applied to the actual post render path | High | Small |
| P-04 | No syntax highlighting for code blocks | High | Medium |
| P-05 | `Article` JSON-LD missing `image` (and weak author metadata) | Medium | Small |
| P-06 | `/api/og` dynamic route has no cache headers | Medium | Small |
| P-07 | Dead MDX pipeline + unused dependencies (`@next/mdx`, `@mdx-js/*`, `motion`) | Medium | Small |
| P-08 | Fragile hand-maintained post-image registry; `PostImage` throws during render | Medium | Medium |
| P-09 | No automated tests for pure, high-value logic | Medium | Medium |
| P-10 | Duplicated cache/no-cache branching in `posts/service.ts` + `unstable_cache` | Medium | Medium |
| P-11 | Reading time is manual frontmatter, not computed | Medium | Small |
| P-12 | No web app manifest / icon set | Medium | Small |
| P-13 | Markdown `img` uses empty `alt` default + forced `object-cover` crop | Medium | Small |
| P-14 | Hardcoded Umami analytics ID & script URL | Low | Small |
| P-15 | `tsconfig` targets ES2017 and enables `allowJs` | Low | Small |
| P-16 | Root-layout default canonical is `/blog` (fragile) | Low | Small |
| P-17 | RSS feed ships summary only (no full content) | Low | Small |
| P-18 | Duplicated OG-card markup across 3 generators | Low | Small |

**Counts:** High = 4, Medium = 9, Low = 5 (18 total).

---

## P-01 — No security headers / Content-Security-Policy

- **Severity:** High
- **Effort:** Medium

### Problem
There are **no HTTP security headers anywhere**. Verified: `next.config.ts` defines no `headers()`, there is no `middleware.ts`, and no header strings exist in the app (`grep` for `Content-Security-Policy|X-Frame-Options|Strict-Transport|headers()` returns nothing). Meanwhile the site injects several inline scripts and a third-party script:

- `app/layout.tsx:116-118` — inline `theme-init` script via `next/script` `beforeInteractive`.
- `app/layout.tsx:119-125` — third-party Umami script from `https://cloud.umami.is/script.js`.
- `app/layout.tsx:126-133`, `app/blog/[...slug]/page.tsx:101-108`, `app/blog/page.tsx:94-103` — multiple `dangerouslySetInnerHTML` JSON-LD `<script>` tags.

`next.config.ts` full content today:
```ts
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: { optimizePackageImports: ["lucide-react"] },
};
```

### Why it matters
A production site with no `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, or `Permissions-Policy` is needlessly exposed to clickjacking, MIME sniffing, referrer leakage, and (if any XSS is ever introduced through MDX) unrestricted script execution. These headers are table-stakes and improve security-scanner / Lighthouse "best practices" scores.

### Proposed change
Add a `headers()` function to `next.config.ts`. Because the theme-init inline script and JSON-LD blocks are inline, a strict nonce-based CSP requires middleware; to keep this proposal low-risk for a static export, use a CSP that allows the **specific** inline needs via `'unsafe-inline'` for `style-src` and hashes/`'unsafe-inline'` for `script-src` plus the Umami origin. (A stricter nonce-based CSP is a follow-up.)

Edit `next.config.ts` to:
```ts
import createMDX from "@next/mdx";
import { type NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: { remarkPlugins: ["remark-gfm"] },
});

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' is required by the theme-init script and JSON-LD blocks.
      "script-src 'self' 'unsafe-inline' https://cloud.umami.is",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://cloud.umami.is",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: { optimizePackageImports: ["lucide-react"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withMDX(nextConfig);
```

### Acceptance criteria
- `curl -I https://blog.igorcodes.dev/blog` (or `curl -I http://localhost:3000/blog` after `pnpm build && pnpm start`) shows all six headers.
- The blog renders with **no CSP violation errors** in the browser console (check the theme toggle, Umami network call, and JSON-LD all still work).
- The theme still applies with no flash-of-wrong-theme on first paint.

### Risk / notes
- `'unsafe-inline'` in `script-src` weakens the CSP; it is a pragmatic first step given the existing inline scripts. A stronger follow-up: move to a nonce-based CSP using `middleware.ts` and pass the nonce to `next/script` and the JSON-LD tags. Keep that as a separate proposal so this one stays shippable.
- Verify Umami still records events after CSP is applied; adjust `script-src`/`connect-src` if Umami changes origins.

---

## P-02 — No error boundaries (`error.tsx` / `global-error.tsx`)

- **Severity:** High
- **Effort:** Small

### Problem
The app has `app/blog/loading.tsx` and `app/not-found.tsx`, but **no `error.tsx` or `global-error.tsx`** anywhere (verified by directory listing). Several render paths can throw at runtime:

- `components/mdx/post-image.tsx:28-32` — `PostImage` **throws** `new Error("Missing post image asset...")` during render if the image registry lacks the asset.
- `lib/server/posts/schema.ts:47-49` — `parseFrontmatter` throws on invalid frontmatter.
- MDX evaluated at runtime via `app/blog/[...slug]/page.tsx:123` can throw for malformed content.

Without a boundary, any throw yields an unstyled Next.js error screen (or, for a Server Component throw, a broken route) with no recovery UI.

### Why it matters
A single bad MDX file or a missing image asset takes down the route with a jarring default error page and no "try again"/"back to blog" affordance. Error boundaries are a standard App Router resilience primitive.

### Proposed change
1. Create `app/error.tsx` (Client Component — required by Next for `error.tsx`):
```tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-2xl font-semibold text-(--foreground)">
        Something went wrong
      </h1>
      <p className="mt-3 text-(--foreground-soft)">
        An unexpected error occurred while rendering this page.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="focus-ring inline-flex min-h-11 items-center rounded-md bg-(--surface-strong) px-4 text-sm text-(--foreground)"
        >
          Try again
        </button>
        <Link
          href="/blog"
          className="focus-ring inline-flex min-h-11 items-center rounded-md border border-(--border) px-4 text-sm text-(--foreground)"
        >
          Back to articles
        </Link>
      </div>
    </section>
  );
}
```

2. Create `app/global-error.tsx` to catch errors in the root layout itself (must render its own `<html>`/`<body>`):
```tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem", textAlign: "center" }}>
        <h1>Something went wrong</h1>
        <p>Please reload the page.</p>
        <button type="button" onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

### Acceptance criteria
- `app/error.tsx` and `app/global-error.tsx` exist and compile (`pnpm build` succeeds).
- Temporarily throwing inside a page (e.g. `throw new Error("test")` at the top of `app/blog/page.tsx`'s component) renders the styled error UI with a working "Try again" button; remove the temporary throw afterwards.
- `noConsole` Biome rule: `console.error` is allowed (see `biome.json` `noConsole.options.allow: ["warn", "error"]`), so the boundary lints clean.

### Risk / notes
- `error.tsx` does **not** catch errors thrown in the root layout or in `generateStaticParams`/`generateMetadata` at build time; `global-error.tsx` covers layout render, and build-time throws are intentionally fatal.

---

## P-03 — `remark-gfm` not applied to the actual post render path

- **Severity:** High
- **Effort:** Small

### Problem
`remark-gfm` is configured **only** for `@next/mdx` in `next.config.ts` (`options: { remarkPlugins: ["remark-gfm"] }`). But posts are **not** rendered through `@next/mdx` — there are no `.mdx` pages under `app/` (verified). They are rendered at runtime by `next-mdx-remote`:

- `app/blog/[...slug]/page.tsx:123` — `<MDXRemote source={post.body} components={postMdxComponents} />` with **no `options`/`mdxOptions`**, so no remark plugins run.

Result: GitHub-Flavored Markdown features (pipe tables, strikethrough `~~x~~`, autolinks, task lists, footnotes) are silently **not parsed** in real posts. Current posts happen not to use pipe tables (verified), so the bug is latent and will surprise the author the first time they write a Markdown table.

### Why it matters
An engineering blog will inevitably use Markdown tables and autolinks. They will render as raw text (`| a | b |`) with no error, which is a confusing silent failure. The dependency is already installed — it just is not wired into the code path that runs.

### Proposed change
Pass the plugin to `MDXRemote`. Edit `app/blog/[...slug]/page.tsx`:
```tsx
import remarkGfm from "remark-gfm";
// ...
<MDXRemote
  source={post.body}
  components={postMdxComponents}
  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
/>
```
(This is also the natural home for the rehype syntax-highlighting plugin from **P-04** — coordinate the two edits.)

### Acceptance criteria
- Add a temporary Markdown table and a `~~strikethrough~~` to a draft post; both render as a real `<table>` (routed through the `table`/`th`/`td` components in `mdx-components.tsx:123-146`) and `<del>`.
- `pnpm build` succeeds.

### Risk / notes
- `remark-gfm` here is the runtime `.default` export; `import remarkGfm from "remark-gfm"` works with the current ESM setup.
- Touches the same file as **P-04**; apply them together to avoid overwriting the `options` object.

---

## P-04 — No syntax highlighting for code blocks

- **Severity:** High
- **Effort:** Medium

### Problem
Fenced code blocks render as plain text. In `mdx-components.tsx:101-122`, the `pre` component wraps children in a static `<pre>` with a single hardcoded grey color `text-[#a8a8a8]` (line 116) and no tokenization. The `code` inline component (lines 95-100) is styled but does no highlighting. There is no `rehype-pretty-code`, `@shikijs/rehype`, or `rehype-highlight` in the dependency list.

### Why it matters
For a blog explicitly about "software architecture, frontend engineering, AI systems," unhighlighted code is a major readability and credibility gap. Syntax highlighting is arguably the single most impactful content-quality improvement for this site.

### Proposed change
Use Shiki via `rehype-pretty-code` (build-time highlighting, zero client JS, works in RSC):

1. Add dependency:
```bash
pnpm add rehype-pretty-code shiki
```
2. Wire it into `MDXRemote` in `app/blog/[...slug]/page.tsx` (combine with **P-03**):
```tsx
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";

const prettyCodeOptions: Options = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
};

<MDXRemote
  source={post.body}
  components={postMdxComponents}
  options={{
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    },
  }}
/>
```
3. In `mdx-components.tsx`, stop hardcoding `text-[#a8a8a8]` on `pre` (line 116). `rehype-pretty-code` emits a `<pre>` whose tokens carry CSS variables (`--shiki-light` / `--shiki-dark`). Update the `pre` component to preserve token colors and add the light/dark var wiring in `app/globals.css`:
```css
/* globals.css */
[data-theme="dark"] pre code span { color: var(--shiki-dark); }
[data-theme="light"] pre code span { color: var(--shiki-light); }
pre code { display: grid; } /* enables per-line styling if line numbers are added later */
```
4. Note: the `pre` component also branches into `PromptBlock`/`WorkflowStepsBlock` for `language-text` fences via `getTextFenceContent` (`mdx-components.tsx:25-44, 101-113`). Preserve that branch; only the real code path (line 114-121) needs the highlight-friendly `<pre>`.

### Acceptance criteria
- A `` ```ts `` fenced block in a post renders with colored tokens in both light and dark themes.
- No client-side highlighting library ships in the bundle (Shiki runs at build; confirm via `pnpm build` bundle output — no shiki chunk in client JS).
- `language-text` fences still route to `PromptBlock`/`WorkflowStepsBlock` (the `->` and prompt behavior is unchanged).

### Risk / notes
- Shiki adds build-time cost and increases `node_modules` size; acceptable for a statically generated blog.
- Must be coordinated with **P-03** (same `options` object).

---

## P-05 — `Article` JSON-LD missing `image` (and weak author metadata)

- **Severity:** Medium
- **Effort:** Small

### Problem
`buildArticleJsonLd` in `lib/seo.ts:102-124` omits the `image` property. Google's Article structured-data guidelines list `image` as recommended, and rich results favor it. The article already has a generated social image at `/api/og?slug=...` (referenced in `app/blog/[...slug]/page.tsx:44`). Also, `author`/`publisher` (lines 115-122) have no `url`, and `Person` as `publisher` is unusual (an `Organization` is preferred, but `Person` is acceptable for a personal blog).

### Why it matters
Adding `image` to Article JSON-LD improves eligibility for rich results and social previews driven by structured data. It is a cheap SEO win with existing assets.

### Proposed change
In `lib/seo.ts`, extend `buildArticleJsonLd`:
```ts
export function buildArticleJsonLd(post: PostContent): JsonLd {
  const ogImage = toAbsoluteUrl(`/api/og?slug=${encodeURIComponent(post.slug)}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? siteConfig.description,
    image: [ogImage],
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.updated ?? post.date),
    articleSection: post.topics[0],
    keywords: post.tags.join(", "),
    inLanguage: "en",
    author: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.author.name, url: siteConfig.url },
  };
}
```

### Acceptance criteria
- View source of a post page; the Article JSON-LD block contains an absolute `image` URL and `author.url`.
- Google Rich Results Test (or `schema.org` validator) reports no errors for the Article type.

### Risk / notes
- Uses the existing `/api/og` route; if **P-06** adds caching, the image URL is unchanged, so no coordination needed beyond both landing.

---

## P-06 — `/api/og` dynamic route has no cache headers

- **Severity:** Medium
- **Effort:** Small

### Problem
`app/api/og/route.tsx` returns an `ImageResponse` directly and sets **no `Cache-Control`** (verified: only `export const runtime = "nodejs"` at line 5). Every crawler/social-scraper hit re-renders the OG image on the Node runtime. The sibling metadata image routes (`app/opengraph-image.tsx`, `app/twitter-image.tsx`) are static and fine; this dynamic handler is the outlier.

### Why it matters
OG images are requested by many bots (Slack, Twitter/X, LinkedIn, Discord, Google). Regenerating a 1200×630 image per request wastes compute and adds latency to social unfurls. These images change only when a post's title/date changes.

### Proposed change
Pass cache headers into the `ImageResponse` in `app/api/og/route.tsx`. `ImageResponse` accepts a `headers` option:
```tsx
return new ImageResponse(
  ( /* ...existing JSX... */ ),
  {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": "public, immutable, no-transform, s-maxage=31536000, max-age=31536000",
    },
  },
);
```
Apply to **both** `new ImageResponse(...)` call sites (the `renderCard` helper at lines 20-76 — add `headers` to its options object so all callers inherit it).

### Acceptance criteria
- `curl -I "https://blog.igorcodes.dev/api/og?slug=<slug>"` returns a `Cache-Control` header with a long `s-maxage`.
- The image still renders correctly for valid, missing, and no-slug cases (the three branches at lines 83-112).

### Risk / notes
- If OG card design changes later, cache-busting requires a new query param or a deploy that changes the URL; acceptable for infrequent design changes.

---

## P-07 — Dead MDX pipeline + unused dependencies

- **Severity:** Medium
- **Effort:** Small

### Problem
Two MDX systems are configured but only one is used, and one runtime dependency appears entirely unused:

- `next.config.ts` wires `@next/mdx` (`createMDX`) and `pageExtensions: ["ts","tsx","md","mdx"]`, but there are **no `.md`/`.mdx` pages under `app/`** (verified). Posts render via `next-mdx-remote/rsc` (`app/blog/[...slug]/page.tsx:5,123`). So `@next/mdx`, `@mdx-js/loader`, and `@mdx-js/react` are dead weight for the runtime render path. `mdx-components.tsx:208-213` `useMDXComponents` is the `@next/mdx` hook and is never invoked by the `next-mdx-remote` path.
- `motion` (`package.json` dependency) is **not imported anywhere** (verified: `grep` for `from "motion"`/`framer-motion` in `app|components|lib|hooks` returns nothing).

### Why it matters
Unused dependencies and a redundant MDX toolchain inflate install size, slow CI, widen the security surface, and confuse contributors (and lower-capability AI implementers) about which MDX path is authoritative.

### Proposed change
Decide on one of two directions; **Option A** is recommended.

**Option A (recommended): keep `next-mdx-remote`, remove the dead `@next/mdx` path and unused deps.**
1. Remove the `remark-gfm` wiring reliance on `@next/mdx` — it must instead be passed to `MDXRemote` (see **P-03**).
2. Simplify `next.config.ts` (drop `createMDX`/`withMDX` and `md`/`mdx` from `pageExtensions` — note this must **not** remove the `headers()` from P-01):
```ts
import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  experimental: { optimizePackageImports: ["lucide-react"] },
  async headers() { /* from P-01 */ },
};

export default nextConfig;
```
3. Remove `useMDXComponents` from `mdx-components.tsx` (lines 208-213) if nothing imports it (grep first).
4. Uninstall unused deps:
```bash
pnpm remove @next/mdx @mdx-js/loader @mdx-js/react motion
```
   Keep `@types/mdx` only if `mdx/types` is still imported (it is — `mdx-components.tsx:2`), so retain `@types/mdx`.

**Option B: standardize on `@next/mdx`** (author posts as app-router MDX pages). Larger change; only pick if the author wants file-based MDX routing. Not recommended given the existing filesystem-driven `content/posts` pipeline.

### Acceptance criteria
- After Option A: `pnpm build` succeeds, all posts still render, GFM works (with P-03 applied), and `pnpm why motion` reports it is no longer a dependency.
- No import of `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, or `motion` remains (`grep -rn`).

### Risk / notes
- Confirm `mdx-components.tsx`'s `useMDXComponents` export is unused before deleting; the file's `mdxComponents`/`createPostMdxComponents` exports **are** used (`app/blog/[...slug]/page.tsx:16,94`) and must stay.
- Coordinate with **P-03**: removing `@next/mdx`'s remark config makes wiring `remark-gfm` into `MDXRemote` mandatory.

---

## P-08 — Fragile hand-maintained post-image registry; `PostImage` throws during render

- **Severity:** Medium
- **Effort:** Medium

### Problem
`lib/post-images.ts` hand-maintains a `postImageRegistry` (lines 156-171) that hardcodes every image variant per post. `components/mdx/post-image.tsx:26-32` looks up the registry and **throws** during render if an asset is missing. The registry is fully decoupled from the actual files in `public/images/posts/**`, so adding a post image requires editing this TypeScript file by hand and keeping width/height/paths perfectly in sync with disk. Any mismatch is a hard crash (and, with no error boundary today, a broken route — see **P-02**).

### Why it matters
This is a maintainability landmine: the most common future task (add a post with images) requires editing a verbose registry with exact pixel dimensions, and a typo throws at render/build. It scales poorly and is exactly the kind of task a lower-capability implementer will get wrong.

### Proposed change
Two independent, incremental improvements (do either or both):

1. **Make missing assets non-fatal.** In `post-image.tsx`, replace the `throw` (lines 28-32) with a graceful fallback so a missing image degrades instead of crashing:
```tsx
const asset = getPostImage(slug, name);
if (!asset) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`Missing post image asset for "${slug}" / "${name}".`);
  }
  return null; // or a lightweight placeholder <figure>
}
```
   (Keep a build-time check elsewhere if fail-fast is desired — see criteria.)

2. **Reduce registry boilerplate.** The per-variant widths/heights follow a fixed convention (`mobile 640×360 / 1280×720`, `tablet 768×432 / 1536×864`, `desktop 896×504 / 1792×1008`). Expose a single helper so a post registers with just `date`, `slug`, `name`, `extension` (already done via `createArticleImageSet`), and document that the file names on disk must match `buildPostImagePath` (`lib/post-images.ts:37-48`). Optionally add a build/CI script that reads `public/images/posts/**` and asserts every registry entry has matching files (and vice versa), turning silent drift into a build error.

### Acceptance criteria
- Rendering a post whose image asset is absent no longer throws; the route still renders (with a warning in dev).
- Adding a new post image is documented as: drop the 6 variant files following the naming convention, then add one `createArticleImageSet(...)` entry.
- (If the optional check is added) a mismatched registry/disk state fails `pnpm build` with a clear message.

### Risk / notes
- Returning `null` changes behavior from "fail build" to "skip image." If the author prefers fail-fast, keep the throw but pair it strictly with **P-02** so it degrades to a styled error, and/or move validation to a build script.

---

## P-09 — No automated tests for pure, high-value logic

- **Severity:** Medium
- **Effort:** Medium

### Problem
There is no test runner and no test files in the repo (`AGENTS.md` even notes testing is unspecified). Several pure, deterministic, bug-prone functions are untested:

- `lib/server/posts/schema.ts` — frontmatter parsing incl. the comma-string→array preprocessor (lines 11-27).
- `lib/server/posts/slug.ts` — `toSlug`/`normalizeSlug` (path→slug, edge cases).
- `lib/server/posts/related.ts` — scoring & ordering (`getRelatedPosts`).
- `lib/server/feed.ts` — `escapeXml` (lines 26-33) and RSS/JSON feed shape.
- `lib/formatters/date.ts` — date formatting/`NaN` fallback.

### Why it matters
These functions encode subtle rules (XML escaping order, slug normalization, related-post tie-breaking). A regression here corrupts feeds, canonical URLs, or SEO silently. Pure functions are the cheapest possible things to test and give high confidence per line of test code.

### Proposed change
Add **Vitest** (fast, zero-config for a Next app, no bundler migration):
1. Install:
```bash
pnpm add -D vitest
```
2. Add `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```
3. Create focused unit tests, e.g. `lib/server/feed.test.ts`:
```ts
import { describe, expect, it } from "vitest";
// If escapeXml is not exported, export it (or test via buildRssFeed output).

describe("escapeXml", () => {
  it("escapes all five entities", () => {
    expect(escapeXml(`<a href="x" & 'y'>`)).toBe(
      "&lt;a href=&quot;x&quot; &amp; &apos;y&apos;&gt;",
    );
  });
});
```
   Plus `slug.test.ts`, `schema.test.ts`, `related.test.ts`, `date.test.ts`.
4. Add `pnpm test` to CI (and optionally to `lefthook.yml` as a `pre-push` job — do not add to `pre-commit` to keep commits fast).

### Acceptance criteria
- `pnpm test` runs and passes with at least the five modules above covered, including edge cases (empty tags, invalid dates, `&`-first escaping order, trailing-slash slugs).
- Tests run in CI on push.

### Risk / notes
- `escapeXml` and `toFeedSummary` are currently module-private in `lib/server/feed.ts`; export them (or test through `buildRssFeed`). Prefer exporting the small helpers.
- Keep tests out of `pre-commit` (Lefthook currently runs only Biome there — `lefthook.yml`); add a `pre-push` or rely on CI.

---

## P-10 — Duplicated cache/no-cache branching in `posts/service.ts` + `unstable_cache`

- **Severity:** Medium
- **Effort:** Medium

### Problem
`lib/server/posts/service.ts` implements every public query twice — once cached (`unstable_cache`) and once inline for dev — with the logic copy-pasted:

- `getAllPosts` (lines 72-84) duplicates the sort/filter/map that `getAllPostsCached` (lines 34-43) already does.
- `getPostBySlug` (lines 86-108) duplicates the find/published logic of `getPostBySlugCached` (lines 53-70).
- `getAllTopics` (lines 110-120) duplicates `getAllTopicsCached`.

Driven by `shouldBypassCache = process.env.NODE_ENV !== "production"` (line 15). Additionally, `unstable_cache` is a legacy API in Next 16 (the platform is moving to the `use cache` directive / Cache Components), and these caches carry **no tags**, so they cannot be invalidated without a full rebuild.

### Why it matters
Duplicated logic drifts: a future change to filtering/sorting must be made in two places or dev and prod silently diverge. The bypass exists only to see draft/content changes without cache in dev — that can be expressed once.

### Proposed change
Collapse each pair into a single implementation, gating only the caching wrapper:
```ts
async function computeAllPosts(includeDrafts: boolean): Promise<PostSummary[]> {
  const posts = await loadAllPostContent();
  return sortPostsByDateDescending(filterPublishedPosts(posts, includeDrafts))
    .map(toPostSummary);
}

const getAllPostsCached = unstable_cache(computeAllPosts, ["posts:summaries"]);

export async function getAllPosts(options: PostQueryOptions = {}): Promise<PostSummary[]> {
  const includeDrafts = resolveIncludeDrafts(options.includeDrafts);
  return shouldBypassCache ? computeAllPosts(includeDrafts) : getAllPostsCached(includeDrafts);
}
```
Apply the same "compute once, wrap once" pattern to `getPostBySlug` and `getAllTopics`. Optionally (larger, separate task) evaluate migrating `unstable_cache` → `"use cache"` with `cacheTag`/`cacheLife` per the Next 16 Cache Components guidance, so future content updates can be revalidated by tag.

### Acceptance criteria
- Each public function has exactly one copy of its business logic; the only branch is cached-vs-uncached.
- Behavior is unchanged: dev shows drafts and live content edits; prod build statically generates the same pages (`pnpm build` output identical set of routes).

### Risk / notes
- `loadAllPostContent` is itself already dual-pathed (lines 28-32); the same simplification applies.
- The `unstable_cache`→`use cache` migration is optional and should be its own proposal to limit blast radius.

---

## P-11 — Reading time is manual frontmatter, not computed

- **Severity:** Medium
- **Effort:** Small

### Problem
`readingTime` is an optional, hand-entered frontmatter number (`lib/server/posts/schema.ts:38`, surfaced in `components/blog/post-meta.tsx:40-45` and used in `app/api/og/route.tsx:110`). Authors must compute and maintain it by hand; if omitted, the UI simply drops the "min read" badge.

### Why it matters
Manual reading time drifts from actual content and is easy to forget. Computing it from the post body is deterministic and removes an authoring chore.

### Proposed change
Compute reading time from `body` in the parse step and use it as a fallback when frontmatter omits it. In `lib/server/posts/parser.ts`:
```ts
function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225)); // ~225 wpm
}

export async function parsePostFile(filePath: string): Promise<PostContent> {
  const raw = await readPostSource(filePath);
  const { data, content } = matter(raw);
  const slug = toSlug(filePath);
  const frontmatter = parseFrontmatter(data, slug);
  return {
    ...frontmatter,
    readingTime: frontmatter.readingTime ?? estimateReadingTime(content),
    slug,
    body: content,
  };
}
```

### Acceptance criteria
- A post with no `readingTime` frontmatter shows a computed "N min read" badge on the card and post header.
- A post that specifies `readingTime` keeps the explicit value.
- `readingTime` remains typed as `number` on `PostContent`/`PostSummary` (`lib/types/posts.ts`).

### Risk / notes
- Word count over raw MDX includes component tags; the ±1 min imprecision is acceptable. For accuracy, strip MDX/JSX first, but that is optional polish.

---

## P-12 — No web app manifest / icon set

- **Severity:** Medium
- **Effort:** Small

### Problem
There is no `app/manifest.ts` (verified) and the only icon asset is `app/favicon.ico`. No `apple-touch-icon`, no PWA manifest, no themed maskable icons. `public/` contains only post images.

### Why it matters
A manifest and proper icons improve mobile "Add to Home Screen," browser tab/OS integration, and Lighthouse PWA/best-practices scores. It is a small, standard addition for a production site.

### Proposed change
1. Add `app/manifest.ts`:
```ts
import { type MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { DARK_THEME_COLOR } from "@/lib/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/blog",
    display: "standalone",
    background_color: DARK_THEME_COLOR,
    theme_color: DARK_THEME_COLOR,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```
2. Add `icon-192.png` and `icon-512.png` to `public/`, plus an `app/apple-icon.png` (180×180) which Next serves automatically as the apple-touch-icon. (Icons can be derived from the OG gradient/brand in `app/opengraph-image.tsx`.)

### Acceptance criteria
- `/manifest.webmanifest` is served and valid (Chrome DevTools → Application → Manifest shows no errors).
- The page `<head>` includes the manifest link and apple-touch-icon (Next injects these from `manifest.ts` and `app/apple-icon.png`).

### Risk / notes
- Requires producing two/three PNG icons; if brand icons do not exist yet, generate simple ones from the existing OG palette.

---

## P-13 — Markdown `img` uses empty `alt` default + forced `object-cover` crop

- **Severity:** Medium
- **Effort:** Small

### Problem
In `mdx-components.tsx:147-175`, the Markdown `img` renderer:
- Defaults `alt` to `""` for **any** image without alt text (line 152: `const imageAlt = alt ?? "";`). An empty alt marks an image decorative; content images without alt become invisible to screen readers with no warning.
- Forces every image into `aspect-video` + `object-cover` (lines 158, 165), which **crops** non-16:9 images (diagrams, portrait screenshots) silently.

(The richer `PostImage` component in `components/mdx/post-image.tsx` avoids cropping via `h-auto w-full`, but plain Markdown `![]()` images go through this component.)

### Why it matters
Empty-alt defaults are an accessibility (WCAG 1.1.1) and SEO regression; forced cropping distorts technical diagrams where detail matters. Both are silent.

### Proposed change
In `mdx-components.tsx` `img` component:
1. Warn (dev-only) when a content image lacks alt, instead of silently defaulting:
```tsx
if (alt == null && process.env.NODE_ENV !== "production") {
  console.warn(`Markdown image without alt text: ${src}`);
}
const imageAlt = alt ?? "";
```
2. Avoid mandatory cropping. Either render with intrinsic sizing (preferred for diagrams) using known dimensions, or keep `fill` only when an explicit aspect is desired. Minimal change: swap `object-cover` for `object-contain` so images are not cropped, or move plain images to the same `h-auto w-full` approach used by `PostImage`.

### Acceptance criteria
- A non-16:9 Markdown image renders without cropping.
- Authoring a Markdown image without alt logs a dev warning; images with alt are announced correctly by a screen reader.

### Risk / notes
- `object-contain` inside a fixed `aspect-video` box leaves letterboxing; if that is undesirable, switch to intrinsic `width`/`height` rendering (requires the image dimensions, which for arbitrary Markdown images are unknown — hence `object-contain` is the pragmatic default).

---

## P-14 — Hardcoded Umami analytics ID & script URL

- **Severity:** Low
- **Effort:** Small

### Problem
`app/layout.tsx:15-16` hardcodes `UMAMI_WEBSITE_ID` and `UMAMI_SCRIPT_URL` in source. The website ID and script origin are baked into the committed code.

### Why it matters
Configuration (especially anything environment-specific like an analytics ID or self-hosted Umami origin) belongs in env vars so it can differ per environment and be changed without a code edit. It also keeps the CSP allowlist (**P-01**) and the analytics origin in sync via one source of truth.

### Proposed change
Move to public env vars (they are non-secret but should be configurable):
```ts
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";
```
Render the Umami `<Script>` only when `UMAMI_WEBSITE_ID` is set. Document the vars in a committed `.env.example` (`.gitignore` already ignores `.env*` at line 34, so add `.env.example` as an explicit exception via `!.env.example`).

### Acceptance criteria
- With `NEXT_PUBLIC_UMAMI_WEBSITE_ID` unset, no Umami script loads (useful for local dev).
- With it set, analytics load exactly as before.
- `.env.example` lists both vars.

### Risk / notes
- `.gitignore` line 34 `.env*` will also ignore `.env.example`; add `!.env.example` beneath it so the example is committed.

---

## P-15 — `tsconfig` targets ES2017 and enables `allowJs`

- **Severity:** Low
- **Effort:** Small

### Problem
`tsconfig.json` sets `"target": "ES2017"` and `"allowJs": true`. The stack is React 19 + Next 16 + TS ~6; the codebase is entirely `.ts`/`.tsx` (no `.js` source), so `allowJs` is unnecessary, and ES2017 forces down-leveling of modern syntax.

### Why it matters
A modern `target` produces smaller, faster output and lets TS type modern language features accurately. Dropping `allowJs` slightly tightens the type surface.

### Proposed change
In `tsconfig.json` `compilerOptions`:
```jsonc
"target": "ES2022",
// remove "allowJs": true   (no .js sources exist)
```
Leave `moduleResolution: "bundler"`, `strict: true`, and the Next plugin as-is.

### Acceptance criteria
- `pnpm build` and `pnpm lint` succeed unchanged.
- No `.js` source file relies on `allowJs` (grep confirms none exist under `app|components|lib|hooks`).

### Risk / notes
- Purely a compiler setting; extremely low risk. If any tooling emits `.js` that must be typechecked, keep `allowJs`.

---

## P-16 — Root-layout default canonical is `/blog` (fragile)

- **Severity:** Low
- **Effort:** Small

### Problem
`app/layout.tsx:53-54` sets `alternates.canonical: "/blog"` at the **root layout** level, which makes `/blog` the default canonical for every route that does not override it. Post pages (`app/blog/[...slug]/page.tsx:51-53`) and the blog index (`app/blog/page.tsx:28-30`) do override it, so today it is correct — but any future top-level page that forgets to set its own canonical will incorrectly canonicalize to `/blog`.

### Why it matters
A layout-level canonical is a foot-gun: it silently mislabels new pages. Canonicals should be per-page.

### Proposed change
Remove `canonical: "/blog"` from the root layout `alternates` (keep the RSS/JSON `types` alternates there, which are genuinely site-wide). Set the canonical explicitly on each page that needs one (the two that matter already do). If a site-wide default is truly desired, prefer relying on `metadataBase` + per-page canonical rather than a hardcoded path in the layout.

### Acceptance criteria
- Root layout no longer sets a hardcoded canonical path; `/blog` and post pages still emit their correct `<link rel="canonical">` (unchanged output).
- A hypothetical new top-level route does not inherit a `/blog` canonical.

### Risk / notes
- Confirm no route relies on inheriting the layout canonical before removing it (only `not-found.tsx` lacks one, and 404s should not be canonicalized anyway).

---

## P-17 — RSS feed ships summary only (no full content)

- **Severity:** Low
- **Effort:** Small

### Problem
`lib/server/feed.ts` emits only a plain-text `<description>` (RSS, lines 106-114) and `content_text: item.summary` (JSON Feed, line 92). There is no `<content:encoded>` full-article HTML in RSS and no `content_html` in JSON Feed, so feed readers show only the blurb.

### Why it matters
Many readers subscribe specifically to read full posts in-reader. Summary-only feeds reduce reach for an audience that prefers RSS (a natural fit for an engineering blog).

### Proposed change
This is an enhancement, not a bug. If desired, render each post's MDX to HTML at build and include it:
- RSS: add the `content:encoded` namespace (`xmlns:content="http://purl.org/rss/1.0/modules/content/"`) to the `<rss>` element (currently only `atom` is declared, line 118) and emit `<content:encoded><![CDATA[...]]></content:encoded>` per item.
- JSON Feed: add `content_html` alongside `content_text`.
Rendering MDX→HTML outside React requires an MDX-to-HTML step (e.g. compile with the same remark/rehype plugins from **P-03/P-04**); scope accordingly.

### Acceptance criteria
- Feed items include full-article HTML; a feed validator (e.g. W3C Feed Validator) passes with the new namespace.

### Risk / notes
- Full-content feeds require sanitized, self-contained HTML; interactive MDX components (e.g. `StateMachinePlayground`) cannot render in a feed and must degrade to static fallbacks. This is why it is Low/optional.

---

## P-18 — Duplicated OG-card markup across 3 generators

- **Severity:** Low
- **Effort:** Small

### Problem
Three OG-image generators repeat nearly identical card JSX and inline styles:
- `app/opengraph-image.tsx:13-70`
- `app/api/og/route.tsx:20-76` (`renderCard`)
- `app/twitter-image.tsx` re-exports `opengraph-image` (fine), but the `/api/og` card is a separate copy of the same design (same gradient, padding, color palette).

### Why it matters
Design drift: a change to the OG look must be made in two places or the site's static OG image and per-post OG image diverge. Also, none of these load a custom font into `ImageResponse`, so text renders in a default system font rather than the site's Wotfard — a minor brand inconsistency.

### Proposed change
1. Extract a shared `renderOgCard({...})` helper (e.g. `lib/og-card.tsx`) returning the JSX, and have both `app/opengraph-image.tsx` and `app/api/og/route.tsx` call it.
2. Optionally load the brand font once and pass it via the `fonts` option of `ImageResponse` for on-brand OG text (read the `.woff2` from `app/fonts/wotfard/` at module load).

### Acceptance criteria
- OG card markup exists in exactly one module; both generators import it and produce visually identical output.
- (If fonts added) OG text renders in Wotfard.

### Risk / notes
- Loading fonts into `ImageResponse` adds a file read per render; combine with **P-06** caching so it is paid rarely.

---

## Appendix — Notable things done well (do not "fix")

For the implementer's context, these are already correct and should be preserved:

- **No-flash theming:** the `beforeInteractive` inline script in `app/layout.tsx:18-44` sets theme before paint; `suppressHydrationWarning` (line 110) and the `ssr:false` lazy toggle (`components/theme-toggle-lazy.tsx`) are intentional.
- **Accessibility basics:** skip link (`components/blog/site-shell.tsx:13-18`), `role="switch"` + `aria-checked` toggle (`components/theme-toggle.tsx:20-28`), `prefers-reduced-motion` handling (`app/globals.css:169,433`), `content-visibility` **with** `contain-intrinsic-size` (`app/globals.css:316-319`).
- **SSG correctness:** `dynamicParams = false` + `generateStaticParams` (`app/blog/[...slug]/page.tsx:22-29`), `force-static` feeds with sane `Cache-Control` (`app/feed.json/route.ts`, `app/rss.xml/route.ts`).
- **Type safety & lint:** `strict: true`, Biome with `noExplicitAny: error`, `noConsole: error` (`biome.json:41-49`).
- **Zod frontmatter validation** with fail-fast errors (`lib/server/posts/schema.ts`).
