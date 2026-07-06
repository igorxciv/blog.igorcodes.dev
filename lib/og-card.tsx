import { type ReactNode } from "react";

// Shared 1200x630 OG card shell used by both the static /opengraph-image and the
// dynamic /api/og route, so the brand design lives in exactly one place.
export const OG_SIZE = { width: 1200, height: 630 };

type OgCardProps = {
  eyebrowLeft: string;
  eyebrowRight: string;
  title: string;
  description: string;
  footer: ReactNode;
  glowOpacity?: number;
};

export function OgCard({
  eyebrowLeft,
  eyebrowRight,
  title,
  description,
  footer,
  glowOpacity = 0.2,
}: OgCardProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        background: `radial-gradient(circle at top right, rgba(0, 217, 255, ${glowOpacity}), transparent 35%), linear-gradient(180deg, #111827 0%, #09090b 100%)`,
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
        <span>{eyebrowLeft}</span>
        <span>{eyebrowRight}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          {title}
        </div>
        <div
          style={{
            maxWidth: 980,
            fontSize: 31,
            lineHeight: 1.35,
            color: "#c5d0db",
          }}
        >
          {description}
        </div>
      </div>
      {footer}
    </div>
  );
}
