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
