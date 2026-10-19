import type { MetadataRoute } from "next";

const BASE_URL = "https://rinseitoff.com";

// Internal-only routes that should stay out of search results.
const DISALLOW = ["/flyer", "/training", "/quote", "/studio"];

// AI search crawlers named explicitly. They were already allowed by the "*"
// rule; naming them keeps access obvious to anyone auditing robots.txt and
// survives a future "*" tightening. A named group replaces "*" for that bot,
// so each repeats the internal-route disallows.
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
