import type { Metadata } from "next";
import { isQuoteAuthed } from "./auth";
import LockScreen from "./LockScreen";
import QuoteWizard from "./QuoteWizard";

/** Internal AI photo-audit quoting tool ("Audit Tool v2").
 *  Passcode-gated, noindex, and deliberately absent from sitemap.ts and nav. */

export const metadata: Metadata = {
  title: "Audit Tool",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function QuoteToolPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authed = await isQuoteAuthed();
  const { error } = await searchParams;

  if (authed) return <QuoteWizard />;

  return <LockScreen error={error} title="Audit Tool" blurb="Internal quoting tool. Enter the team passcode to continue." next="/quote" />;
}
