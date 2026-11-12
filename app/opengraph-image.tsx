import { ImageResponse } from "next/og";
import { getVolumeLabel } from "@/lib/daybook";
import { OG_SIZE, OgCard, type OgCardProps, ogCardText } from "@/lib/og-card";
import { loadOgFonts } from "@/lib/og-fonts";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

export const size = OG_SIZE;

export const contentType = "image/png";

export const alt = `${siteConfig.name} social preview`;

export default async function OpenGraphImage() {
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);
  const props: OgCardProps = {
    bookName: siteConfig.name,
    volume: getVolumeLabel(posts) ?? "Vol. I",
    dateLines: ["All", "entries"],
    title: "Notes from one working engineer, entered as they happen.",
    description: "Opinions on AI, technical debt, and architecture.",
    foot: [
      { label: "Entries", value: String(posts.length) },
      { label: "Accounts", value: String(topics.length) },
      { label: "Kept at", value: siteConfig.domain },
    ],
  };
  const text = ogCardText(props);
  return new ImageResponse(<OgCard {...props} />, {
    ...size,
    fonts: await loadOgFonts(text.serif, text.ledger),
  });
}
