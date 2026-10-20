"use client";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";

/** Show the machine actually working (real footage), beside the four-step
 *  money path. Risk-reversal copy: nothing charges until they approve. */
const STEPS = [
  {
    n: "01",
    title: "We walk it with you, free",
    body: "We look at every surface on site, whether that's a house, a storefront or a whole facility, and you get a firm itemized quote the same day. It's 21 points and it costs nothing.",
  },
  {
    n: "02",
    title: "Reserve your slot, lock your price",
    body: "Accept the quote and pick your day. Your price is locked, and a small deposit holds the date. Nothing else charges yet.",
  },
  {
    n: "03",
    title: "We clean. You walk it.",
    body: "Every surface gets the method it needs, at your house or at your building. When we're done you walk the job with us before anything else happens.",
  },
  {
    n: "04",
    title: "Pay the rest only when it's right",
    body: "The balance settles after that walkthrough. If something isn't right, the Clean Water Promise covers it and we come back to re-rinse it free within 48 hours.",
  },
];

export function ProcessSection() {
  const headRef = useScrollReveal();
  const stepsRef = useStaggerReveal(0.12);
  const [reduceMotion, setReduceMotion] = useState(false);
  // The 1.4 MB clip loads only when the section nears the screen. It used to
  // download with the page and compete with the hero photo on phones.
  const videoBox = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  // the source is set late, so the element has to be told to load and play it
  useEffect(() => {
    const v = video.current;
    if (!near || !v) return;
    v.load();
    if (!reduceMotion) v.play().catch(() => {});
  }, [near, reduceMotion]);

  useEffect(() => {
    const el = videoBox.current;
    if (!el || near) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section id="process" className="bg-retro-paper py-16 md:py-24">
      <div className="container-site">
        <div ref={headRef}>
          <h2 className="max-w-5xl text-[#0C1215]">
            You approve the work before the balance ever charges.
          </h2>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:gap-16">
          {/* real footage — the rotary cleaner mid-pass */}
          <div ref={videoBox} className="relative -mx-4 overflow-hidden sm:-mx-6 lg:mx-0">
            <video
              ref={video}
              src={near ? "/brand/video/surface-cleaning.mp4" : undefined}
              preload="none"
              poster="/brand/photos/work/surface-cleaning-poster.webp"
              autoPlay={!reduceMotion}
              muted
              loop={!reduceMotion}
              controls={reduceMotion}
              playsInline
              className="aspect-[4/3] w-full object-cover md:aspect-[21/9]"
              aria-label="Rotary surface cleaner removing grime in a single pass"
            />
            <span className="absolute bottom-4 left-4 bg-[#FBF8F2] px-4 py-2 text-lg font-bold text-[#0C1215]">
              Real job footage
            </span>
          </div>

          <div ref={stepsRef} className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5">
                <span className="font-title text-[2.6rem] leading-none text-[#1A6E93] md:text-[2.4rem]">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-[#0C1215]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-lg leading-relaxed text-[#3B4247]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex md:mt-16">
          <a
            href="/assessment"
            className="group btn-print bg-[#F2B632] text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
          >
            Book your free 21-point audit
          </a>
        </div>
      </div>
    </section>
  );
}
