// Font data for next/og share cards. Satori needs static TTF/OTF/WOFF data (it
// cannot read the woff2 files next/font self-hosts), so the faces are fetched
// from the Google Fonts CSS API, subset to the card's own text. On any failure
// the card falls back to the next/og default face rather than failing.

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
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

/** Figtree (closest open face to Wotfard) for the words; JetBrains Mono for the date line and labels. */
export async function loadOgFonts(
  sansText: string,
  monoText: string,
): Promise<OgFont[]> {
  const requests: [string, string, string, OgFont["weight"]][] = [
    ["Figtree", "wght@400", sansText, 400],
    ["Figtree", "wght@700", sansText, 700],
    ["JetBrains Mono", "wght@400", monoText, 400],
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
