import type { MetadataRoute } from "next";

const BASE_URL = "https://rinseitoff.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal-only routes that should stay out of search results.
      disallow: ["/flyer", "/training"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
