import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Rinse It Off for residential and commercial exterior cleaning across the Portland metro. Call (503) 704-3755, email hello@rinseitoff.com, or book your free property assessment.",
  alternates: { canonical: "https://rinseitoff.com/contact" },
};

const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

const cardBase =
  "block rounded-2xl bg-white p-6 ring-1 ring-[#E4ECF1] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] motion-reduce:transition-none";
const cardLink = `group ${cardBase} hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(20,45,60,0.22)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none`;
const label = "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8C9AA5]";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Dark band = punctuation; the body below is light clean-water. */}
        <section className="relative overflow-hidden bg-[#0C1215] pt-28 pb-14 md:pt-32 md:pb-20">
          <div className="container-site">
            <p className="flex items-center gap-2 text-sm font-medium text-white/85">
              <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
              Talk to a real person
            </p>
            <h1
              className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] leading-[1.02] tracking-[-0.03em] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Get in touch
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
              Questions, scheduling, or ready for your free property assessment — here&apos;s
              how to reach us. We serve homeowners and businesses across the Portland metro.
            </p>
          </div>
        </section>

        <section className="bg-[#F4F7F8] py-16 md:py-24">
          <div className="container-site">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Phone */}
              <a href={PHONE_TEL} className={cardLink}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#62C4EB]/12">
                  <Phone className="h-5 w-5 text-[#3AA8D4]" aria-hidden />
                </span>
                <p className={`mt-5 ${label}`}>Call or text</p>
                <p
                  className="mt-1 text-lg font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {PHONE_DISPLAY}
                </p>
                <p className="mt-1 text-sm text-[#4B5C6B]">
                  Fastest way to reach us for a quick question.
                </p>
              </a>

              {/* Email */}
              <a href="mailto:hello@rinseitoff.com" className={cardLink}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#62C4EB]/12">
                  <Mail className="h-5 w-5 text-[#3AA8D4]" aria-hidden />
                </span>
                <p className={`mt-5 ${label}`}>Email</p>
                <p
                  className="mt-1 text-lg font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  hello@rinseitoff.com
                </p>
                <p className="mt-1 text-sm text-[#4B5C6B]">
                  Send details or photos and we&apos;ll follow up quickly.
                </p>
              </a>

              {/* Service area */}
              <div className={cardBase}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#62C4EB]/12">
                  <MapPin className="h-5 w-5 text-[#3AA8D4]" aria-hidden />
                </span>
                <p className={`mt-5 ${label}`}>Service area</p>
                <p
                  className="mt-1 text-lg font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Portland, Oregon &amp; the surrounding metro
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#4B5C6B]">
                  Beaverton, Hillsboro, Lake Oswego, Tigard, Tualatin, West Linn, Gresham
                  &amp; Milwaukie. Larger commercial projects throughout the Willamette
                  Valley.
                </p>
              </div>

              {/* Hours */}
              <div className={cardBase}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#62C4EB]/12">
                  <Clock className="h-5 w-5 text-[#3AA8D4]" aria-hidden />
                </span>
                <p className={`mt-5 ${label}`}>Hours</p>
                <p
                  className="mt-1 text-lg font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Monday–Saturday, 7am–6pm
                </p>
                <p className="mt-1 text-sm text-[#4B5C6B]">
                  Closed Sundays. Leave a message anytime and we&apos;ll get right back to
                  you.
                </p>
              </div>
            </div>

            {/* Primary CTA panel */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-[#0C1215] p-8 md:mt-10 md:p-10">
              <h2
                className="text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.1] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Ready for a free property assessment?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80">
                We walk your property, read every surface, and hand you a firm, itemized
                quote the same day. No obligation — just an honest look.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href="/assessment"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Book your free assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                </a>
                <a
                  href="/assessment?type=residential"
                  className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-white hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Homeowner? Start a residential quote
                </a>
                <a
                  href="/assessment?type=commercial"
                  className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-semibold text-white hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Commercial property?
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
