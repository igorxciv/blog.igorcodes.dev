# Purge commercial fonts from git history

> **Status: completed** (verified 2026-07-06 — object scan clean). The commercial
> Wotfard and Dank Mono binaries are gone from the entire history: the purge was
> run and force-pushed, and `main == origin/main`. **Do not re-run the purge
> below** — it is retained only as a historical record of what was done.
>
> Verification: `git rev-list --all --objects | grep -iE '\.(woff2?|otf|ttf)$'`
> lists **no** licensed fonts. The only font objects it now returns are the
> intentional, open-licensed (SIL OFL) build fallbacks committed later under
> `app/_tools/fallback-fonts/` (`sans.woff2`, `mono.woff2`) — see
> `app/_tools/fallback-fonts/OFL.txt`. Those are meant to be in history; leave
> them alone.

The Wotfard (Atipo Foundry) and Dank Mono fonts are **commercial,
non-redistributable** fonts. Because this repository is public, their binaries
are downloadable from the raw git history — which is redistribution and likely
violates both licenses. Deleting the files in a normal commit is **not** enough;
they remain in every earlier commit. In this repo the binaries only ever lived
in one place:

- `app/fonts/` — `app/fonts/wotfard/` and `app/fonts/dank-mono/`

This runbook rewrites history to remove them. It is **destructive** and requires
a **force-push** — coordinate with anyone who has a clone before running it, and
take a backup first.

## How builds get the fonts now (already wired up)

The fonts are no longer tracked in git. Instead:

- `app/fonts/` is in `.gitignore`; keep your own licensed `.woff2` copies there
  for local dev (they are loaded by `app/fonts.ts` via `next/font/local` and are
  never committed).
- The licensed files live in a **private Vercel Blob store**. `app/_tools/`
  holds the machinery, driven by `app/_tools/fonts-manifest.mjs` (the single
  list of the 11 expected files):
  - `pnpm fonts:upload` — one-time (or on font change) push of the local
    `app/fonts/**.woff2` into the Blob store.
  - `pnpm fonts:fetch` — runs first in `pnpm build`; idempotent. If the files
    are already on disk it does nothing; otherwise it downloads them from Blob
    using `BLOB_READ_WRITE_TOKEN`, so `next build` can resolve them.
- On Vercel, connect a Blob store to the project so `BLOB_READ_WRITE_TOKEN` is
  injected into the build automatically.

## 0. Upload the fonts to Blob FIRST (do this before anything destructive)

The `.woff2` files are still on your disk right now. Get them into the private
Blob store before you rewrite history, or you may lose the only copies:

```bash
vercel env pull          # writes BLOB_READ_WRITE_TOKEN into .env.local
pnpm fonts:upload        # uploads the 11 woff2 from app/fonts/
```

Confirm a clean-checkout build can fetch them (optional sanity check): move
`app/fonts/` aside, run `pnpm fonts:fetch`, verify the files reappear, then
restore.

> Alternative to the whole approach: switch to open-licensed fonts you *can*
> commit (Wotfard → a libre grotesque, Dank Mono → JetBrains Mono). That is a
> visual change but removes the licensing constraint entirely.

## 1. Back up

```bash
git clone --mirror . ../blog.igorcodes.dev-backup.git
```

## 2. Rewrite history

Preferred: [git-filter-repo](https://github.com/newren/git-filter-repo)
(`brew install git-filter-repo`). This removes the font directory from every
commit:

```bash
git filter-repo --path app/fonts --invert-paths
```

If `git-filter-repo` is unavailable, git's built-in `filter-branch` does the
same:

```bash
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter \
  'git rm -r --cached --ignore-unmatch app/fonts' \
  --prune-empty --tag-name-filter cat -- --all
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all && git gc --prune=now
```

Verify nothing remains before pushing:

```bash
git rev-list --all --objects | grep -iE 'woff|\.otf|\.ttf'   # expect no output
```

`git filter-repo` strips the `origin` remote as a safety measure; re-add it:

```bash
git remote add origin git@github.com:igorxciv/blog.igorcodes.dev.git
```

## 3. Force-push

```bash
git push --force-with-lease origin main
```

Everyone else must then re-clone (their old clones still contain the binaries).
If the repo was ever cloned/forked by others while the fonts were tracked,
consider the binaries already exposed — rotating is not possible for fonts, so
the practical mitigation is the rewrite plus keeping the repo's future history
clean.

> Alternative to all of the above: make the repository private. Then serving and
> tracking the fonts is fine and no history rewrite is needed.
