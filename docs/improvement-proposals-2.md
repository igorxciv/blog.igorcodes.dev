# Improvement Proposals, Round 2 — blog.igorcodes.dev

> Date: 2026-07-06. Super-critical audit across five domains: correctness/architecture, performance/SEO/caching, security, accessibility/UX, and developer experience/tooling. Every finding was verified against the code at commit `33841ea`.
>
> **Stack:** Next.js `16.2.10` (App Router) · React `19.2.7` · Tailwind CSS v4 · TypeScript strict · MDX at runtime via `next-mdx-remote/rsc` · pnpm · Biome · lefthook · Vitest. Deployed on Vercel.
>
> **Previous round:** `docs/improvement-proposals.md` (P-01…P-18) is fully implemented. Do not re-do anything from that file. This document supersedes it as the active work list.

## Rules for the implementer

Read this section first. It applies to every proposal below.

1. **Work one proposal at a time, in phase order.** One commit per proposal, message format: `<type>: <short title> (R-NN)`.
2. **After every proposal**, run: `pnpm lint && pnpm exec tsc --noEmit && pnpm test`. All three must pass before committing. (After R-04 lands, this becomes `pnpm check`.)
3. **Do not refactor beyond the stated scope.** If you notice something else, note it in the commit body, don't fix it.
4. **Evidence line numbers** were correct at commit `33841ea`. If a file has drifted, search for the quoted code instead of trusting the line number.
5. Each proposal has **Acceptance criteria** — verify them literally before moving on.
6. Content is author-only (no user-generated content). Don't add defenses against the site's own MDX beyond what a proposal asks for.

## Summary table

| ID | Title | Severity | Effort | Domain |
|----|-------|----------|--------|--------|
| R-01 | Post cache persists across deployments → stale content | Critical | Small | Caching |
| R-02 | No CI pipeline at all | Critical | Small | DX |
| R-03 | One malformed post file takes down the entire site | High | Small | Correctness |
| R-04 | `tsc --noEmit` never runs anywhere; no `check` script | High | Small | DX |
| R-05 | Every build hard-depends on Vercel Blob + private token | High | Medium | DX/Build |
| R-06 | `/blog` index is dynamically rendered per request | High | Medium | Performance |
| R-07 | 8 font files (~269 KB) preloaded on every page | High | Small | Performance |
| R-08 | Playground client chunk ships on every post; duplicate registration | Medium | Small | Performance |
| R-09 | `/api/og`: immutable cache on unversioned URL; unbounded public input; dead branch | Medium | Small | Perf/Security |
| R-10 | CSP `'unsafe-inline'`, broad `img-src`, unescaped JSON-LD | Medium | Medium | Security |
| R-11 | Post images are PNG-only; remote `img` src crashes | Medium | Medium | Performance |
| R-12 | Transitive `postcss` CVE via `next` | Medium | Small | Security |
| R-13 | `prefers-reduced-motion` kill-switch defeated by specificity | High | Small | A11y |
| R-14 | Hard-coded `#ff5f56` text fails contrast in light theme | High | Small | A11y |
| R-15 | Markdown images with missing alt silently published | High | Small | A11y |
| R-16 | Post listings are not semantic lists | Medium | Small | A11y |
| R-17 | Scrollable code/table regions unreachable by keyboard | Medium | Small | A11y |
| R-18 | Playground state changes are silent to screen readers | Medium | Small | A11y |
| R-19 | Callout type conveyed by color only | Medium | Small | A11y |
| R-20 | Nested `<main>` landmark in loading state | Medium | Small | A11y |
| R-21 | Inline styles kill `:visited`/`:hover` on article links | Medium | Small | A11y |
| R-22 | 404 glitch animation runs 12 s (WCAG 2.2.2 limit is 5 s) | Medium | Small | A11y |
| R-23 | Reading progress bar: invisible track, wrong scope, redundant transition | Medium | Small | A11y/Perf |
| R-24 | No-JS users forced to dark theme regardless of OS preference | Medium | Small | A11y |
| R-25 | A11y papercuts batch (11 small fixes) | Low | Medium | A11y |
| R-26 | `toPostSummary` hand-copies 10 fields — silent-drop trap | Medium | Small | Architecture |
| R-27 | `lib/server/posts/` over-decomposed; dead component barrel | Medium | Medium | Architecture |
| R-28 | Feeds re-load post bodies O(n²) | Medium | Small | Architecture |
| R-29 | `getRelatedPosts` can leak drafts; redundant partition | Medium | Small | Correctness |
| R-30 | Frontmatter date schema accepts ambiguous inputs | Low | Small | Correctness |
| R-31 | Feed correctness batch (lastBuildDate, content_text, headers, sitemap) | Low | Small | SEO |
| R-32 | `/blog/random` burns a function invocation per click | Low | Small | Performance |
| R-33 | Untyped remark plugins; missing tests; reading time counts markup | Low | Medium | Code quality |
| R-34 | README.md wrong in nearly every operational section | High | Small | Docs |
| R-35 | AGENTS.md actively misleads coding agents | High | Small | Docs |
| R-36 | `writer.md`: wrong location, machine-specific absolute path | Medium | Small | DX |
| R-37 | Font-purge runbook says "pending" — the purge is done | Medium | Small | Docs |
| R-38 | No post scaffold, no content validation before deploy | Medium | Medium | DX |
| R-39 | Vitest include pattern silently drops future tests | Medium | Small | DX |
| R-40 | tsconfig: missing `noUncheckedIndexedAccess`; dead `allowJs` | Medium | Small | DX |
| R-41 | No Node version pin anywhere | Medium | Small | DX |
| R-42 | No automated dependency updates | Medium | Small | DX |
| R-43 | Biome `noDangerouslySetInnerHtml` disabled globally | Low | Small | Security |
| R-44 | Hygiene batch: `.stylelintignore`, `.env.example`, `security.txt` | Low | Small | Hygiene |

**Counts:** Critical 2 · High 10 · Medium 22 · Low 10.

---

# Phase 0 — Correctness & delivery pipeline

## R-01 — Post cache persists across deployments → stale content

- **Severity:** Critical · **Effort:** Small

### Problem
`lib/server/posts/service.ts:26-28` (and three sibling wrappers at ~`:43`, `:64-66`, `:73`) call `unstable_cache(fn, ["posts:content"])` with **no third argument** — no `revalidate`, no `tags`. `revalidate` therefore defaults to `false` (cache forever), and on Vercel the Data Cache **persists across deployments**. There is no `revalidateTag` call anywhere in the repo.

Consequence: edit a post's title and redeploy → any consumer that reads through these caches at request time keeps serving the **pre-deploy** data indefinitely. Affected request-time consumers: `app/api/og/route.tsx` (renders OG cards from `getPostBySlug`), `app/blog/random/route.ts`, and the dynamic `/blog` page (see R-06). Content also gets cached twice (once under `posts:content`, again per-slug).

### Fix
Content is immutable per deployment, so the cache must not outlive a deployment. Smallest correct change — add a deploy discriminator to every `unstable_cache` key in `lib/server/posts/service.ts`:

```ts
const deployId = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev";

const loadAllPostContentCached = unstable_cache(computeAllPostContent, [
  "posts:content",
  deployId,
]);
// …repeat for the other three wrappers in the same file.
```

Optional simplification (preferred if you're comfortable): replace `unstable_cache` entirely with `React.cache()` for per-request dedupe. For a filesystem read of a handful of markdown files, persistent caching buys nothing and created this bug class. If you do that, delete the `shouldBypassCache` branching too.

### Acceptance criteria
- Every `unstable_cache` call site in `service.ts` includes the deploy discriminator (or `unstable_cache` is gone in favor of `React.cache`).
- `pnpm test` passes; `grep -rn "unstable_cache" lib/` output matches the chosen approach.

---

## R-02 — No CI pipeline at all

- **Severity:** Critical · **Effort:** Small

### Problem
There is no `.github/` directory. Quality gates are two local lefthook hooks, trivially bypassed with `--no-verify` or a clone where `prepare` never ran. Vercel runs only `pnpm build`, so lint and tests have **zero enforced execution point**.

### Fix
Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc   # created in R-41; use '24' until then
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec biome ci .
      - run: pnpm exec tsc --noEmit
      - run: pnpm test
      - run: pnpm build
        env:
          BLOB_READ_WRITE_TOKEN: ${{ secrets.BLOB_READ_WRITE_TOKEN }}
```

Note: the `build` step needs the font strategy from R-05. Until R-05 lands, either add the Blob token as a GitHub Actions secret (as shown) or omit the build step and add it in R-05.

### Acceptance criteria
- Workflow file exists; a push to a branch triggers it; all steps green on GitHub.

---

## R-03 — One malformed post file takes down the entire site

- **Severity:** High · **Effort:** Small

### Problem
Two compounding issues:

1. `lib/server/posts/schema.ts:34-35` — `topics` and `tags` use `arrayFromStringOrArraySchema` with no `.optional()` and no `.default([])`. A post that simply omits `topics:` fails validation.
2. `lib/server/posts/schema.ts:47-49` — `parseFrontmatter` **throws** on any validation failure, and `lib/server/posts/service.ts:21-24` runs `Promise.all(files.map(parsePostFile))`, so one bad file rejects the whole promise.

Every consumer (`getAllPosts`, `getPostBySlug`, feeds, sitemap, `generateStaticParams`) funnels through this loader: one hand-authored typo 500s every listing, both feeds, the sitemap, and breaks the build.

### Fix
1. In `schema.ts`, make `topics` and `tags` default to empty: wrap with `.default([])` (keep the string-or-array coercion).
2. In `service.ts`, replace `Promise.all` with `Promise.allSettled`; keep fulfilled results, and for each rejection `console.error` the file path + error message, then skip the file. The site must render everything else.
3. Keep the throw inside `parseFrontmatter` (it's the per-file signal); the resilience belongs at the aggregation layer.

### Acceptance criteria
- Create a temp file `content/posts/2026/01/01/broken.mdx` containing only `---\ntitle: x\n---\nbody`. `pnpm dev` → `/blog` renders normally, the broken post is absent, an error naming the file appears in the server log. Delete the temp file afterwards.
- Add a Vitest case for the schema defaults (missing `topics`/`tags` → `[]`).

---

## R-04 — `tsc --noEmit` never runs anywhere; no aggregate check

- **Severity:** High · **Effort:** Small

### Problem
`package.json` has no `typecheck` script. Biome doesn't type-check. Lefthook runs Biome (pre-commit) and Vitest (pre-push) only. TypeScript is checked exclusively as a side effect of `next build` — which needs network + fonts — so a type error today survives commit, push, and tests, and dies on Vercel.

### Fix
1. Add to `package.json` scripts:
   ```json
   "typecheck": "tsc --noEmit",
   "check": "pnpm lint && pnpm typecheck && pnpm test"
   ```
2. In `lefthook.yml`, add to the `pre-push` group:
   ```yaml
   typecheck:
     run: pnpm typecheck
   ```

### Acceptance criteria
- `pnpm check` runs all three and passes.
- Introduce a deliberate type error, attempt `git push` → hook blocks. Revert.

---

## R-05 — Every build hard-depends on Vercel Blob + private token

- **Severity:** High · **Effort:** Medium

### Problem
`package.json:8` — `"build": "pnpm fonts:fetch && next build"`. `app/_tools/fetch-fonts.mjs:38-47` throws when font files are missing and `BLOB_READ_WRITE_TOKEN` is unset. `app/fonts/` is gitignored. So: any machine without the private token **cannot build** (and `pnpm dev` dies too, since `app/fonts.ts` uses `next/font/local`). Downloads are sequential with no retry; a Blob outage bricks all deploys including urgent fixes. The build also holds a read-**write** token when it only needs read.

### Fix
1. **Fallback path:** in `fetch-fonts.mjs`, when the token is absent and `FONTS_FALLBACK=1` (or when not on Vercel), skip fetching and instead write a marker; change `app/fonts.ts` to branch on that marker's absence is not possible statically — so instead do this concretely:
   - Add `app/fonts-fallback.ts` exporting the same variable names (`--font-wotfard`, `--font-dank-mono`) built from `next/font/google` (e.g. `Sora` or system stack) — same exported API.
   - In `fetch-fonts.mjs` fallback mode, copy `app/fonts-fallback.ts` over `app/fonts.ts`? **No — don't mutate source.** Simpler robust approach: make `fetch-fonts.mjs` in fallback mode generate valid placeholder font files by downloading nothing and instead copying a bundled open font (e.g. commit a small OFL-licensed woff2 pair under `app/_tools/fallback-fonts/`) into `app/fonts/` with the expected filenames. `next/font/local` then builds fine; typography is temporarily wrong, builds never break.
2. **Speed/resilience for the real path:** fetch with `Promise.all`, one retry per file, and cache into `.next/cache/fonts/` (restored across Vercel builds): check `.next/cache/fonts/` → check `app/fonts/` → fetch from Blob → populate both.
3. Document the whole mechanism in README (R-34) and add `# BLOB_READ_WRITE_TOKEN=` to `.env.example` (R-44).

### Acceptance criteria
- `FONTS_FALLBACK=1 pnpm build` succeeds on a machine with no token and empty `app/fonts/`.
- With the token, `pnpm fonts:fetch` twice in a row: second run does zero network fetches (cache hit, verify via log output).

---

## R-06 — `/blog` index is dynamically rendered on every request

- **Severity:** High · **Effort:** Medium

### Problem
`app/blog/page.tsx:10,21,64` — the page and its `generateMetadata` await `searchParams` (`?topic=`), which opts the entire route into **dynamic rendering**. The single most-trafficked page (effectively the homepage — `/` 308-redirects to it) is a serverless invocation per request: cold-start TTFB, function cost, no CDN HTML. The topic "filter" is just `<Link>`s (`components/blog/topic-filter.tsx`), so nothing needs request-time work. `app/blog/loading.tsx` exists purely to paper over this.

### Fix
Move topic filtering to a static path segment:

1. Create `app/blog/topics/[topic]/page.tsx`: same rendering as the index but filtered; `generateStaticParams()` returns `getAllTopics()`; keep the `noindex,follow` robots meta currently applied to `?topic` views.
2. `app/blog/page.tsx`: remove `searchParams` entirely; render the unfiltered list.
3. Update `components/blog/topic-filter.tsx` links from `/blog?topic=X` to `/blog/topics/X` (keep `aria-current` logic — derive active topic from the route param passed as prop).
4. Delete `app/blog/loading.tsx` (also fixes the nested-`<main>` issue R-20; if you keep a loading state anywhere, apply R-20's fix).
5. Add a permanent redirect for old URLs in `next.config.ts` `redirects()`: `/blog?topic=:topic` query redirects aren't supported directly — instead keep accepting the query param via a tiny middleware-free approach: it's acceptable to just let old `?topic` URLs render the unfiltered index (they were `noindex` anyway).

### Acceptance criteria
- `pnpm build` output marks `/blog` and every `/blog/topics/[topic]` as prerendered (`●`/`○`, not `ƒ`).
- Topic filtering still works by clicking topic chips; active topic is visually and `aria-current`-marked.

---

# Phase 1 — Performance & security hardening

## R-07 — 8 Wotfard files (~269 KB) preloaded on every page

- **Severity:** High · **Effort:** Small

### Problem
`app/fonts.ts:3-50` — the Wotfard `localFont` has 8 `src` entries (4 weights × roman + italic), no `preload: false`. `next/font/local` emits `<link rel="preload">` for **every** entry: ~269 KB of high-priority font fetches competing with LCP, including 4 italic faces rarely used above the fold and both 500 and 600 weights that are visually near-identical at body size. (Dank Mono at `app/fonts.ts:72` is correctly `preload: false` — the pattern was known.)

### Fix
1. Grep CSS/components for actual usage of weight 500 vs 600 (`font-medium`, `font-semibold`, inline `fontWeight`). Drop whichever of 500/600 is barely used from the `src` list (map its Tailwind utility to the surviving weight in `globals.css` if needed).
2. Split italics into a second `localFont` declaration with `preload: false`, exposed via the same CSS mechanism (declare it with `declarations`/`style: "italic"` matching so `font-style: italic` resolves; if merging into one family variable is awkward, keep one family but accept preload only for roman weights by splitting the family into `wotfard` (roman, preloaded) and `wotfardItalic` (italic, `preload: false`) and register both variables on `<body>`, with a `em, i { font-family: var(--font-wotfard-italic), var(--font-wotfard) }` rule).
3. Target end state: at most 3 preloaded font files (regular, one bold-ish weight, mono stays non-preloaded).

### Acceptance criteria
- `pnpm build && pnpm start`, view page source of `/blog`: at most 3 `<link rel="preload" as="font">` tags.
- Italic text in a post still renders italic Wotfard (visually verify on the post that uses emphasis).

---

## R-08 — Playground chunk ships on every post; duplicate registration

- **Severity:** Medium · **Effort:** Small

### Problem
`mdx-components.tsx:18` statically imports `StateMachinePlayground` (a 299-line `"use client"` component importing 7 lucide icons) and registers it in the shared `mdxComponents` map (`:172`) **and again** in `createPostMdxComponents` (`:179`) — the second registration is dead code. Because it's statically reachable, its client chunk is referenced by every `/blog/[...slug]` page; exactly one post uses it.

### Fix
1. Delete the redundant registration inside `createPostMdxComponents`.
2. Replace the static import with `next/dynamic`:
   ```ts
   const StateMachinePlayground = dynamic(() =>
     import("@/components/mdx/state-machine-playground").then(m => m.StateMachinePlayground),
   );
   ```
   (Adjust to the actual export name.) Registered in the map as before; the chunk now loads only when the tag renders.

### Acceptance criteria
- `pnpm build`; the First Load JS for `/blog/[...slug]` drops versus before (record both numbers in the commit message).
- The playground still works on `content/posts/2026/04/14/ai-doesnt-make-you-learn-faster.mdx`'s page.

---

## R-09 — `/api/og`: immutable cache on unversioned URL, unbounded public input, dead branch

- **Severity:** Medium · **Effort:** Small

### Problem
Three issues in `app/api/og/route.tsx`:
1. `:10-11` — `Cache-Control: public, immutable, s-maxage=31536000` on `/api/og?slug=…`. The URL never changes when the post does, so a fixed title/date never propagates to caches/crawlers. `immutable` on a mutable resource is a misuse.
2. No validation on `slug`: it's never reflected (safe — equality lookup only), but every unique garbage value (`?slug=random123`) is a CDN cache miss that invokes a CPU-heavy Satori render of the full "not found" card — a compute-amplification vector on the only public-input endpoint.
3. `:58-66` — a no-slug branch renders a site-level card duplicating `app/opengraph-image.tsx`. No caller ever omits `slug` (`app/blog/[...slug]/page.tsx:55`, `lib/seo.ts:104`). Dead defensive code duplicating brand copy.

### Fix
1. Version the URL: everywhere the OG URL is built (`lib/seo.ts` ~`:103-105` and the page metadata), append `&v=${post.updated ?? post.date}`. Keep the long max-age (now honest).
2. At the top of the handler:
   ```ts
   const slug = searchParams.get("slug");
   if (!slug || slug.length > 200 || !/^[a-z0-9/-]+$/.test(slug)) {
     return new Response("Bad Request", { status: 400 });
   }
   ```
3. For a valid-shaped but unknown slug, return a plain `404` response (cheap) instead of rendering the "not found" ImageResponse. Delete the no-slug branch (covered by the 400 above).

### Acceptance criteria
- `curl -I 'localhost:3000/api/og?slug=%3Cscript%3E'` → 400. `curl -I 'localhost:3000/api/og?slug=nope/nope'` → 404. A real post slug → 200 image.
- Rendered post page HTML contains the versioned OG URL (`og:image` includes `&v=`).

---

## R-10 — CSP `'unsafe-inline'`, broad `img-src`, unescaped JSON-LD

- **Severity:** Medium · **Effort:** Medium

### Problem
1. `next.config.ts:14` — `script-src 'self' 'unsafe-inline' https://cloud.umami.is`. `'unsafe-inline'` allows any inline script, which is the exact thing script-src exists to stop. The comment claims JSON-LD needs it — false: `type="application/ld+json"` blocks are data, not executable script. Only the theme-init script (`app/layout.tsx:22-48`) is genuinely executable inline JS, and it's a **static string** — hashable, no nonce/middleware needed.
2. `next.config.ts:16` — `img-src 'self' data: https:` allows images from any HTTPS origin.
3. All JSON-LD call sites (`app/layout.tsx`, `app/blog/page.tsx`, `app/blog/[...slug]/page.tsx`) inject `JSON.stringify(...)` via `dangerouslySetInnerHTML` without escaping `<`. A `</script>` sequence in a title would break out of the script element (author-only content ⇒ low risk, but standard hardening).

### Fix
1. Compute the SHA-256 of the exact theme-init script string and replace `'unsafe-inline'`:
   ```
   script-src 'self' 'sha256-<hash>' https://cloud.umami.is
   ```
   Compute with: `echo -n '<exact script text>' | openssl dgst -sha256 -binary | openssl base64`. **Important:** the hash must cover the exact bytes passed to the `<Script>` child. Add a comment in `next.config.ts` and next to the script definition telling future editors to recompute the hash when the script changes (a mismatch fails closed — theme flashes but nothing breaks).
2. Narrow `img-src` to `'self' data:` plus any concrete external image hosts actually used (currently none — check `content/` for `https://` image references first).
3. Create a shared helper in `lib/seo.ts`:
   ```ts
   export function jsonLdString(data: unknown): string {
     return JSON.stringify(data)
       .replace(/</g, "\\u003c")
       .replace(/>/g, "\\u003e")
       .replace(/&/g, "\\u0026")
       .replace(/\u{2028}/gu, "\\u2028")
       .replace(/\u{2029}/gu, "\\u2029");
   }
   ```
   Use it at every JSON-LD call site.

### Acceptance criteria
- `pnpm build && pnpm start`; in the browser: theme toggling and initial theme still work (no CSP violation in console); Umami loads; Google's Rich Results test (or just JSON parse of the script tag contents) still validates the Article JSON-LD.
- Response header contains no `'unsafe-inline'` in `script-src`.

---

## R-11 — Post images are PNG-only; remote `img` src crashes

- **Severity:** Medium · **Effort:** Medium

### Problem
1. `components/mdx/post-image.tsx:44-64` renders a hand-rolled `<picture>` from the registry in `lib/post-images.ts`, whose only entries use `"png"` (desktop-2x is 73 KB / 1792×1008). The registry models `avif`/`webp` extensions (`lib/post-images.ts:22`) but nothing generates them — forfeiting the typical 3-5× savings for illustration-style graphics. `priority` defaults to `false` with nothing enforcing it for lead images.
2. `mdx-components.tsx:108-140` routes every markdown `![...]` through `next/image` with the raw src and there is **no `images` config** in `next.config.ts` — the first remote image URL in a post throws "hostname not configured" at build/request time. Also `:123` forces `aspect-video` + `object-contain` on all markdown images: silent letterboxing of non-16:9 images.

### Fix (choose the simple path)
Replace `PostImage`'s hand-rolled pipeline with `next/image`:
1. In `post-image.tsx`, render `<Image src={desktop1x.src} width height sizes="(min-width: 1024px) 896px, 100vw" priority={priority} …/>` — Vercel's optimizer handles AVIF/WebP negotiation and DPR for free.
2. Shrink `lib/post-images.ts` registry to one asset per image (src/width/height/alt-required); delete the 6-variant mobile/tablet/desktop × 1x/2x machinery.
3. Make the **first** `PostImage` in a post default to `priority` (simplest: keep the prop but set it in the one post that opens with an image; a robust automatic version is out of scope).
4. In the markdown `img` mapping, throw a descriptive error when `src` starts with `http` ("local images only — put assets under public/images/posts/…"), and remove the forced `aspect-video`; require/derive real dimensions instead (images without known dimensions: keep the current box as fallback).

### Acceptance criteria
- The post with images serves AVIF or WebP (check the `content-type` of the image request in devtools against `pnpm start`).
- A markdown image with an `https://` src fails the build with the descriptive error (test with a temp post, then delete it).
- `pnpm exec tsc --noEmit` passes after the registry shrink.

---

## R-12 — Transitive `postcss` CVE via `next`

- **Severity:** Medium · **Effort:** Small

### Problem
`pnpm audit` reports `next > postcss@8.4.31` (GHSA-qx2v-qp2m-jg93, moderate, fixed ≥ 8.5.10). Build-time only, no untrusted CSS here — hygiene fix.

### Fix
Add to `package.json`:
```json
"pnpm": { "overrides": { "postcss@<8.5.10": ">=8.5.10" } }
```
Then `pnpm install`.

### Acceptance criteria
- `pnpm audit --prod` reports zero advisories; `pnpm build` still succeeds.

---

# Phase 2 — Accessibility

## R-13 — `prefers-reduced-motion` kill-switch defeated by specificity

- **Severity:** High · **Effort:** Small

### Problem
`app/globals.css:438-443` resets motion with `*, *::before, *::after { animation: none; transition-duration: 0s; }` — specificity (0,0,0), which **loses** to:
- `.fade-in` (`globals.css:201`) — applied to the whole blog index (`app/blog/page.tsx:93`) and post page (`app/blog/[...slug]/page.tsx:121`), so the translateY entrance animation still runs for reduced-motion users;
- Tailwind's `.animate-pulse` (`app/blog/loading.tsx:7`);
- the theme transition `:root[data-theme-transition] body :where(…)` (`globals.css:130`);
- `.theme-toggle` / `.theme-toggle-icon` transitions (`globals.css:346,380`).

### Fix
In the reduced-motion block, use:
```css
*, *::before, *::after {
  animation: none !important;
  transition-duration: 0.01ms !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}
```
Keep the existing `transform: none` resets. (Alternative per-site-of-use `motion-safe:` Tailwind variants — `not-found-page.tsx:119,144` already does it right — but the `!important` block is the reliable global backstop.)

### Acceptance criteria
- With OS reduced-motion enabled (or devtools emulation), loading `/blog` and a post shows no entrance animation, theme toggle switches instantly, loading dot doesn't pulse.

---

## R-14 — Hard-coded `#ff5f56` text fails contrast in light theme

- **Severity:** High · **Effort:** Small

### Problem
`components/blog/not-found-page.tsx:150` — body text `text-[#ff5f56]` regardless of theme. On the light background `#f6f1e8` (`app/globals.css:73`) that's ~2.7:1, far below the 4.5:1 AA minimum. Fine on dark.

### Fix
Add a themed custom property in `globals.css`: `--fm-danger: #ff5f56;` in the dark root, `--fm-danger: #b3261e;` (or similar ≥4.5:1 red on `#f6f1e8`) in the `:root[data-theme="light"]` block. Use `text-(--fm-danger)` at the call site. The decorative terminal dot at `:125` may keep the raw hex (it's `aria-hidden` decoration, not text).

### Acceptance criteria
- Contrast of the new light-theme value vs `#f6f1e8` computes ≥ 4.5:1 (verify with any contrast checker).
- 404 page renders the message legibly in both themes.

---

## R-15 — Markdown images with missing alt are silently published

- **Severity:** High · **Effort:** Small

### Problem
`mdx-components.tsx:113-117` — missing alt on a markdown image produces a dev-only `console.warn`, then ships `alt=""` (actively hidden from screen readers). The only guard is a warning nobody must see. This is the classic WCAG 1.1.1 failure mode for a content blog.

### Fix
Throw instead of warn when `alt == null` (in all environments): the build then fails with a message naming the image src and telling the author to add alt text (or explicitly `![""](…)`-style empty alt for genuinely decorative images — document that convention in `content/posts/AGENTS.md`). This pairs with the `posts:validate` script in R-38.

### Acceptance criteria
- A temp post with `![](/images/x.png)` fails `pnpm build` with a message containing the src. Delete temp post.
- Explicit empty-alt convention documented in `content/posts/AGENTS.md`.

---

## R-16 — Post listings are not semantic lists

- **Severity:** Medium · **Effort:** Small

### Problem
`components/blog/post-list-section.tsx:24-28` renders posts as sibling `<article>`s in a bare `<div>`; same for the related-posts grid (`components/blog/related-posts.tsx:41-74`). Screen-reader users get no "list, N items" announcement or per-item position — the primary navigation affordance on an index. (`topic-filter.tsx:63-80` already does this correctly with `<ul>/<li>`.)

### Fix
In both components, wrap items in `<ul>` (with `list-none` styling as needed) and each card in `<li><article>…</article></li>`. Move the grid/stack layout classes to the `<ul>`.

### Acceptance criteria
- Rendered HTML for `/blog` and a post's "Further reading" section shows `ul > li > article`. Visual layout unchanged (compare before/after screenshots).

---

## R-17 — Scrollable code/table regions unreachable by keyboard

- **Severity:** Medium · **Effort:** Small

### Problem
Horizontally scrollable containers with no focusable content can't be scrolled by keyboard (WCAG 2.1.1): `mdx-components.tsx:78-83` (`pre`), `:85` (table wrapper), `components/mdx/mdx-article-visuals.tsx:313` and `:339`, `components/mdx/state-machine-playground.tsx:228`.

### Fix
Add `tabIndex={0}` + `role="region"` + an `aria-label` to each overflow container: "Code sample", "Table", "Diagram", "State output" respectively. Ensure the global `:focus-visible` outline applies (it's a `*`-scoped rule at `globals.css:210-221`, so it should).

### Acceptance criteria
- Tab reaches a wide code block on a narrow viewport; arrow keys scroll it horizontally; a visible focus outline appears.

---

## R-18 — Playground state changes are silent to screen readers

- **Severity:** Medium · **Effort:** Small

### Problem
`components/mdx/state-machine-playground.tsx:141-149` (metrics), `:228-249` (JSON output), `:253-277` (buttons) — activating "Answer next field" / "Replay" / the range slider mutates tokens/latency/field statuses with **no `aria-live` region**; non-visual users act into silence. (The History/State toggles correctly use `aria-pressed`.)

### Fix
1. Wrap the metrics row (or add a visually-hidden one-sentence summary element, e.g. "Turn 3 of 6, 420 tokens used") with `aria-live="polite"`.
2. Give the range input `aria-valuetext` describing the current turn.

### Acceptance criteria
- With VoiceOver (or reading the DOM), the live region exists and its text content changes when clicking "Answer next field".

---

## R-19 — Callout type conveyed by color only

- **Severity:** Medium · **Effort:** Small

### Problem
`components/mdx/mdx-callout.tsx:27-38` — the type icon is `aria-hidden` and only rendered **when a title exists**; an untitled "warning" vs "note" differs only by border/background color (WCAG 1.4.1). Each callout is also an `<aside>` → repeated unnamed complementary landmarks add noise inside articles.

### Fix
1. Always render a visually-hidden type prefix: `<span className="sr-only">{type}: </span>`.
2. Change the wrapper from `<aside>` to `<div role="note" aria-label={title ?? type}>`.

### Acceptance criteria
- DOM of an untitled callout contains the sr-only type text; no `<aside>` remains in `mdx-callout.tsx`.

---

## R-20 — Nested `<main>` landmark in loading state

- **Severity:** Medium · **Effort:** Small

### Problem
`app/blog/loading.tsx:3` renders `<main>`, which streams **inside** `SiteShell`'s `<main id="main-content">` (`components/blog/site-shell.tsx:45`) — invalid HTML, duplicate landmarks. The "Loading" text also has no `role="status"`, so the pending state is never announced.

### Fix
If R-06 deleted `loading.tsx`, this is done. Otherwise change its root to `<div role="status" aria-label="Loading">…</div>`.

### Acceptance criteria
- No route segment file renders a `<main>` element (only `SiteShell` does): `grep -rn "<main" app components` shows exactly one hit in `site-shell.tsx`.

---

## R-21 — Inline styles kill `:visited`/`:hover` on article links

- **Severity:** Medium · **Effort:** Small

### Problem
`mdx-components.tsx:152-159` sets `style={{ color: "var(--accent)", textDecorationColor: "var(--accent)", … }}` on every content link. Inline styles outrank `.prose-blog a:visited` (`globals.css:281-284`), `.prose-blog a:hover` (`:286-290`), and the component's own `hover:text-(--accent-strong)` class — visited-link differentiation and hover feedback in prose are dead code.

### Fix
Delete the inline `style` object from the anchor mapping; the existing classes + `.prose-blog` rules already provide the colors.

### Acceptance criteria
- In a post, hovering a content link visibly changes its color; a visited link renders the `:visited` color. `grep -n "style=" mdx-components.tsx` shows no color styles on the `a` mapping.

---

## R-22 — 404 glitch animation runs 12 s with no pause control

- **Severity:** Medium · **Effort:** Small

### Problem
`components/blog/not-found-page.tsx:65-73` — the glitch interval mutates the giant 404 text every 160 ms and auto-stops only after 12 000 ms. WCAG 2.2.2 requires a pause/stop/hide mechanism for moving content lasting > 5 s **for all users** — the existing reduced-motion/saveData gating (`:11-22`, good) doesn't satisfy it.

### Fix
Change the auto-stop timeout from 12 000 to ≤ 4 500 ms (one short burst). No pause button needed if total duration ≤ 5 s.

### Acceptance criteria
- Constant in the file is ≤ 5000; glitching visibly stops within 5 s of page load.

---

## R-23 — Reading progress bar: invisible track, wrong scope, redundant transition

- **Severity:** Medium · **Effort:** Small

### Problem
1. `components/blog/reading-progress.tsx:9-11` — track uses `bg-white/5`: effectively invisible on the light cream background `#f6f1e8`.
2. `hooks/useReadingProgress.ts:18-22` measures `document.documentElement.scrollHeight`, so "100 %" is reached only past the Further-reading grid and footer — it misrepresents article completion.
3. `reading-progress.tsx:15` combines `transition-[transform] duration-150` **with** per-frame rAF transform updates — the transition re-interpolates every frame's target, so the bar perpetually lags scroll while doing redundant style work.
4. The whole widget is `aria-hidden` — acceptable as deliberately decorative, but record the decision.

### Fix
1. Track color: `background: color-mix(in srgb, var(--foreground) 8%, transparent)` (via arbitrary value class or a CSS rule).
2. Measure the article: accept a ref/element id (the post body wrapper), compute progress from its `offsetTop`/`offsetHeight` against scroll position.
3. Remove `transition-[transform] duration-150` (rAF already smooths).
4. Add a one-line comment: decorative by design, hence `aria-hidden`.

### Acceptance criteria
- Track visible in light theme; bar reaches ~100 % when the article's last paragraph scrolls past, not at the page footer; bar tracks scroll without lag.

---

## R-24 — No-JS users forced to dark theme regardless of OS preference

- **Severity:** Medium · **Effort:** Small

### Problem
`app/globals.css:8-69` — `:root` defaults to dark; light activates only via `:root[data-theme="light"]`, set exclusively by JS (`app/layout.tsx:36`, `hooks/useTheme.ts:71`). With JS disabled/blocked, an OS-prefers-light user gets a forced dark page.

### Fix
Add to `globals.css`:
```css
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    /* duplicate the custom-property values from :root[data-theme="light"] */
  }
}
```
To avoid duplicating the value block, restructure so light values live in a shared place: define them once under a selector list `:root[data-theme="light"], @media-wrapped :root:not([data-theme])` — CSS can't share those directly, so either duplicate (add a comment to keep in sync) or move the light palette into a `@layer` custom-property set referenced twice. Duplication with a comment is acceptable.

### Acceptance criteria
- Disable JS in devtools, emulate `prefers-color-scheme: light`, reload → page renders light. With JS on, manual toggle still overrides.

---

## R-25 — A11y papercuts batch

- **Severity:** Low · **Effort:** Medium (11 independent one-liners; do in one commit)

1. **No `<nav>` landmark**: `components/blog/site-shell.tsx:20-42` — wrap header links in `<nav aria-label="Primary">`. The compact `FeedLinks` (`feed-links.tsx`) should be `<nav aria-label="Feeds">`.
2. **Skip-link target not focusable**: `site-shell.tsx:45` — add `tabIndex={-1}` to `<main id="main-content">`.
3. **Sub-11px text**: `post-card.tsx:42,96` (`text-[10px]`), `related-posts.tsx:50`, `state-machine-playground.tsx:288`, `mdx-article-visuals.tsx:139,375` (`text-[0.68rem]`) — floor at `0.72rem`, never hard `px` for text.
4. **Feed links over-labelled**: `feed-links.tsx:42-47` — each link has `aria-label` + `title` + sr-only span with the same text; orphaned sr-only "Syndication feeds" at `:34`. Keep only `aria-label="RSS feed"` / `"JSON feed"`; delete `title` and sr-only duplicates.
5. **Heading levels**: `mdx-components.tsx:21-27` maps content `h1` while the page already renders the post title as `h1` (`post-page-header.tsx:35`) — render content `h1` as `h2`. Hard-coded `<h3>` in `mdx-article-visuals.tsx:85,212,281` and `state-machine-playground.tsx:99`: accept a `headingLevel` prop defaulting to 3.
6. **Related cards dead click zone**: `related-posts.tsx:48-59` — whole card has hover affordance but only the title is a link; use the stretched-link pattern (`relative` on card, `after:absolute after:inset-0` on the title link).
7. **`global-error.tsx` unthemed**: add `<meta name="viewport" content="width=device-width, initial-scale=1">` and `color-scheme: light dark` (it replaces the root layout, so dark-mode users currently get a default white page with no viewport meta).
8. **Topic announced twice**: `post-page-header.tsx:15-34` — add `aria-hidden="true"` to the decorative banner block that repeats the topic before the linked topic.
9. **`overflow-x: hidden` on body**: `globals.css:124` — remove (or use `overflow-x: clip`); it masks real overflow bugs and can break sticky headers.
10. **Prose line length**: `app/blog/[...slug]/page.tsx:121` `lg:max-w-4xl` at `lg:text-[1.12rem]` yields ~95-105 CPL. Cap prose at `max-w-3xl` (or `70ch`) at all breakpoints; let wide elements (tables/figures) break out with negative margins if desired.
11. **Theme toggle**: `components/theme-toggle-lazy.tsx` is `ssr:false` so the control doesn't exist until hydration, and one toggle permanently kills the OS-preference listener (`useTheme.ts:109-117`). Optional improvement: SSR the button; add a three-state light/system/dark cycle. If skipped, add a code comment acknowledging the trade-off.

### Acceptance criteria
- Each numbered item verified individually (DOM inspection for 1,2,4,5,6,8; visual for 3,7,9,10; behavioral for 11 if implemented). `pnpm check` green.

---

# Phase 3 — Architecture & code quality

## R-26 — `toPostSummary` hand-copies 10 fields

- **Severity:** Medium · **Effort:** Small

### Problem
`lib/server/posts/mappers.ts:3-16` — `PostContent = PostSummary & { body }`, so a summary is "the post minus `body`", yet the mapper enumerates all ten fields by hand. Adding a frontmatter field silently drops it from every card/feed with no type error.

### Fix
```ts
export function toPostSummary(post: PostContent): PostSummary {
  const { body, ...summary } = post;
  return summary;
}
```

### Acceptance criteria
- `pnpm check` green; the mapper contains no field enumeration.

---

## R-27 — `lib/server/posts/` over-decomposed; dead component barrel

- **Severity:** Medium · **Effort:** Medium

### Problem
1. Eleven modules to read markdown off disk; several are 3-7 lines (`types.ts`: 3, `constants.ts`: 5, `options.ts`: 7). Every trivial helper is an import hop; the layering buys no isolation a personal blog needs.
2. `components/blog/index.ts` — barrel re-exporting 7 components; `grep -rn 'from "@/components/blog"' --include='*.tsx' .` returns **zero** consumers (everyone imports concrete paths). Pure overhead + tree-shaking hazard.

### Fix
1. Merge `types.ts`, `constants.ts`, `options.ts`, `mappers.ts`, `collections.ts`, `slug.ts` into two files: keep domain logic in `service.ts` and one `helpers.ts` (or fold into existing files where they're used). Keep `schema.ts`, `parser.ts`, `filesystem.ts`, `related.ts` as-is. Preserve the public facade `lib/server/posts.ts` unchanged (it is NOT dead — it's the `server-only`-guarded entry point with 6 consumers).
2. Update the moved files' imports and their `*.test.ts` files.
3. Delete `components/blog/index.ts`.

### Acceptance criteria
- `pnpm check` green; `ls lib/server/posts/` shows ≤ 7 source files; barrel gone; no import of `@/components/blog` (bare) anywhere.

---

## R-28 — Feeds re-load post bodies O(n²)

- **Severity:** Medium · **Effort:** Small

### Problem
`lib/server/feed.ts:33-52` — `getFeedItems` calls `getAllPosts()` (which strips `body` via `toPostSummary`), then calls `getPostBySlug(post.slug)` per post to get `body` back — an O(n) `.find` per post (O(n²) total) plus redundant mapping, purely because no accessor exposes full content.

### Fix
Export a `getAllPostContent(): Promise<PostContent[]>` from the posts facade (the loader already exists internally) and build feed items from it directly; delete the per-slug re-fetch loop.

### Acceptance criteria
- `lib/server/feed.ts` contains no `getPostBySlug` call; feed unit tests (`feed-utils.test.ts`) pass; `curl localhost:3000/rss.xml` output unchanged versus before (diff it).

---

## R-29 — `getRelatedPosts` can leak drafts; redundant partition

- **Severity:** Medium · **Effort:** Small

### Problem
1. `lib/server/posts/related.ts:52-61` — the function filters only what the caller passes. `app/blog/[...slug]/page.tsx:106-107` passes `getAllPosts()`, which **includes drafts outside production**. Production is currently safe, but the function has no internal published guard; any future caller forwarding drafts leaks them into "Further reading".
2. Same lines — `scoredCandidates` is already sorted score-desc, so partitioning into `relatedPosts`/`fallbackPosts` and concatenating is a no-op; `scoredCandidates.slice(0, limit).map(c => c.post)` is identical.

### Fix
Filter `posts` to `published` at the top of `getRelatedPosts`; replace the partition with the single `slice().map()`. Update/extend `related.test.ts` to cover the draft-exclusion case.

### Acceptance criteria
- New test: a draft candidate never appears in results. `pnpm test` green.

---

## R-30 — Frontmatter date schema accepts ambiguous inputs

- **Severity:** Low · **Effort:** Small

### Problem
`lib/server/posts/schema.ts:4-9` — `dateStringSchema` relies on `Date.parse`, which accepts implementation-dependent/ambiguous inputs; an invalid date can slip through and render as `Invalid Date` in feeds/JSON-LD.

### Fix
Require explicit `YYYY-MM-DD` (regex `^\d{4}-\d{2}-\d{2}$`) and then verify it round-trips through `Date` to a real calendar date (reject `2026-02-31`). Add schema tests for: valid date, malformed shape, impossible date.

### Acceptance criteria
- `schema.test.ts` covers the three cases; all existing posts still validate (`pnpm build` or R-38's `posts:validate` passes).

---

## R-31 — Feed correctness batch

- **Severity:** Low · **Effort:** Small

### Problem & fix (four independent one-liners)
1. `lib/server/feed.ts:65` — `updatedAt: items[0]?.modifiedAt` takes the newest-**published** item's date; updating an older post never bumps `lastBuildDate`, so readers may skip fetching. Fix: `max(items.map(i => +i.modifiedAt))`.
2. `app/sitemap.ts:11-13` — same latent logic for `/blog`'s `lastModified`. Same fix.
3. `lib/server/feed.ts:86-87` — JSON Feed emits `content_text: item.summary` alongside full `content_html`; the spec allows both only as equivalent representations, and some readers prefer `content_text`, showing a one-liner instead of the article. Fix: delete `content_text` (keep `summary` + `content_html`).
4. `app/rss.xml/route.ts:3,11` and `app/feed.json/route.ts:3,11` — `force-static` (built once per deploy) combined with `stale-while-revalidate=86400` implies revalidation that never happens. Fix: keep `force-static`, simplify header to `public, max-age=0, s-maxage=3600`.

### Acceptance criteria
- `feed-utils.test.ts`/new tests updated; `curl localhost:3000/feed.json | jq` has no `content_text`; RSS `lastBuildDate` equals the max `updated ?? date` across posts.

---

## R-32 — `/blog/random` burns a function invocation per click

- **Severity:** Low · **Effort:** Small

### Problem
`app/blog/random/route.ts:4-15` — `force-dynamic` route reads the cached post list and issues a 307 to pick a random array element: a serverless invocation per click, and crawlers can walk into arbitrary 307s (linked from the index without `nofollow`).

### Fix
Make `RandomPostButton` a client component that receives the slug list as props from the static index page and does `router.push(list[Math.floor(Math.random() * list.length)])`. Delete `app/blog/random/route.ts`.

### Acceptance criteria
- Button still navigates to a random post; the route file is gone; no network request to `/blog/random` occurs (check devtools).

---

## R-33 — Untyped remark plugins; missing tests; reading time counts markup

- **Severity:** Low · **Effort:** Medium

### Problem
1. `lib/mdx/remark-strip-mdx.ts:7,11,35` and `lib/mdx/remark-text-fences.ts:15,26,30,40` — every AST node is `any`; a typo like `node.childern` compiles.
2. Untested high-value pure logic: `collectTopics` (dedupe + locale sort), `sortPostsByDateDescending`, `filterPublishedPosts`, `estimateReadingTime` (the `Math.max(1, round(words/225))` boundary).
3. `lib/server/posts/parser.ts:9-12` — reading time is computed over raw MDX including `<Callout>` etc. markup, inflating estimates; the strip pipeline already exists for feeds.

### Fix
1. Type the plugins against `mdast` / `unist` types (`Node`, `Parent`, and `mdast-util-mdx-jsx` for JSX nodes); remove the Biome `any` override for `lib/mdx/**` if it becomes unnecessary.
2. Add Vitest cases for the four functions (empty input, duplicates, ordering, the words=0 → 1 min boundary).
3. Run the existing `remarkStripMdx` text extraction before word counting.

### Acceptance criteria
- `pnpm check` green; no `any` in `lib/mdx/`; new tests exist and pass; reading time for the playground post decreases (spot-check the rendered value).

---

# Phase 4 — DX, docs, hygiene

## R-34 — README.md wrong in nearly every operational section

- **Severity:** High · **Effort:** Small

### Problem
`README.md:19` claims "ESLint + Stylelint + Husky + lint-staged" (all removed); `:17,87` claim MDX via `@next/mdx` (directly contradicted by `next.config.ts`'s comment — the runtime path is `next-mdx-remote/rsc` and `pageExtensions` is ts/tsx only); `:95-101` document `npm run lint:eslint` / `lint:styles` (don't exist); `:108` says `npm install`; `:126` says "No testing framework is configured yet" (there are 5 test files); `:119-122` omit the Umami vars and `BLOB_READ_WRITE_TOKEN` that the build depends on. No mention of pnpm, Biome, lefthook, Vitest, or the fonts mechanism.

### Fix
Rewrite the Tech Stack, Scripts, Local Development, Environment, and Notes sections against reality (pnpm scripts from `package.json`, Biome, lefthook, Vitest, `next-mdx-remote/rsc`). Add a **Fonts** section: adapt the "How builds get the fonts now" prose from `docs/purge-fonts-from-history.md`, including the fallback mode from R-05. Update the project-structure tree (it's missing `hooks/`, `components/blog/`, `app/_tools/`, feeds, etc.).

### Acceptance criteria
- Every command in README executes successfully as written; no reference to ESLint/Stylelint/Husky/npm/@next/mdx remains (`grep -inE 'eslint|stylelint|husky|npm run|@next/mdx' README.md` → empty).

---

## R-35 — AGENTS.md actively misleads coding agents

- **Severity:** High · **Effort:** Small

### Problem
Root `AGENTS.md:31-35` mandates `@next/mdx` (removed); `:38-41` documents `npm run …` and "ESLint + Stylelint"; `:50-52` says "No testing framework is configured yet. If tests are added, document the framework and command in this file" — tests were added; the file wasn't updated, breaking its own rule. In an agent-heavy workflow this is the highest-leverage doc and it starts every session with false premises. Also `content/posts/AGENTS.md:98` still references `npm run lint`/`npm run build`.

### Fix
Update root `AGENTS.md`: Build/Test/Run → `pnpm dev|build|lint|test|typecheck|check`; MDX Rules → `next-mdx-remote/rsc` + `mdx-components.tsx` mapping (delete the `@next/mdx` mandate); Testing → Vitest, `lib/**/*.test.ts` convention (widen after R-39), `pnpm test`. Fix the `npm` → `pnpm` references in `content/posts/AGENTS.md`.

### Acceptance criteria
- `grep -inE 'eslint|stylelint|husky|npm run|@next/mdx' AGENTS.md content/posts/AGENTS.md` → empty.

---

## R-36 — `writer.md`: wrong location, machine-specific absolute path

- **Severity:** Medium · **Effort:** Small

### Problem
`writer.md` at repo root is an agent definition (frontmatter `name: blog-post-writer`), violating the repo's own rule (`AGENTS.md:19`: no new root files). Its "non-negotiable style rule" hard-requires `/Users/igorxciv/.pi/agent/references/my-writing-style-reference.md` — a path that exists on exactly one laptop, so the agent silently degrades anywhere else. Its output dir `markdown-drafts/` is gitignored, so drafts have no versioning.

### Fix
1. Move to `.claude/agents/blog-post-writer.md`.
2. Copy the style reference into the repo as `docs/writing-style.md` and reference it by repo-relative path.
3. Decide on drafts: either commit them (remove the gitignore line) or note in the agent file that drafts are ephemeral.

### Acceptance criteria
- Root contains no `writer.md`; the agent file references only repo-relative paths.

---

## R-37 — Font-purge runbook says "pending" — the purge is done

- **Severity:** Medium · **Effort:** Small

### Problem
`docs/purge-fonts-from-history.md` header says "**Status: pending** … they still exist in earlier commits", but verification passes today: `git rev-list --all --objects | grep -iE '\.(woff2?|otf|ttf)$'` returns **nothing** and `main` == `origin/main`. Anyone (human or agent) following the doc would re-run a destructive `git filter-repo` + force-push for nothing.

### Fix
Flip the status line to "**Status: completed** (verified 2026-07-06 — object scan clean)". Move the "How builds get the fonts now" section into README (done in R-34), and leave the rest as historical record (or delete the file; either is fine).

### Acceptance criteria
- The doc no longer instructs anyone to run a purge.

---

## R-38 — No post scaffold, no content validation before deploy

- **Severity:** Medium · **Effort:** Medium

### Problem
No `new-post` script exists; the authoring ritual is: create `content/posts/YYYY/MM/DD/slug.mdx` by hand, fill 6 frontmatter fields, register any images in `lib/post-images.ts`. Frontmatter zod validation runs only at render/build, so the feedback loop for a typo is "push → Vercel build fails". No hook or script parses `.mdx` files (the lefthook Biome glob covers code files only — the repo's primary artifact passes through zero gates).

### Fix
1. `app/_tools/new-post.mjs`: prompt for title (arg or stdin), slugify, create today's dated directory + frontmatter skeleton. Script: `"new:post": "node app/_tools/new-post.mjs"`.
2. `app/_tools/validate-posts.mjs`: glob `content/posts/**/*.{md,mdx}`, run gray-matter + import the existing zod schema (`lib/server/posts/schema.ts` — build the script as TS run via `tsx`, or export a tiny JS-consumable validator), print per-file pass/fail. Script: `"posts:validate": …`. Also check for markdown images with missing alt (pairs with R-15).
3. Wire `posts:validate` into lefthook pre-commit for `content/**` globs, and into CI (R-02) before `build`.

### Acceptance criteria
- `pnpm new:post "Test post"` creates a valid draft that `pnpm posts:validate` accepts; breaking a frontmatter field makes `posts:validate` fail naming the file; commit of a broken content file is blocked by the hook. Delete the test post.

---

## R-39 — Vitest include pattern silently drops future tests

- **Severity:** Medium · **Effort:** Small

### Problem
`vitest.config.ts:7` — `include: ["lib/**/*.test.ts"]`. A test in `app/`, `components/`, `hooks/`, or any `*.test.tsx` file is silently ignored — Vitest reports green while running nothing new. There's no coverage tooling, yet `.gitignore:14` ignores `/coverage`.

### Fix
1. `include: ["**/*.test.{ts,tsx}"]`, `exclude: ["node_modules", ".next"]`.
2. Either add `@vitest/coverage-v8` + `"test:coverage": "vitest run --coverage"`, or delete the `/coverage` line from `.gitignore`. (Pick one; coverage is optional for a blog.)

### Acceptance criteria
- A temp `components/foo.test.tsx` with one passing test is picked up by `pnpm test`. Delete it after verifying.

---

## R-40 — tsconfig: missing `noUncheckedIndexedAccess`; dead `allowJs`

- **Severity:** Medium · **Effort:** Small

### Problem
`tsconfig.json` has `strict: true` but not `noUncheckedIndexedAccess` — the single highest-value missing flag for a content-indexing codebase (`posts[i]`, `slug.split("/")`, frontmatter records). `allowJs: true` is dead config: `include` lists only ts/tsx/mts patterns, so the four `.mjs` tools in `app/_tools/` are never checked anyway.

### Fix
1. Add `"noUncheckedIndexedAccess": true`; fix the resulting errors properly (narrowing/`?? fallback`), not with `!` assertions.
2. Remove `allowJs`, **or** keep it, add `checkJs: true` and `"app/_tools/**/*.mjs"` to `include` so the font/icon tooling gets checked. Prefer the latter — those scripts guard the build.

### Acceptance criteria
- `pnpm typecheck` green with the new flags; zero new `!` non-null assertions introduced (`git diff` review).

---

## R-41 — No Node version pin anywhere

- **Severity:** Medium · **Effort:** Small

### Problem
No `engines` in `package.json`, no `.nvmrc`/`.node-version`/`.tool-versions`. pnpm is pinned to the patch level but Node — which determines what `next build`, `sharp`, and the `.mjs` tools do — floats across local/CI/Vercel.

### Fix
Add `.nvmrc` with the chosen LTS (e.g. `24`), `"engines": { "node": ">=24 <25" }` in `package.json`, reference the `.nvmrc` in CI (R-02), and set the same major in the Vercel project settings (note this as a manual step in the commit message).

### Acceptance criteria
- `.nvmrc` and `engines` agree; CI uses `node-version-file: .nvmrc`.

---

## R-42 — No automated dependency updates

- **Severity:** Medium · **Effort:** Small

### Problem
No Renovate/Dependabot. A solo blog will simply never get updates without automation. Also, the pinning strategy is mixed (exact `next`/`react`, caret everything else — including load-bearing `zod`, `shiki`, `next-mdx-remote`) and undocumented.

### Fix
Add `.github/dependabot.yml` (weekly, grouped minor+patch for npm; separate group for `next`/`react` majors) — or `renovate.json` if preferred. Add one line to README stating the pinning policy (framework exact, libraries caret).

### Acceptance criteria
- Config file valid (GitHub UI shows Dependabot active after push); README states the policy.

---

## R-43 — Biome `noDangerouslySetInnerHtml` disabled globally

- **Severity:** Low · **Effort:** Small

### Problem
`biome.json:51-53` turns `security/noDangerouslySetInnerHtml` off repo-wide, so the next injection sink sails through review. The config already demonstrates the right pattern — per-path `overrides` exist for `app/_tools/**` and `lib/mdx/**` (`biome.json:83-103`).

### Fix
Re-enable the rule at top level; add an `overrides` entry disabling it only for the files that legitimately use it (the JSON-LD call sites — after R-10 these all go through the `jsonLdString` helper, so scope the override to those page/layout files).

### Acceptance criteria
- `pnpm lint` green; adding `dangerouslySetInnerHTML` to a random component fails `pnpm lint`.

---

## R-44 — Hygiene batch

- **Severity:** Low · **Effort:** Small (one commit)

1. **Delete `.stylelintignore`** — Stylelint was removed in `33841ea`; the file references a tool that no longer exists.
2. **`.env.example`**: replace the live-looking Umami ID (`0aa17cc2-…`) with an empty placeholder (it's public by design, but example files should be placeholders — copying it verbatim pollutes your analytics); add a commented `# BLOB_READ_WRITE_TOKEN=` line with one sentence pointing at the fonts mechanism.
3. **Add `security.txt`**: `public/.well-known/security.txt` (or a route) with `Contact: mailto:…` and `Expires:` (RFC 9116 requires both).

### Acceptance criteria
- `git ls-files | grep stylelint` → empty; `.env.example` contains no UUID; `curl localhost:3000/.well-known/security.txt` → 200 with both fields.

---

# Strategic notes (context, no action required)

- **The stack itself is sound.** Next.js App Router + file-based MDX + Tailwind v4 + Biome + Vitest is a defensible, modern choice for this site; nothing here recommends a framework migration. The honest observation: a fully-static blog would also be well served by Astro with zero client JS by default — but the interactive MDX components (playground, visuals) are first-class citizens here, and the migration cost is not justified by the findings above.
- **`unstable_cache` → `"use cache"`:** R-01 applies the minimal fix. When Next's Cache Components stabilize in this repo's upgrade path, migrating `lib/server/posts/service.ts` to `"use cache"` + `cacheLife`/`cacheTag` would delete the hand-rolled cached/uncached branching entirely.
- **Pagination:** the index renders all posts (fine at the current count). Revisit with paginated or "load more" listing past a few dozen posts — noted in R-25.10's line-length context but intentionally not scheduled.
- **What's already good** (verified during the audit, don't churn it): skip link + `:focus-visible` + forced-colors support; `time[datetime]` and `aria-current` usage; draft gating; path-traversal-safe slug lookup; clean secret handling in the font tooling; git history clean of fonts and secrets; feeds' sanitize-for-syndication vs render-raw-for-site split is exactly right; `lib/server/posts.ts` facade with `server-only` is correct and has 6 consumers — keep it.
