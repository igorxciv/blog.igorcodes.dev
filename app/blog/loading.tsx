export default function BlogLoadingPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-[var(--border)]" />
        <div className="h-5 w-80 animate-pulse rounded bg-[var(--border)]" />
      </div>
      <div className="mt-10 space-y-3">
        <div className="h-24 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)]" />
        <div className="h-24 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)]" />
        <div className="h-24 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)]" />
      </div>
    </main>
  );
}
