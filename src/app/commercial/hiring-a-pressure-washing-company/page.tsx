import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiArticle } from "@/components/blog/AiArticle";
import { aiPageMetadata } from "@/lib/ai-page-meta";
import { getAiPage, visibleHere } from "@/lib/ai-pages";

// Guide for property managers and HOA boards. Copy comes from src/content/ai-search.
const PATH = "/commercial/hiring-a-pressure-washing-company";

export async function generateMetadata(): Promise<Metadata> {
  const page = getAiPage(PATH);
  return page && visibleHere(page) ? aiPageMetadata(page) : {};
}

export default function HiringGuidePage() {
  const page = getAiPage(PATH);
  if (!page || !visibleHere(page)) notFound();
  return <AiArticle page={page} />;
}
