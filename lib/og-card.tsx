// Shared 1200x630 share card used by the static /opengraph-image and the
// dynamic /api/og route: a day-book page. The cloth band with the gilt label
// across the top, then one ruled ledger row: the date in the margin closed by
// the red double rule, the title and abstract as the particulars, and the
// accounts, folio, and minutes along the foot.
export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#e6ecdc";
const INK = "#1a2230";
const INK_SOFT = "#3b4552";
const PENCIL = "#535f58";
const RULE = "#8fae95";
const HEAD = "#203a2f";
const RED = "#b3311f";
const CLOTH = "#203a2f";
const CLOTH_INK = "#efe6c8";
const GILT = "#c9b98a";
const SERIF = '"Source Serif 4", Georgia, serif';
const LEDGER = '"Archivo", "Arial Narrow", sans-serif';

const DATE_COL = 190;

export type OgCardProps = {
  /** Label line under the book's name, e.g. "Vol. I · 2026". */
  volume: string;
  /** Date margin: day-month and year, or a short label for the index card. */
  dateLines: [string, string];
  title: string;
  description: string;
  /** The foot of the row: accounts, folio, minutes, as label/value pairs. */
  foot: { label: string; value: string }[];
  bookName: string;
};

/** All text drawn in each face, used to subset the fonts. */
export function ogCardText({
  volume,
  dateLines,
  title,
  description,
  foot,
  bookName,
}: OgCardProps) {
  return {
    serif: `${bookName}${title}${description}`,
    ledger: [
      volume.toUpperCase(),
      ...dateLines,
      "DATEPARTICULARS",
      ...foot.map((item) => `${item.label.toUpperCase()}${item.value}`),
    ].join(""),
  };
}

function ColumnHead({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: LEDGER,
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: HEAD,
      }}
    >
      {children}
    </span>
  );
}

/** The red double rule closing the date margin: two red lines with paper between. */
function DoubleRule() {
  return (
    <div
      style={{
        display: "flex",
        width: 7,
        alignSelf: "stretch",
        borderLeft: `2px solid ${RED}`,
        borderRight: `2px solid ${RED}`,
      }}
    />
  );
}

export function OgCard({
  volume,
  dateLines,
  title,
  description,
  foot,
  bookName,
}: OgCardProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        background: PAPER,
        color: INK,
        fontFamily: SERIF,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 150,
          padding: "0 64px",
          background: CLOTH,
          borderBottom: `5px solid ${RED}`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "16px 32px 14px",
            border: `2px solid ${GILT}`,
          }}
        >
          <span
            style={{
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1,
              color: CLOTH_INK,
            }}
          >
            {bookName}
          </span>
          <span
            style={{
              fontFamily: LEDGER,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: GILT,
            }}
          >
            {volume}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          margin: "34px 64px 0",
          borderTop: `3px solid ${HEAD}`,
          borderBottom: `1.5px solid ${HEAD}`,
        }}
      >
        <div
          style={{
            display: "flex",
            width: DATE_COL,
            padding: "10px 18px",
          }}
        >
          <ColumnHead>Date</ColumnHead>
        </div>
        <DoubleRule />
        <div style={{ display: "flex", padding: "10px 28px" }}>
          <ColumnHead>Particulars</ColumnHead>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          margin: "0 64px 44px",
          borderBottom: `1.5px solid ${RULE}`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: DATE_COL,
            padding: "30px 18px",
            fontFamily: LEDGER,
            fontSize: 24,
            lineHeight: 1.3,
          }}
        >
          <span>{dateLines[0]}</span>
          <span style={{ color: PENCIL, fontSize: 20 }}>{dateLines[1]}</span>
        </div>
        <DoubleRule />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "24px 0 22px 28px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 48 ? 54 : 64,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              textWrap: "balance",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "block",
              marginTop: 16,
              fontSize: 26,
              lineHeight: 1.4,
              color: INK_SOFT,
              lineClamp: 2,
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: "flex",
              gap: 36,
              marginTop: "auto",
              fontFamily: LEDGER,
              fontSize: 20,
              color: HEAD,
            }}
          >
            {foot.map((item) => (
              <span key={item.label} style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    color: PENCIL,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontSize: 16,
                    paddingTop: 3,
                  }}
                >
                  {item.label}
                </span>
                <span>{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
