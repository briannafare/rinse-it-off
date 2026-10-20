import type { Metadata } from "next";
import { BASE_URL } from "@/components/blog/format";
import { isPublishable, type AiPage } from "@/lib/ai-pages";

/** Metadata for an AI-search piece: canonical at its own URL, and noindex while
 *  any [CONFIRM] or [EDITOR] marker is still in the copy. */
export function aiPageMetadata(page: AiPage): Metadata {
  const url = `${BASE_URL}${page.path}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    robots: isPublishable(page) ? undefined : { index: false, follow: false },
    openGraph: {
      type: "article",
      url,
      title: page.title,
      description: page.description,
      siteName: "Rinse It Off",
      modifiedTime: page.checked,
      authors: ["Rinse It Off"],
    },
    twitter: { card: "summary", title: page.title, description: page.description },
  };
}
