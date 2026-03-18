export default function BlogLoadingPage() {
  return (
    <main className="flex min-h-[40vh] items-center justify-center px-6 py-16">
      <div className="flex items-center gap-3 text-sm tracking-[0.18em] text-(--foreground-soft) uppercase">
        <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-(--accent)" />
        <span>Loading</span>
      </div>
    </main>
  );
}
