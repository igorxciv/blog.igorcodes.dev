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
- Use `@next/mdx` for MDX support.
- Keep MDX extensions and page extensions configured in `next.config.ts`.
- Use `mdx-components.tsx` for MDX component mapping.
- Avoid `MDXProvider` unless explicitly required by a task.

## Build, Test, Run
- `npm run dev` (starts local dev server).
- `npm run build` (creates production build in `.next/`).
- `npm run start` (runs production build).
- `npm run lint` (runs ESLint + Stylelint).

## Coding Style & Naming
- TypeScript + React with Next.js App Router conventions.
- Use 2-space indentation in JS/TS/JSON.
- Components: `PascalCase`.
- Hooks: `useCamelCase`.
- File naming: follow nearby patterns (`kebab-case` or `camelCase`).

## Testing
- No testing framework is configured yet.
- If tests are added, document the framework and command in this file.

## Boundaries and Safety
- Ask first before reorganizing top-level folders or moving existing routes.
- Never commit build outputs or secrets (`.next/`, `.env*`).
