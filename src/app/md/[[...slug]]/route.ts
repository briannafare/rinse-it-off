import { MD_PAGES, getMdPage } from "@/lib/ai-content";

// Clean markdown copy of each key page. Public URLs are the page URL plus
// ".md" (for example /services/roof-soft-wash.md); next.config.ts rewrites
// them here. Nothing else is served from /md.
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return MD_PAGES.map((p) => ({ slug: p.path === "/" ? [] : p.path.split("/").filter(Boolean) }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const path = slug.length ? `/${slug.join("/")}` : "/";
  const page = MD_PAGES.find((p) => p.path === path);
  if (!page) return new Response("Not found", { status: 404 });
  return new Response(`${page.body()}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
