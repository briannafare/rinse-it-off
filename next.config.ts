import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Printed postcard QR codes point at /go/<season>. Served as a 307
  // (permanent: false) so the destination can change without reprinting.
  async redirects() {
    return [
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
