import type { Metadata } from "next";
import { isQuoteAuthed } from "@/app/quote/auth";
import LockScreen from "@/app/quote/LockScreen";
import JobTool from "./JobTool";

/** Crew tool: build a job report (photos, video, AI lines, lead's note) and send the client the link.
 *  Same passcode as /quote. noindex and kept out of the sitemap and nav. */
export const metadata: Metadata = { title: "Job reports", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const maxDuration = 120; // the AI write-up runs as a server action from this page

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isQuoteAuthed()) return <JobTool />;
  const { error } = await searchParams;
  return <LockScreen error={error} title="Job reports" blurb="Photos and notes from the job, sent to the client. Enter the team passcode." next="/jobs" />;
}
