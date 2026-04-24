export type PostImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type PostImageVariantSet = {
  mobile: {
    "1x": PostImageAsset;
    "2x": PostImageAsset;
  };
  tablet: {
    "1x": PostImageAsset;
    "2x": PostImageAsset;
  };
  desktop: {
    "1x": PostImageAsset;
    "2x": PostImageAsset;
  };
};

type RasterImageExtension = "avif" | "jpg" | "jpeg" | "png" | "webp";

type BuildPostImagePathOptions = {
  date: `${number}/${number}/${number}`;
  slug: string;
  name: string;
  breakpoint: "mobile" | "tablet" | "desktop";
  density: "1x" | "2x";
  width: number;
  height: number;
  extension: RasterImageExtension;
};

type PostImageRegistry = Record<string, Record<string, PostImageVariantSet>>;

export function buildPostImagePath({
  date,
  slug,
  name,
  breakpoint,
  density,
  width,
  height,
  extension,
}: BuildPostImagePathOptions): string {
  return `/images/posts/${date}/${slug}/${slug}-${name}-${breakpoint}-${density}-${width}x${height}.${extension}`;
}

function createVariantAsset(
  date: `${number}/${number}/${number}`,
  slug: string,
  name: string,
  breakpoint: "mobile" | "tablet" | "desktop",
  density: "1x" | "2x",
  width: number,
  height: number,
  extension: RasterImageExtension,
): PostImageAsset {
  return {
    src: buildPostImagePath({
      date,
      slug,
      name,
      breakpoint,
      density,
      width,
      height,
      extension,
    }),
    width,
    height,
  };
}

function createArticleImageSet(
  date: `${number}/${number}/${number}`,
  slug: string,
  name: string,
  extension: RasterImageExtension,
): PostImageVariantSet {
  return {
    mobile: {
      "1x": createVariantAsset(date, slug, name, "mobile", "1x", 640, 360, extension),
      "2x": createVariantAsset(date, slug, name, "mobile", "2x", 1280, 720, extension),
    },
    tablet: {
      "1x": createVariantAsset(date, slug, name, "tablet", "1x", 768, 432, extension),
      "2x": createVariantAsset(date, slug, name, "tablet", "2x", 1536, 864, extension),
    },
    desktop: {
      "1x": createVariantAsset(date, slug, name, "desktop", "1x", 896, 504, extension),
      "2x": createVariantAsset(date, slug, name, "desktop", "2x", 1792, 1008, extension),
    },
  };
}

// Naming convention:
// /images/posts/YYYY/MM/DD/post-slug/post-slug-scene-name-breakpoint-density-WIDTHxHEIGHT.ext
// Example:
// /images/posts/2026/04/14/ai-doesnt-make-you-learn-faster/ai-doesnt-make-you-learn-faster-learning-loop-desktop-2x-1792x1008.png
const postImageRegistry: PostImageRegistry = {
  "2026/04/14/ai-doesnt-make-you-learn-faster": {
    "learning-loop": createArticleImageSet(
      "2026/04/14",
      "ai-doesnt-make-you-learn-faster",
      "learning-loop",
      "png",
    ),
    "knowledge-gaps": createArticleImageSet(
      "2026/04/14",
      "ai-doesnt-make-you-learn-faster",
      "knowledge-gaps",
      "png",
    ),
  },
};

export function getPostImage(slug: string, name: string): PostImageVariantSet | null {
  return postImageRegistry[slug]?.[name] ?? null;
}
