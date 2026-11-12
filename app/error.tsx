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
    <div className="sheet ledger-sheet ledger-sheet-single">
      <section className="ledger-main" aria-labelledby="error-heading">
        <h1 id="error-heading" className="ledger-heading">
          This page failed to render
        </h1>
        <p className="ledger-intro">
          Something broke while building this page. Trying again usually works;
          if it does not, the list of entries still will.
        </p>
        <p className="ledger-intro ledger-actions">
          <button type="button" className="text-button" onClick={reset}>
            Try again
          </button>
          <Link href="/blog">All entries</Link>
        </p>
        {error.digest ? (
          <p className="ledger-intro ledger-reference">
            Reference: <code>{error.digest}</code>
          </p>
        ) : null}
      </section>
    </div>
  );
}
