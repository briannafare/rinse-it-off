import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isQuoteAuthed } from "@/app/quote/auth";
import { readReport } from "@/lib/jobs/store";
import { firstName, sliderPair } from "@/lib/jobs/types";
import ReportView from "./ReportView";

/** The client's job report: /done/<12-char id>, sent by text and email when we finish (built in /jobs).
 *  The id is the key, so the page is noindex and unlisted. A draft only opens for the crew (preview). */
export const dynamic = "force-dynamic";

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const r = await readReport((await params).id);
  const cover = r ? (sliderPair(r)?.after ?? r.media.after.find((m) => m.kind === "image")) : undefined;
  return {
    title: r ? `Your job report, ${firstName(r.client.name)}` : "Job report",
    robots: { index: false, follow: false },
    openGraph: cover ? { title: "Your Rinse It Off job report", images: [{ url: cover.url, width: cover.w, height: cover.h }] } : undefined,
  };
}

export default async function DonePage({ params }: P) {
  const r = await readReport((await params).id);
  if (!r) notFound();
  const crew = await isQuoteAuthed();
  if (r.status !== "sent" && !crew) notFound();
  return <ReportView r={r} preview={r.status !== "sent"} />;
}
