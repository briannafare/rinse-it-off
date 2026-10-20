import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import {
  Droplets,
  ClipboardCheck,
  FileText,
  CalendarClock,
  ShieldCheck,
  Wallet,
  Handshake,
  Phone,
  Mail,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = pageMeta({
  title: "Terms & the Clean Water Promise",
  description:
    "How Rinse It Off works, in plain English: the free property audit, a firm itemized quote, and the 48-hour re-rinse guarantee.",
  path: "/terms",
});

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Dark band = punctuation; the body below is light clean-water. */}
        <section className="relative overflow-hidden bg-[#26211B] pt-28 pb-14 md:pt-32 md:pb-20">
          <div className="container-site">
            <p className="flex items-center gap-2 text-sm font-medium text-white/85">
              <span className="inline-block h-2 w-2 rounded-[3px] bg-[#2F6B66]" aria-hidden />
              The plain-English version
            </p>
            <h1
              className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Terms &amp; the Clean Water Promise
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
              How we work, what we promise, and what to expect — no fine-print games.
              Here&apos;s the honest version of doing business with Rinse It Off.
            </p>
          </div>
        </section>

        <section className="bg-retro-paper py-16 md:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-3xl space-y-12 md:space-y-14">
              {/* Clean Water Promise */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Droplets className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  The Clean Water Promise
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  If there&apos;s a spot you&apos;re not happy with, tell us and we&apos;ll
                  re-rinse it free within 48 hours of your service. No debate, no fine
                  print — we&apos;d rather come back and make it right than leave you
                  looking at a streak.
                </p>
              </article>

              {/* Free 21-point audit */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Your free 21-point property audit
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  Every job starts with a free 21-point property audit. We walk your
                  property, read each surface, and note the material, its condition, and
                  the right method for it. There&apos;s no charge and no obligation — it&apos;s
                  an honest look, not a sales pitch.
                </p>
              </article>

              {/* Your quote */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <FileText className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Your quote
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  After we walk your property, we hand you a firm, itemized quote{" "}
                  <span className="font-semibold text-[#26211B]">
                    the same day we walk your property
                  </span>
                  . Every line is spelled out, so you know exactly what you&apos;re approving
                  before any work begins. We don&apos;t give instant numbers or quote from
                  photos — a real surface deserves a real look.
                </p>
              </article>

              {/* Scheduling & weather */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <CalendarClock className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Scheduling &amp; the Portland weather
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  Portland gets measurable rain on about 157 days a year, and that&apos;s okay — most of
                  our methods work just fine in the rain, and a fresh rinse isn&apos;t undone
                  by a little weather. If conditions ever genuinely affect the work,
                  we&apos;ll talk it through and reschedule at no penalty.
                </p>
              </article>

              {/* Deposits — mechanism, not a selling point */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Wallet className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Deposits
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  Some jobs may require a deposit to reserve your place on the schedule.
                  When one applies, it&apos;s shown on your written quote before you approve
                  anything and is credited toward your final total. It&apos;s simply a
                  scheduling mechanism — nothing more.
                </p>
              </article>

              {/* Insurance */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Insured
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  We carry general liability and workers&apos; compensation insurance, and
                  we&apos;re glad to share proof before we start. You&apos;re protected on
                  residential and commercial work alike.
                </p>
              </article>

              {/* Payment & cancellation */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Handshake className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Payment &amp; changes
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  Payment is due on completion unless your written quote says otherwise.
                  Need to reschedule or cancel? Give us a reasonable heads-up and we&apos;ll
                  sort it out — we&apos;re people, not a penalty machine. We may update these
                  terms from time to time; the version posted here is the one in effect.
                </p>
              </article>

              {/* Text messaging — the section carriers check */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <MessageSquare className="h-5 w-5 shrink-0 text-[#2F6B66]" aria-hidden />
                  Calls &amp; text messages
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  By giving us your phone number — through the site, over the phone, or in
                  person — you agree that Rinse It Off (a DBA of Fresh Rinse, LLC) may call or
                  text you about your quote, appointment, or service. Message frequency varies.
                  Message and data rates may apply. Reply <strong>STOP</strong> to opt out at
                  any time, or <strong>HELP</strong> for help. Carriers aren&apos;t liable for
                  delayed or undelivered messages. Your number is never shared or sold to third
                  parties for their own marketing — see our{" "}
                  <a href="/privacy" className="font-semibold text-[#2F6B66] underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </article>

              {/* Questions / contact */}
              <article className="rounded-[4px] bg-retro-pool p-6 ring-1 ring-retro-line md:p-8">
                <h2
                  className="text-xl font-semibold text-[#26211B] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Questions?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4A4238]">
                  Ask us anything before we start — that&apos;s what the free assessment is
                  for.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href="/assessment"
                    className="group inline-flex min-h-11 items-center gap-2 rounded-[14px] btn-print bg-[#2F6B66] px-6 py-3.5 text-sm font-semibold text-[#F5EDDC] transition-colors hover:bg-[#3A7C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE2CB] motion-reduce:transition-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Get your free assessment
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                  </a>
                  <a
                    href={PHONE_TEL}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#26211B] hover:text-[#2F6B66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE2CB]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Phone className="h-4 w-4 text-[#2F6B66]" aria-hidden />
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href="mailto:hello@rinseitoff.com"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#26211B] hover:text-[#2F6B66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE2CB]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Mail className="h-4 w-4 text-[#2F6B66]" aria-hidden />
                    hello@rinseitoff.com
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
