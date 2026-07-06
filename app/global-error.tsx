"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" style={{ colorScheme: "light dark" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "4rem",
          textAlign: "center",
        }}
      >
        <h1>Something went wrong</h1>
        <p>Please reload the page.</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </body>
    </html>
  );
}
