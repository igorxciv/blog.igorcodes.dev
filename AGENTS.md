# AGENTS.md

## Project Scope
- This repository is a blog-only Next.js App Router application.
- Keep all implementation focused on blog listing and blog post rendering.
- Do not add unrelated product routes such as about, projects, resume, or job-analyzer.

## Allowed Source Locations
- Place source code only in: `app/`, `components/`, `content/`, `lib/`, `hooks/`, `public/`.

## Blog Content Rules
- Blog content must live in `content/posts/**`.
- Supported content files are `.md` and `.mdx`.

## Routing Rules
- Blog routes must be placed under `app/blog/**`.
- Follow Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).

## Root Constraints
- Do not create new source files at repository root.
- Root files may only be config/tooling files and `mdx-components.tsx`.

## MDX Rules
- Use `@next/mdx` for MDX support.
- Use `mdx-components.tsx` for MDX component mapping.
- Avoid `MDXProvider` unless explicitly required by a task.

## Build Artifacts and Secrets
- Never commit `.next/` build artifacts.
- Never commit `.env*` files or secrets.

## Build, Test, Run
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
