"use client";

// Rendered when the root layout itself fails, so it cannot rely on the
// stylesheet or fonts; the dark look is approximated with inline styles.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: "6rem 1.5rem",
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>
          The site failed to load
        </h1>
        <p
          style={{
            margin: "1rem auto 1.5rem",
            maxWidth: "32rem",
            color: "#9d9d9d",
          }}
        >
          Something broke before the page could render. Reloading usually fixes
          it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            font: "inherit",
            padding: "0.5rem 1.125rem",
            border: "1px solid #333333",
            borderRadius: "999px",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
