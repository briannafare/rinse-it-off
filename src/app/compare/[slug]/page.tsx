import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiArticle } from "@/components/blog/AiArticle";
import { aiPageMetadata } from "@/lib/ai-page-meta";
import { aiPagesByKind, getAiPage, visibleHere } from "@/lib/ai-pages";

// Comparison pages. Copy comes from src/content/ai-search (see src/lib/ai-pages.ts).
export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return aiPagesByKind("compare").map((p) => ({ slug: p.path.replace("/compare/", "") }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = getAiPage(`/compare/${slug}`);
  return page && visibleHere(page) ? aiPageMetadata(page) : {};
}

export default async function ComparePage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = getAiPage(`/compare/${slug}`);
  if (!page || !visibleHere(page)) notFound();
  return <AiArticle page={page} />;
}
