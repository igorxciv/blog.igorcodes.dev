# AGENTS.md

## Project Scope
- This repository is a blog-only Next.js App Router application.
- Keep all implementation focused on blog listing and blog post rendering.
- Do not add unrelated product routes such as about, projects, resume, or job-analyzer.

## Project Structure (Blog-Only App Router)
- `app/`: App Router routes, layouts, loading/error states, metadata files, and route handlers.
- `components/`: Shared UI components for blog pages.
- `content/`: Static blog content.
- `lib/`: Utilities and helpers (`lib/server/` for server-only code).
- `hooks/`: Reusable React hooks.
- `public/`: Static assets served as-is.
- Repository root: config/tooling files plus `mdx-components.tsx`.

## Allowed Source Locations
- Place source code only in: `app/`, `components/`, `content/`, `lib/`, `hooks/`, `public/`.
- Do not create new source files at repository root.

## Default File Placement
- Blog routes: `app/blog/**` using App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, etc.).
- API handlers (if needed): `app/api/**/route.ts`.
- Blog content: `content/posts/**` with `.md` or `.mdx` files.
- Shared UI: `components/**`.
- Non-UI logic: `lib/**` (`lib/server/**` for server-only modules).
- Reusable hooks: `hooks/**`.
- Static assets: `public/**`.
- Static metadata (`robots.txt`, icons, sitemap): use `app/` metadata files instead of `public/` when supported by Next.js.

## MDX Rules
- MDX is rendered at runtime via `next-mdx-remote/rsc` (see `app/blog/[...slug]/page.tsx`); there is no compile-time MDX plugin, so `pageExtensions` in `next.config.ts` stays `ts`/`tsx` only.
- Use `mdx-components.tsx` for MDX component mapping.
- Pass remark/rehype plugins directly to `<MDXRemote>`.
- Avoid `MDXProvider` unless explicitly required by a task.

## Build, Test, Run
- `pnpm dev` (starts local dev server).
- `pnpm build` (fetches fonts, then creates a production build in `.next/`).
- `pnpm start` (runs the production build).
- `pnpm lint` (Biome check).
- `pnpm typecheck` (`tsc --noEmit`).
- `pnpm test` (Vitest).
- `pnpm check` (lint + typecheck + test — the full local gate).

## Coding Style & Naming
- TypeScript + React with Next.js App Router conventions.
- Use 2-space indentation in JS/TS/JSON.
- Components: `PascalCase`.
- Hooks: `useCamelCase`.
- File naming: follow nearby patterns (`kebab-case` or `camelCase`).

## Testing
- Tests use Vitest. Run them with `pnpm test` (watch mode: `pnpm test:watch`).
- Tests currently live in `lib/**/*.test.ts` (the Vitest `include` pattern is scoped to `lib/`; it is slated to widen to all `*.test.{ts,tsx}` files).
- Add unit tests for pure logic alongside the module under test.

## Boundaries and Safety
- Ask first before reorganizing top-level folders or moving existing routes.
- Never commit build outputs or secrets (`.next/`, `.env*`).
