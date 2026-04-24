import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getPostImage } from "@/lib/post-images";

type PostImageProps = {
  slug: string;
  name: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

type BoundPostImageProps = Omit<PostImageProps, "slug">;

export function PostImage({
  slug,
  name,
  alt,
  caption,
  priority = false,
  className,
  imageClassName,
}: PostImageProps) {
  const asset = getPostImage(slug, name);

  if (!asset) {
    throw new Error(`Missing post image asset for "${slug}" and image "${name}".`);
  }

  const fallbackAsset = asset.mobile["1x"];
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  return (
    <figure className={twMerge(clsx("my-8 lg:my-10", className))}>
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface) lg:rounded-[1.75rem]">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={`${asset.desktop["1x"].src} 1x, ${asset.desktop["2x"].src} 2x`}
          />
          <source
            media="(min-width: 768px)"
            srcSet={`${asset.tablet["1x"].src} 1x, ${asset.tablet["2x"].src} 2x`}
          />
          <img
            src={fallbackAsset.src}
            srcSet={`${asset.mobile["1x"].src} 1x, ${asset.mobile["2x"].src} 2x`}
            alt={alt}
            width={fallbackAsset.width}
            height={fallbackAsset.height}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            className={twMerge(clsx("h-auto w-full", imageClassName))}
          />
        </picture>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-(--foreground-soft) lg:mt-4 lg:text-[0.98rem]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function createPostImageComponent(slug: string) {
  return function BoundPostImage(props: BoundPostImageProps) {
    return <PostImage slug={slug} {...props} />;
  };
}
