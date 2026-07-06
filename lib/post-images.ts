export type PostImageAsset = {
  src: string;
  width: number;
  height: number;
};

type PostImageRegistry = Record<string, Record<string, PostImageAsset>>;

// Naming convention:
// /images/posts/YYYY/MM/DD/post-slug/post-slug-scene-name-desktop-2x-WIDTHxHEIGHT.png
// A single high-resolution source per image; next/image (Vercel's optimizer)
// negotiates AVIF/WebP and DPR-appropriate sizes at request time.
const postImageRegistry: PostImageRegistry = {
  "2026/04/14/ai-doesnt-make-you-learn-faster": {
    "learning-loop": {
      src: "/images/posts/2026/04/14/ai-doesnt-make-you-learn-faster/ai-doesnt-make-you-learn-faster-learning-loop-desktop-2x-1792x1008.png",
      width: 1792,
      height: 1008,
    },
    "knowledge-gaps": {
      src: "/images/posts/2026/04/14/ai-doesnt-make-you-learn-faster/ai-doesnt-make-you-learn-faster-knowledge-gaps-desktop-2x-1792x1008.png",
      width: 1792,
      height: 1008,
    },
  },
};

export function getPostImage(
  slug: string,
  name: string,
): PostImageAsset | null {
  return postImageRegistry[slug]?.[name] ?? null;
}
