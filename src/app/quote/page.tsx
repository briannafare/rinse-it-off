import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { isQuoteAuthed } from "./auth";
import { unlockQuoteTool } from "./actions";
import QuoteWizard from "./QuoteWizard";

/** Internal AI photo-audit quoting tool ("Audit Tool v2").
 *  Passcode-gated, noindex, and deliberately absent from sitemap.ts and nav. */

export const metadata: Metadata = {
  title: "Audit Tool — Rinse It Off",
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7F8] px-5 font-body text-[#0C1215]">
      <div className="w-full max-w-sm">
        <form
          action={unlockQuoteTool}
          className="rounded-2xl border border-[#EFF4F7] bg-white p-6 shadow-soft-md sm:p-8"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#EDF7FC]">
            <Lock className="h-5 w-5 text-[#62C4EB]" aria-hidden />
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight">Audit Tool</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4B5C6B]">
            Internal quoting tool. Enter the team passcode to continue.
          </p>
          <input
            type="password"
            name="passcode"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Passcode"
            className="mt-5 min-h-11 w-full rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] placeholder:text-[#8899A6] focus:border-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
          {error === "wrong" && (
            <p className="mt-2 text-sm font-medium text-[#DC4B2A]">Wrong passcode — try again.</p>
          )}
          {error === "unconfigured" && (
            <p className="mt-2 text-sm font-medium text-[#DC4B2A]">
              QUOTE_PASSWORD is not set on the server. Add it to the environment first.
            </p>
          )}
          <button
            type="submit"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#62C4EB] px-6 py-3 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
          >
            Unlock
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#8899A6]">
          Rinse It Off — internal use only. Not linked from the public site.
        </p>
      </div>
    </div>
  );
}
