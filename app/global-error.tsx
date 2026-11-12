"use client";

// Rendered when the root layout itself fails, so it cannot rely on the
// stylesheet or fonts; the day-book look is approximated with inline styles.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: "4rem 1.5rem",
          background: "#e6ecdc",
          color: "#1a2230",
          borderTop: "3rem solid #203a2f",
          fontFamily: "Georgia, 'Times New Roman', serif",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>
          The site failed to load
        </h1>
        <p style={{ margin: "1rem auto 1.5rem", maxWidth: "32rem" }}>
          Something broke before the page could render. Reloading usually fixes
          it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            font: "inherit",
            padding: "0.5rem 1rem",
            border: "1px solid #b3311f",
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
