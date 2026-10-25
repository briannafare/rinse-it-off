import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // blog post photos come from the Sanity CMS (src/sanity/lib/image.ts); without this the optimizer 400s them
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/r7qcxvui/**" }],
  },
  // Printed postcard QR codes point at /go/<season>. Served as a 307
  // (permanent: false) so the destination can change without reprinting.
  async redirects() {
    return [
      // business-card links (rinseitoff.com/bri etc.) -> the assessment form, tagged to that person
      ...[["bri", "bri-lindley"], ["alstun", "alstun-thurman"], ["david", "david-chandler"]].map(([path, rep]) => ({
        source: `/${path}`,
        destination: `/assessment?utm_source=business-card&utm_medium=typed-url&utm_campaign=${rep}`,
        permanent: false,
      })),
      {
        source: "/go/:slug([a-z0-9-]{1,40})",
        destination: "/plan?src=postcard-:slug",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Markdown copy of each key page at <url>.md (see src/lib/ai-content.ts).
        { source: "/index.md", destination: "/md" },
        { source: "/:path+.md", destination: "/md/:path+" },
        {
          source: "/",
          destination: "/training",
          has: [{ type: "host", value: "training.rinseitoff.com" }],
        },
      ],
    };
  },
};

export default nextConfig;
