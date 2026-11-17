import { Lock } from "lucide-react";
import { unlockQuoteTool } from "./actions";

/** The passcode screen shared by the internal tools (/quote, /jobs). One passcode, one cookie. */
export default function LockScreen({ error, title, blurb, next }: { error?: string; title: string; blurb: string; next: "/quote" | "/jobs" }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-retro-pool px-5 font-body text-[#26211B]">
      <div className="w-full max-w-sm">
        <form
          action={unlockQuoteTool}
          className="rounded-[4px] border border-retro-line bg-white p-6 sm:p-8"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#E3ECE6]">
            <Lock className="h-5 w-5 text-[#2F6B66]" aria-hidden />
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4A4238]">
            {blurb}
          </p>
          <input type="hidden" name="next" value={next} />
          <input
            type="password"
            name="passcode"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Passcode"
            className="mt-5 min-h-11 w-full rounded-xl border border-retro-line bg-white px-4 py-3 text-sm text-[#26211B] placeholder:text-[#8A8072] focus:border-[#2F6B66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[14px] btn-print bg-[#2F6B66] px-6 py-3 text-sm font-semibold text-[#F5EDDC] transition-colors hover:bg-[#3A7C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
          >
            Unlock
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#8A8072]">
          Rinse It Off — internal use only. Not linked from the public site.
        </p>
      </div>
    </div>
  );
}
