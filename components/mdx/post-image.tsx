import Image from "next/image";
import { getPostImage } from "@/lib/post-images";

type PostImageProps = {
  slug: string;
  name: string;
  alt: string;
  caption?: string;
  priority?: boolean;
};

type BoundPostImageProps = Omit<PostImageProps, "slug">;

export function PostImage({
  slug,
  name,
  alt,
  caption,
  priority = false,
}: PostImageProps) {
  const asset = getPostImage(slug, name);

  if (!asset) {
    // Degrade gracefully instead of crashing the whole route on a missing
    // asset; surface the problem loudly in dev so it is caught before ship.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Missing post image asset for "${slug}" / "${name}".`);
    }
    return null;
  }

  return (
    <figure className="prose-image">
      <Image
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={alt}
        sizes="(min-width: 48rem) 40rem, 100vw"
        priority={priority}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function createPostImageComponent(slug: string) {
  return function BoundPostImage(props: BoundPostImageProps) {
    return <PostImage slug={slug} {...props} />;
  };
}
