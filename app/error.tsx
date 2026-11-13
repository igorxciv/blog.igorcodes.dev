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
    <div className="page">
      <header className="page-intro">
        <h1>This page failed to load.</h1>
        <p>
          Something broke while building it. Trying again usually works; if it
          does not, the list of essays still will.
        </p>
        <p className="page-actions">
          <button type="button" className="text-button" onClick={reset}>
            Try again
          </button>
          <Link href="/blog">All writing</Link>
        </p>
        {error.digest ? (
          <p className="page-reference">
            Reference: <code>{error.digest}</code>
          </p>
        ) : null}
      </header>
    </div>
  );
}
