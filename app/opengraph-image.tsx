import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og-card";
import { siteConfig } from "@/lib/site";

export const size = OG_SIZE;

export const contentType = "image/png";

export const alt = `${siteConfig.name} social preview`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <OgCard
      eyebrowLeft={siteConfig.domain}
      eyebrowRight="Blog"
      title={siteConfig.name}
      description={siteConfig.description}
      glowOpacity={0.22}
      footer={
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#00d9ff",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Software architecture · Frontend engineering · AI systems
        </div>
      }
    />,
    size,
  );
}
