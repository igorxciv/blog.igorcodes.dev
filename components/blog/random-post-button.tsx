import Link from "next/link";
import { Dices } from "lucide-react";

export function RandomPostButton() {
  return (
    <Link
      href="/blog/random"
      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-(--surface-strong) px-4 py-2 text-sm text-(--foreground) transition-colors hover:bg-(--border-strong) lg:min-h-12 lg:gap-2.5 lg:px-5 lg:text-[0.98rem]"
    >
      <Dices aria-hidden="true" className="size-4 lg:size-[1.05rem]" />
      Random article
    </Link>
  );
}
