import { buildLlmsFullTxt } from "@/lib/ai-content";

export const revalidate = 3600;

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
