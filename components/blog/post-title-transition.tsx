import { type ReactNode, ViewTransition } from "react";
import { postTitleTransitionName } from "@/lib/view-transitions";

type PostTitleTransitionProps = {
  slug: string;
  children: ReactNode;
};

/**
 * Pairs a post's title across pages: the row title in the writing log and the
 * essay heading share a name, so navigating between them morphs one into the
 * other. Unpaired titles stay part of their page and move with it.
 */
export function PostTitleTransition({
  slug,
  children,
}: PostTitleTransitionProps) {
  return (
    <ViewTransition
      name={postTitleTransitionName(slug)}
      share="post-title"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
