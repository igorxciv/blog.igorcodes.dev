import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = `${siteConfig.name} social preview`;

export default function OpenGraphImage() {
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
            "radial-gradient(circle at top right, rgba(0, 217, 255, 0.22), transparent 35%), linear-gradient(180deg, #111827 0%, #09090b 100%)",
          padding: "56px",
          color: "#f5f7fa",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#8a98a8",
          }}
        >
          <span>{siteConfig.domain}</span>
          <span>Blog</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>{siteConfig.name}</div>
          <div style={{ maxWidth: 980, fontSize: 32, lineHeight: 1.35, color: "#c5d0db" }}>{siteConfig.description}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#00d9ff", textTransform: "uppercase", letterSpacing: "0.18em" }}>
          Software architecture · Frontend engineering · AI systems
        </div>
      </div>
    ),
    size,
  );
}
