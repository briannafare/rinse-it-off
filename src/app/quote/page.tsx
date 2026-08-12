import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, Check, Phone, ShieldCheck, Droplets, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Get a House Wash Quote | Rinse It Off Portland",
  description:
    "Start your exterior cleaning quote for your Portland home. Tell us about your house and we'll bring you a firm, itemized quote the same day we walk your property. Licensed & insured, backed by our Clean Water Promise.",
};

// ─── Scaffold content ─────────────────────────────────────────────────────────
const SERVICES = [
  "House wash",
  "Roof & moss soft wash",
  "Driveway / Concrete",
  "Gutter cleaning",
  "Deck / Fence",
  "Windows",
];

const HOME_SIZES = [
  "Under 1,500 sq ft",
  "1,500–2,500 sq ft",
  "2,500–4,000 sq ft",
  "4,000+ sq ft",
  "Not sure",
];

const TRUST = [
  "Licensed & insured",
  "Serving Portland metro",
  "Backed by the Clean Water Promise",
];

// ─── Server action ──────────────────────────────────────────────────────────
// A parameter-less async server action is assignable to <form action>. We ignore
// the submitted fields for now and forward to the on-site assessment flow.
async function startQuote() {
  "use server";
  // TODO(pricing): Bri still needs to define the residential pricing rules before
  // this page can return a live number. Do NOT invent prices. For now we hand off
  // to the on-site step — the free 21-point property audit is what produces the
  // firm, itemized quote. When the rules exist, map this form's FormData (address,
  // services, home size, photos, contact) into the same GHL submission used by
  // /assessment (see src/app/assessment/actions.ts) instead of redirecting.
  redirect("/assessment?type=residential");
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuotePage() {
  return (
    <div className="min-h-screen bg-white font-body text-[#0C1215]">
      {/* Header */}
      <header className="border-b border-[#EFF4F7] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <a
            href="/"
            className="rounded-lg font-display text-lg font-semibold tracking-tight text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Rinse It Off
          </a>
          <a
            href="tel:+15037043755"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#EDF7FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
          >
            <Phone className="h-4 w-4 text-[#62C4EB]" aria-hidden />
            (503) 704-3755
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className="border-b border-[#EFF4F7]"
        style={{
          backgroundImage:
            "radial-gradient(120% 120% at 15% 0%, #EDF7FC 0%, transparent 55%), radial-gradient(120% 120% at 90% 20%, #F5F7F4 0%, transparent 55%)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#4B5C6B]">
              Portland, OR — Licensed &amp; insured
            </p>
            <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-[#0C1215] sm:text-5xl">
              Start your home&apos;s cleaning quote
              <span className="mt-3 block h-1 w-16 rounded-full bg-[#62C4EB]" aria-hidden />
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#4B5C6B]">
              Tell us about your house below. We&apos;ll bring you a firm, itemized quote the
              same day we walk your property — not a runaround. In a city that sees about
              164 rainy days a year, your siding, roof, and concrete earn a rinse.
            </p>
            <ul className="mt-6 space-y-2">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-[#4B5C6B]">
                  <Check className="h-4 w-4 flex-shrink-0 text-[#62C4EB]" strokeWidth={3} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#E4ECF1] shadow-soft">
            <Image
              src="/brand/photos/hero-woman.webp"
              alt="A Rinse It Off technician softly rinsing the exterior of a home"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section className="bg-[#F4F7F8] py-14 lg:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <form
            action={startQuote}
            className="rounded-2xl border border-[#EFF4F7] bg-white p-6 shadow-soft-md sm:p-8"
          >
            {/* Step 1 — Address */}
            <fieldset className="mb-8">
              <legend className="mb-3 flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EDF7FC] text-sm font-semibold text-[#0C1215]">
                  1
                </span>
                <span className="font-display text-base font-semibold text-[#0C1215]">
                  Where&apos;s your home?
                </span>
              </legend>
              <input
                type="text"
                name="address"
                autoComplete="street-address"
                placeholder="1234 SE Oak St, Portland, OR"
                className="min-h-11 w-full rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] placeholder:text-[#8899A6] transition-colors hover:border-[#CBD8E0] focus:border-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
              />
            </fieldset>

            {/* Step 2 — Services */}
            <fieldset className="mb-8">
              <legend className="mb-3 flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EDF7FC] text-sm font-semibold text-[#0C1215]">
                  2
                </span>
                <span className="font-display text-base font-semibold text-[#0C1215]">
                  What needs a rinse?
                </span>
                <span className="text-sm font-normal text-[#8899A6]">Select all that apply</span>
              </legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <label
                    key={s}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] transition-colors hover:border-[#62C4EB] has-[:checked]:border-[#62C4EB] has-[:checked]:bg-[#EDF7FC] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#62C4EB] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white motion-reduce:transition-none"
                  >
                    <input type="checkbox" name="services" value={s} className="peer sr-only" />
                    <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-md border border-[#CBD8E0] bg-white peer-checked:border-[#62C4EB] peer-checked:bg-[#62C4EB]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden />
                    </span>
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Step 3 — Home size */}
            <fieldset className="mb-8">
              <legend className="mb-3 flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EDF7FC] text-sm font-semibold text-[#0C1215]">
                  3
                </span>
                <span className="font-display text-base font-semibold text-[#0C1215]">
                  How big is your home?
                </span>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {HOME_SIZES.map((size) => (
                  <label
                    key={size}
                    className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-[#E4ECF1] bg-white px-4 py-2.5 text-sm text-[#0C1215] transition-colors hover:border-[#62C4EB] has-[:checked]:border-[#62C4EB] has-[:checked]:bg-[#EDF7FC] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#62C4EB] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white motion-reduce:transition-none"
                  >
                    <input type="radio" name="homeSize" value={size} className="peer sr-only" />
                    <span className="grid h-4 w-4 flex-shrink-0 place-items-center rounded-md border border-[#CBD8E0] bg-white peer-checked:border-[#62C4EB] peer-checked:bg-[#62C4EB]">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} aria-hidden />
                    </span>
                    {size}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Step 4 — Photos (optional) */}
            <fieldset className="mb-8">
              <legend className="mb-3 flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EDF7FC] text-sm font-semibold text-[#0C1215]">
                  4
                </span>
                <span className="font-display text-base font-semibold text-[#0C1215]">
                  Add a few photos
                </span>
                <span className="text-sm font-normal text-[#8899A6]">Optional</span>
              </legend>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CBD8E0] bg-[#F8FBFE] px-4 py-4 text-sm text-[#4B5C6B] transition-colors hover:border-[#62C4EB] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#62C4EB] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-white motion-reduce:transition-none">
                <Camera className="h-5 w-5 flex-shrink-0 text-[#62C4EB]" aria-hidden />
                <span>
                  Show us the surfaces{" "}
                  <span className="text-[#8899A6]">— it helps us walk your property faster</span>
                </span>
                <input type="file" name="photos" accept="image/*" multiple className="sr-only" />
              </label>
            </fieldset>

            {/* Step 5 — Contact / results */}
            <fieldset className="mb-6">
              <legend className="mb-3 flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EDF7FC] text-sm font-semibold text-[#0C1215]">
                  5
                </span>
                <span className="font-display text-base font-semibold text-[#0C1215]">
                  Where should we send it?
                </span>
              </legend>
              <div className="grid gap-3">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Full name"
                  className="min-h-11 w-full rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] placeholder:text-[#8899A6] transition-colors hover:border-[#CBD8E0] focus:border-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                />
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  required
                  placeholder="Phone number"
                  className="min-h-11 w-full rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] placeholder:text-[#8899A6] transition-colors hover:border-[#CBD8E0] focus:border-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email (optional)"
                  className="min-h-11 w-full rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] placeholder:text-[#8899A6] transition-colors hover:border-[#CBD8E0] focus:border-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
                />
              </div>
            </fieldset>

            {/* Honest expectation-setter — no fake instant price */}
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#EDF7FC] p-4">
              <Droplets className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#62C4EB]" aria-hidden />
              <p className="text-sm leading-relaxed text-[#4B5C6B]">
                <span className="font-semibold text-[#0C1215]">
                  A firm quote the same day we walk your property.
                </span>{" "}
                Your free 21-point property audit is the on-site step that produces the
                itemized quote — so the number you get is one you can hold us to, backed by
                our Clean Water Promise.
              </p>
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              Get my quote
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden
              />
            </button>
            <p className="mt-3 text-center text-xs text-[#8899A6]">
              No pressure, no spam. We schedule your on-site audit, then hand you the quote
              that day.
            </p>
          </form>

          {/* Clean Water Promise + audiences */}
          <div className="mt-8 rounded-2xl border border-[#EFF4F7] bg-white p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#62C4EB]" aria-hidden />
              <div>
                <h2 className="font-display text-base font-semibold text-[#0C1215]">
                  The Clean Water Promise
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4B5C6B]">
                  If there&apos;s anything you&apos;re not happy with, we re-rinse it free,
                  within 48 hours. That&apos;s the whole promise.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#4B5C6B]">
            Managing a property or portfolio?{" "}
            <a
              href="/assessment?type=commercial"
              className="rounded font-semibold text-[#0C1215] underline decoration-[#62C4EB] decoration-2 underline-offset-4 hover:text-[#4B5C6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8]"
            >
              Book a free property audit
            </a>
            .
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E1419] text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-sm text-white/50">
            Rinse It Off — exterior cleaning across Portland metro. Licensed &amp; insured.
          </p>
          <a
            href="tel:+15037043755"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition-colors hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1419] motion-reduce:transition-none"
          >
            <Phone className="h-4 w-4 text-[#62C4EB]" aria-hidden />
            (503) 704-3755
          </a>
        </div>
      </footer>
    </div>
  );
}
