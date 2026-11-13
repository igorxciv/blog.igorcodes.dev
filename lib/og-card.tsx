// Shared 1200x630 share card used by the static /opengraph-image and the
// dynamic /api/og route. The site in miniature: the wordmark, the title large,
// its claim in gray, and one mono line along the foot (date in cyan, minutes,
// topics) with the domain, on the near-black ground.
export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#0a0a0a";
const TEXT = "#fafafa";
const MUTED = "#9d9d9d";
const FAINT = "#7d7d7d";
const LINE = "#262626";
const ACCENT = "#00d9ff";
const SANS = '"Figtree", "Avenir Next", sans-serif';
const MONO = '"JetBrains Mono", monospace';

export type OgCardProps = {
  /** Date line items, the first drawn in cyan: e.g. ["2026-05-12", "9 min read"]. */
  meta: string[];
  title: string;
  description: string;
  /** Lowercase labels along the foot, e.g. the post's topics. */
  foot: string[];
};

const DESCRIPTION_LIMIT = 132;

/** Cuts at a word boundary and attaches the ellipsis to the last word. */
export function truncateDescription(text: string, limit = DESCRIPTION_LIMIT) {
  if (text.length <= limit) {
    return text;
  }
  const cut = text.slice(0, limit + 1);
  const lastSpace = cut.lastIndexOf(" ");
  const head = (
    lastSpace > 0 ? cut.slice(0, lastSpace) : text.slice(0, limit)
  ).replace(/[\s,;:.\-–—]+$/u, "");
  return `${head}…`;
}

/** All text drawn in each face, used to subset the fonts. */
export function ogCardText({ meta, title, description, foot }: OgCardProps) {
  return {
    sans: `Igor writes…${title}${description}`,
    mono: [...meta, ...foot, "blog.igorcodes.dev·"].join(""),
  };
}

export function OgCard({ meta, title, description, foot }: OgCardProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        padding: "64px 80px 56px",
        background: BG,
        color: TEXT,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div style={{ display: "flex", gap: 10, fontSize: 30 }}>
          <span style={{ fontWeight: 700 }}>Igor</span>
          <span style={{ color: MUTED }}>writes</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 22, color: FAINT }}>
          blog.igorcodes.dev
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 84,
        }}
      >
        <div
          style={{
            fontSize: title.length > 52 ? 58 : 68,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "block",
            marginTop: 22,
            maxWidth: 940,
            fontSize: 28,
            lineHeight: 1.45,
            color: MUTED,
          }}
        >
          {truncateDescription(description)}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "auto",
          paddingTop: 26,
          borderTop: `1px solid ${LINE}`,
          fontFamily: MONO,
          fontSize: 22,
          color: MUTED,
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          {meta.map((item, index) => (
            <span
              key={item}
              style={{
                display: "flex",
                gap: 18,
                color: index === 0 ? ACCENT : MUTED,
              }}
            >
              {index > 0 ? <span style={{ color: FAINT }}>·</span> : null}
              {item}
            </span>
          ))}
          {foot.length > 0 ? (
            <span style={{ display: "flex", gap: 18 }}>
              <span style={{ color: FAINT }}>·</span>
              {foot.join("  ")}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
