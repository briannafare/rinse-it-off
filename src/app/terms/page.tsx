import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Terms & the Clean Water Promise",
  description:
    "How Rinse It Off works, in plain English: the free 21-point property audit, a firm itemized quote the same day we walk your property, and the Clean Water Promise to re-rinse anything free within 48 hours.",
  alternates: { canonical: "https://rinseitoff.com/terms" },
};

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Dark band = punctuation; the body below is light clean-water. */}
        <section className="relative overflow-hidden bg-[#0C1215] pt-28 pb-14 md:pt-32 md:pb-20">
          <div className="container-site">
            <p className="flex items-center gap-2 text-sm font-medium text-white/85">
              <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
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

        <section className="bg-white py-16 md:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-3xl space-y-12 md:space-y-14">
              {/* Clean Water Promise */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Droplets className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  The Clean Water Promise
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  If there&apos;s a spot you&apos;re not happy with, tell us and we&apos;ll
                  re-rinse it free within 48 hours of your service. No debate, no fine
                  print — we&apos;d rather come back and make it right than leave you
                  looking at a streak.
                </p>
              </article>

              {/* Free 21-point audit */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Your free 21-point property audit
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Every job starts with a free 21-point property audit. We walk your
                  property, read each surface, and note the material, its condition, and
                  the right method for it. There&apos;s no charge and no obligation — it&apos;s
                  an honest look, not a sales pitch.
                </p>
              </article>

              {/* Your quote */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <FileText className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Your quote
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  After we walk your property, we hand you a firm, itemized quote{" "}
                  <span className="font-semibold text-[#0C1215]">
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
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <CalendarClock className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Scheduling &amp; the Portland weather
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Portland sees around 164 rainy days a year, and that&apos;s okay — most of
                  our methods work just fine in the rain, and a fresh rinse isn&apos;t undone
                  by a little weather. If conditions ever genuinely affect the work,
                  we&apos;ll talk it through and reschedule at no penalty.
                </p>
              </article>

              {/* Deposits — mechanism, not a selling point */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Wallet className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Deposits
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Some jobs may require a deposit to reserve your place on the schedule.
                  When one applies, it&apos;s shown on your written quote before you approve
                  anything and is credited toward your final total. It&apos;s simply a
                  scheduling mechanism — nothing more.
                </p>
              </article>

              {/* Insurance */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Insured
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  We carry general liability and workers&apos; compensation insurance, and
                  we&apos;re glad to share proof before we start. You&apos;re protected on
                  residential and commercial work alike.
                </p>
              </article>

              {/* Payment & cancellation */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Handshake className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Payment &amp; changes
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Payment is due on completion unless your written quote says otherwise.
                  Need to reschedule or cancel? Give us a reasonable heads-up and we&apos;ll
                  sort it out — we&apos;re people, not a penalty machine. We may update these
                  terms from time to time; the version posted here is the one in effect.
                </p>
              </article>

              {/* Text messaging — the section carriers check */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <MessageSquare className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Calls &amp; text messages
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  By giving us your phone number — through the site, over the phone, or in
                  person — you agree that Rinse It Off (a DBA of Fresh Rinse, LLC) may call or
                  text you about your quote, appointment, or service. Message frequency varies.
                  Message and data rates may apply. Reply <strong>STOP</strong> to opt out at
                  any time, or <strong>HELP</strong> for help. Carriers aren&apos;t liable for
                  delayed or undelivered messages. Your number is never shared or sold to third
                  parties for their own marketing — see our{" "}
                  <a href="/privacy" className="font-semibold text-[#3AA8D4] underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </article>

              {/* Questions / contact */}
              <article className="rounded-2xl bg-[#F4F7F8] p-6 ring-1 ring-[#E4ECF1] md:p-8">
                <h2
                  className="text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Questions?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Ask us anything before we start — that&apos;s what the free assessment is
                  for.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href="/assessment"
                    className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Get your free assessment
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                  </a>
                  <a
                    href={PHONE_TEL}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#0C1215] hover:text-[#3AA8D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Phone className="h-4 w-4 text-[#62C4EB]" aria-hidden />
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href="mailto:hello@rinseitoff.com"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#0C1215] hover:text-[#3AA8D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <Mail className="h-4 w-4 text-[#62C4EB]" aria-hidden />
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
