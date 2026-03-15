"use client";

import { useRouter } from "next/navigation";
import { Dices } from "lucide-react";

type RandomPostButtonProps = {
  slugs: string[];
};

export function RandomPostButton({ slugs }: RandomPostButtonProps) {
  const router = useRouter();
  const availableSlugs = slugs.filter(Boolean);

  function goToRandomPost() {
    if (availableSlugs.length === 0) {
      return;
    }

    const randomSlug = availableSlugs[Math.floor(Math.random() * availableSlugs.length)];
    router.push(`/blog/${randomSlug}`);
  }

  return (
    <button
      type="button"
      onClick={goToRandomPost}
      className="focus-ring inline-flex items-center gap-2 rounded-md bg-[var(--surface-strong)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--border-strong)]"
    >
      <Dices aria-hidden="true" className="size-4" />
      Random article
    </button>
  );
}
