import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/training",
        has: [{ type: "host", value: "training.rinseitoff.com" }],
      },
    ];
  },
};

export default nextConfig;
