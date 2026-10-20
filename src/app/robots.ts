import type { MetadataRoute } from "next";

const BASE_URL = "https://rinseitoff.com";

// Internal-only routes that should stay out of search results.
const DISALLOW = ["/flyer", "/training", "/quote", "/studio"];

// Search and AI crawlers named explicitly. They were already allowed by the
// "*" rule; naming them keeps access obvious to anyone auditing robots.txt and
// survives a future "*" tightening. A named group replaces "*" for that bot,
// so each repeats the internal-route disallows.
//  - Googlebot, Bingbot: classic search (Bing also feeds ChatGPT and Copilot).
//  - OAI-SearchBot, ChatGPT-User: ChatGPT search and the pages it opens for a user.
//  - GPTBot: OpenAI training.  ClaudeBot / Claude-SearchBot / Claude-User: Anthropic.
//  - PerplexityBot, Perplexity-User: Perplexity.
//  - Google-Extended: Gemini and AI Overviews grounding. Applebot / Applebot-Extended: Siri and Apple Intelligence.
//  - DuckAssistBot: DuckDuckGo's AI answers.  Amazonbot: Alexa answers.
const CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
