import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withMDX(nextConfig);
