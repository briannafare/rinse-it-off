import { buildLlmsTxt } from "@/lib/ai-content";

// Re-read blog posts from Sanity every five minutes, same as the sitemap.
export const revalidate = 300;

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
