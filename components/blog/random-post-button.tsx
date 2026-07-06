"use client";

import { Dices } from "lucide-react";
import { useRouter } from "next/navigation";

type RandomPostButtonProps = {
  slugs: string[];
};

export function RandomPostButton({ slugs }: RandomPostButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (slugs.length === 0) {
      return;
    }

    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/blog/${slug}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={slugs.length === 0}
      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-(--surface-strong) px-4 py-2 text-sm text-(--foreground) transition-colors hover:bg-(--border-strong) disabled:cursor-not-allowed disabled:opacity-60 lg:min-h-12 lg:gap-2.5 lg:px-5 lg:text-[0.98rem]"
    >
      <Dices aria-hidden="true" className="size-4 lg:size-[1.05rem]" />
      Random article
    </button>
  );
}
