"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";

/** Show the machine actually working (real footage), beside the four-step
 *  money path. Risk-reversal copy: nothing charges until they approve. */
const STEPS = [
  {
    n: "01",
    title: "Tell us what's dirty",
    body: "Two minutes online or one phone call. Photos help — you'll have a firm quote the same day.",
  },
  {
    n: "02",
    title: "A 50% deposit books your date",
    body: "Accept the quote, pick your day. The deposit locks your price and your slot — nothing else charges yet.",
  },
  {
    n: "03",
    title: "We clean. You walk it.",
    body: "Method matched to every surface. When we're done, you inspect the work before anything else happens.",
  },
  {
    n: "04",
    title: "Pay the rest only when it's right",
    body: "Balance settles after your walkthrough. Spot something within 48 hours? We re-rinse it free.",
  },
];

export function ProcessSection() {
  const headRef = useScrollReveal();
  const stepsRef = useStaggerReveal(0.12);

  return (
    <section id="process" className="bg-white py-16 md:py-24">
      <div className="container-site">
        <div ref={headRef}>
          <h2
            className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You approve the work before the balance ever charges.
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
          {/* real footage — the rotary cleaner mid-pass */}
          <div className="relative overflow-hidden rounded-3xl border border-[#E4ECF1] shadow-[0_30px_60px_-30px_rgba(20,45,60,0.3)]">
            <video
              src="/brand/video/surface-cleaning.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="aspect-[4/3] w-full object-cover"
              aria-label="Rotary surface cleaner removing grime in a single pass"
            />
            <span className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Live footage — one pass, no edit
            </span>
          </div>

          <div ref={stepsRef} className="flex flex-col gap-7">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5">
                <span
                  className="text-3xl font-medium leading-none text-[#62C4EB] md:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.n}
                </span>
                <div>
                  <h3
                    className="text-lg font-medium text-[#0C1215]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5C6B]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
