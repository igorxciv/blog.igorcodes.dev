import { Archivo, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

// All three families are open-licensed (SIL OFL) and self-hosted by next/font
// at build time, so the CSP's `font-src 'self'` still holds.

// Titles and prose. Variable font with the optical-size axis, so headings and
// body text each get the cut drawn for their size.
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

// The ledger's printed apparatus: column heads, dates, accounts, folios, and
// figures. Variable width, so heads can run condensed and dates semi-condensed.
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-ledger",
  display: "swap",
});

// Code only.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
});
