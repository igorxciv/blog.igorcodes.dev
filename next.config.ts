import { type NextConfig } from "next";

// Posts are rendered at runtime via next-mdx-remote/rsc (see
// app/blog/[...slug]/page.tsx), so the @next/mdx toolchain is intentionally not
// used and `pageExtensions` stays ts/tsx only. Remark/rehype plugins are passed
// directly to <MDXRemote>.

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js App Router emits ~16 inline bootstrap/streaming scripts per page
      // (self.__next_f.push / self.__next_s.push, incl. the wrapped theme-init) on
      // statically-rendered pages. These have no stable build-time hash, so
      // 'unsafe-inline' is required here. Dropping it needs a nonce-based CSP via
      // middleware + per-request dynamic rendering, which would undo the static
      // rendering of /blog (R-06) — a deliberate non-goal. JSON-LD is data (not
      // executable) and is additionally escaped via jsonLdString().
      "script-src 'self' 'unsafe-inline' https://cloud.umami.is",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      // Umami Cloud serves the tracker from cloud.umami.is but POSTs events to
      // gateway.umami.is (/api/send), so both hosts are needed here.
      "connect-src 'self' https://cloud.umami.is https://gateway.umami.is",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
