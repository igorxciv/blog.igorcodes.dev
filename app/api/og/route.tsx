import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

function renderCard({
  eyebrow,
  title,
  description,
  footerLeft,
  footerRight,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footerLeft: string;
  footerRight: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top right, rgba(0, 217, 255, 0.18), transparent 35%), linear-gradient(180deg, #111827 0%, #09090b 100%)",
          padding: "56px",
          color: "#f5f7fa",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#8a98a8" }}>
          <span>{eyebrow}</span>
          <span>{siteConfig.domain}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.04 }}>{title}</div>
          <div style={{ maxWidth: 980, fontSize: 30, lineHeight: 1.35, color: "#c5d0db" }}>{description}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#00d9ff" }}>
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return renderCard({
      eyebrow: "Blog",
      title: siteConfig.name,
      description: siteConfig.description,
      footerLeft: "Software architecture",
      footerRight: "Frontend engineering",
    });
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return renderCard({
      eyebrow: "Blog",
      title: siteConfig.name,
      description: siteConfig.description,
      footerLeft: "Article not found",
      footerRight: siteConfig.domain,
    });
  }

  return renderCard({
    eyebrow: post.topics[0] ?? "Engineering note",
    title: post.title,
    description: post.description ?? `Read the full article on ${siteConfig.domain}.`,
    footerLeft: post.readingTime ? `${post.readingTime} min read` : "Article",
    footerRight: post.updated ?? post.date,
  });
}
