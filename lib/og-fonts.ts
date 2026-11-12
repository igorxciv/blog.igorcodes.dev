// Font data for next/og share cards. Satori needs static TTF/OTF/WOFF data (it
// cannot read the woff2 files next/font self-hosts), so the faces are fetched
// from the Google Fonts CSS API, subset to the card's own text. On any failure
// the card falls back to the next/og default face rather than failing.

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700;
  style: "normal";
};

async function loadGoogleFont(
  family: string,
  axes: string,
  text: string,
): Promise<ArrayBuffer | null> {
  const query = new URLSearchParams({ family: `${family}:${axes}`, text });
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?${query.toString()}`)
    ).text();
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(
      css,
    )?.[1];
    if (!url) {
      return null;
    }
    const response = await fetch(url);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Source Serif 4 for the label, title and abstract; Archivo (semi-condensed) for the ledger apparatus. */
export async function loadOgFonts(
  serifText: string,
  ledgerText: string,
): Promise<OgFont[]> {
  const requests: [string, string, string, OgFont["weight"]][] = [
    ["Source Serif 4", "wght@400", serifText, 400],
    ["Source Serif 4", "wght@600", serifText, 600],
    ["Archivo", "wdth,wght@80,400", ledgerText, 400],
    ["Archivo", "wdth,wght@80,700", ledgerText, 700],
  ];
  const loaded = await Promise.all(
    requests.map(([family, axes, text]) => loadGoogleFont(family, axes, text)),
  );
  const fonts: OgFont[] = [];
  loaded.forEach((data, index) => {
    const request = requests[index];
    if (data && request) {
      fonts.push({
        name: request[0],
        data,
        weight: request[3],
        style: "normal",
      });
    }
  });
  return fonts;
}
