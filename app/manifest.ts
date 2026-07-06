import { type MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { DARK_THEME_COLOR } from "@/lib/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/blog",
    display: "standalone",
    background_color: DARK_THEME_COLOR,
    theme_color: DARK_THEME_COLOR,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
