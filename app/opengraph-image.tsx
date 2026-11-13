import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, type OgCardProps, ogCardText } from "@/lib/og-card";
import { loadOgFonts } from "@/lib/og-fonts";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";
import { formatIsoDate } from "@/lib/writing";

export const size = OG_SIZE;

export const contentType = "image/png";

export const alt = `${siteConfig.name} social preview`;

export default async function OpenGraphImage() {
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);
  const latest = posts[0];
  const props: OgCardProps = {
    meta: [
      latest ? `updated ${formatIsoDate(latest.date)}` : "writing",
      `${posts.length} ${posts.length === 1 ? "essay" : "essays"}`,
    ],
    title: siteConfig.tagline,
    description: siteConfig.intro,
    foot: topics.slice(0, 3),
  };
  const text = ogCardText(props);
  return new ImageResponse(<OgCard {...props} />, {
    ...size,
    fonts: await loadOgFonts(text.sans, text.mono),
  });
}
