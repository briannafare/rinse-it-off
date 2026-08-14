import type { Metadata } from "next";
import {
  ShieldCheck,
  MessageSquare,
  Database,
  Cookie,
  UserCheck,
  Phone,
  Mail,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Rinse It Off collects, uses, and protects your information — including phone number and text messaging data.",
  alternates: { canonical: "https://rinseitoff.com/privacy" },
};

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Dark band = punctuation; the body below is light clean-water. */}
        <section className="relative overflow-hidden bg-[#0C1215] pt-28 pb-14 md:pt-32 md:pb-20">
          <div className="container-site">
            <p className="flex items-center gap-2 text-sm font-medium text-white/85">
              <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
              Plain-English, still binding
            </p>
            <h1
              className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
              What we collect, why, and who we do (and don&apos;t) share it with.
              Last updated August 2026.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-3xl space-y-12 md:space-y-14">
              {/* Who we are */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Who we are
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Rinse It Off (a DBA of Fresh Rinse, LLC) provides residential and commercial
                  exterior cleaning across the Portland, Oregon metro. This policy covers the
                  information we collect through rinseitoff.com, our free property assessment
                  request, phone calls, and text messages — and applies to every visitor and
                  customer.
                </p>
              </article>

              {/* What we collect */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Database className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  What we collect
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  When you request a free assessment or reach out, we collect your name, phone
                  number, email address, and property address, plus anything you tell us about
                  the job (surfaces, access notes, photos you send). If you book a walkthrough,
                  we also collect the date and time you selected.
                </p>
              </article>

              {/* Texting & calls — the section carriers actually check */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <MessageSquare className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Calls &amp; text messages
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  If you give us your phone number through our website, over the phone, or in
                  person, we may call or text you about your quote, appointment, or service —
                  things like confirming a walkthrough time, sending your written estimate, or
                  checking in after a job. Message frequency varies. Message and data rates may
                  apply. Reply <strong>STOP</strong> at any time to opt out, or{" "}
                  <strong>HELP</strong> for help.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  <strong>
                    Your mobile phone number and messaging opt-in are never shared, sold, or
                    rented to third parties or affiliates for their marketing or promotional
                    purposes.
                  </strong>{" "}
                  We use it only to run our own business with you.
                </p>
              </article>

              {/* How we use it */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <UserCheck className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  How we use your information
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  We use your information to schedule your free assessment, prepare and send
                  your quote, coordinate the job, process payment, and follow up afterward
                  (service reminders, review requests). We don&apos;t sell your information, and
                  we don&apos;t hand it to lead-generation companies or other businesses looking
                  to pitch you something unrelated to the work you asked us for.
                </p>
              </article>

              {/* Service providers */}
              <article>
                <h2
                  className="flex items-center gap-3 text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Cookie className="h-5 w-5 shrink-0 text-[#62C4EB]" aria-hidden />
                  Tools we use to run the business
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  We use standard business software — a CRM to track your job and send
                  scheduling texts/emails, payment processing to run your card or deposit, and
                  basic website analytics. These providers can see your information only to the
                  extent needed to provide that service to us; none of them are permitted to use
                  it for their own marketing.
                </p>
              </article>

              {/* Your choices */}
              <article className="rounded-2xl bg-[#F4F7F8] p-6 ring-1 ring-[#E4ECF1] md:p-8">
                <h2
                  className="text-xl font-semibold text-[#0C1215] md:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Your choices
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4B5C6B]">
                  Reply <strong>STOP</strong> to any text from us to stop receiving texts, or{" "}
                  <strong>HELP</strong> for assistance. To update or remove your information
                  entirely, just call or email us — we&apos;ll take care of it directly, no
                  account or portal required.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
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

              <article>
                <p className="text-sm leading-relaxed text-[#8C9AA5]">
                  We may update this policy from time to time; the version posted here is the
                  one in effect. See also our{" "}
                  <a href="/terms" className="font-semibold text-[#3AA8D4] underline">
                    Terms
                  </a>
                  .
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
