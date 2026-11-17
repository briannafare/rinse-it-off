"use client";
/* eslint-disable @next/next/no-img-element -- job photos live in Blob, already sized for phones; next/image would need the store's host whitelisted for no gain */

import { ChevronLeft, ChevronRight, MessageSquare, Play, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkle, StripeBand } from "@/components/retro/Bits";
import { firstName, sliderPair, STAGES, WORKERS, type JobMedia, type JobReport, type Stage } from "@/lib/jobs/types";

const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJ1ZBVQYANlVQRSewi4rUgo_k";
const TEXT_US = "sms:+19716264146";
const STAGE_LABEL: Record<Stage, string> = { before: "Before", during: "During", after: "After" };

const rise = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } as const;

export default function ReportView({ r, preview }: { r: JobReport; preview: boolean }) {
  const reduce = useReducedMotion();
  const anim = reduce ? {} : rise;
  const pair = sliderPair(r);
  const cover = pair?.after ?? r.media.after.find((m) => m.kind === "image");
  const first = firstName(r.client.name);
  const lead = WORKERS.find((w) => w.name === r.lead);
  const day = new Date(`${r.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const street = r.client.address.split(",")[0].trim();
  const stages = STAGES.filter((s) => r.media[s].length);
  const [tab, setTab] = useState<Stage>(stages.includes("after") ? "after" : stages[0] ?? "after");
  const [open, setOpen] = useState<number | null>(null);
  const items = r.media[tab];

  return (
    <div className="min-h-screen bg-retro-paper text-[#0C1215]">
      {preview && (
        <div className="sticky top-0 z-40 bg-[#F2B632] px-4 py-2 text-center text-sm font-semibold">
          Preview. {first} can&apos;t see this page until you send it from the job tool.
        </div>
      )}

      {/* ── masthead ── */}
      <header className="container-site flex items-center justify-between py-4 md:py-5">
        <a href="/" aria-label="Rinse It Off home"><img src="/logo-dark.png" alt="Rinse It Off" width={706} height={438} className="h-11 w-auto md:h-12" /></a>
        <span className="label-caps text-[#1A6E93]">Job report</span>
      </header>

      {/* ── hero: the result, with the slider front and centre ── */}
      <section className="bg-stars pb-14 md:pb-20">
        <div className={`container-site grid items-center gap-8 pt-4 md:pt-8 ${pair && pair.after.w >= pair.after.h ? "md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12" : "md:grid-cols-2 md:gap-14"}`}>
          <motion.div {...anim}>
            <p className="label-caps text-[#1A6E93]">{[day, street].filter(Boolean).join(" · ")}</p>
            <h1 className="mt-3 text-display-lg md:text-[3.25rem]">All done, {first}.</h1>
            {r.remarks?.summary && <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#3B4247]">{r.remarks.summary}</p>}
            {lead && (
              <p className="mt-6 inline-flex items-center gap-3 text-sm text-[#3B4247]">
                <span className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-[#0C1215] bg-[#62C4EB] font-title text-lg">{lead.name[0]}</span>
                <span><b className="font-semibold text-[#0C1215]">{lead.name}</b> led your job</span>
              </p>
            )}
          </motion.div>
          <motion.div {...anim} transition={{ ...rise.transition, delay: 0.1 }}>
            {pair ? (
              <Compare before={pair.before} after={pair.after} />
            ) : cover ? (
              <figure className={`mat overflow-hidden ${cover.h > cover.w ? "mx-auto max-w-[420px]" : ""}`}>
                <img src={cover.url} alt={`${street || "The property"} after cleaning`} width={cover.w} height={cover.h} className="block h-auto w-full rounded-[10px]" />
              </figure>
            ) : null}
          </motion.div>
        </div>
      </section>
      <StripeBand />

      {/* ── what we did ── */}
      {r.remarks && r.remarks.items.length > 0 && (
        <section className="bg-white py-14 md:py-20">
          <div className="container-site max-w-5xl">
            <motion.div {...anim} className="flex items-end justify-between gap-6">
              <div>
                <p className="label-caps text-[#1A6E93]">The rundown</p>
                <h2 className="mt-2 text-display">What we did</h2>
              </div>
              <figure className="hidden shrink-0 text-center sm:block">
                <img src="/brand/hal/hal-clipboard.webp" alt="" width={600} height={555} className="h-auto w-28 md:w-32" />
                <figcaption className="label-caps mt-1 text-[10px] text-[#5F676C]">Hal checked it over</figcaption>
              </figure>
            </motion.div>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {r.remarks.items.map((it, i) => (
                <motion.li key={i} {...anim} transition={{ ...rise.transition, delay: reduce ? 0 : i * 0.06 }}
                  className="frame flex gap-4 bg-[#FBF8F2] p-5 md:p-6">
                  <span className="font-title text-3xl leading-none text-[#D6336C]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{it.area}</h3>
                    <p className="mt-1 leading-relaxed text-[#3B4247]">{it.did}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── a note from the lead ── */}
      {r.note.trim() && (
        <section className="py-14 md:py-20">
          <motion.figure {...anim} className="container-site max-w-3xl">
            <div className="mat relative bg-white px-6 pb-7 pt-10 md:px-10 md:pb-9 md:pt-12">
              <span aria-hidden className="absolute -top-7 left-6 font-title text-[5.5rem] leading-none text-[#D6336C] md:left-10">&ldquo;</span>
              <p className="label-caps text-[#1A6E93]">A note from {r.lead}</p>
              <blockquote className="mt-3 whitespace-pre-line text-xl leading-relaxed md:text-2xl">{r.note.trim()}</blockquote>
              <figcaption className="mt-5 text-sm text-[#5F676C]">{lead?.full ?? r.lead}, Rinse It Off</figcaption>
            </div>
          </motion.figure>
        </section>
      )}

      {/* ── every photo and clip ── */}
      {stages.length > 0 && (
        <section className="bg-[#E6F5FC] py-14 md:py-20">
          <div className="container-site max-w-6xl">
            <motion.div {...anim}>
              <p className="label-caps text-[#1A6E93]">Photos and video</p>
              <h2 className="mt-2 text-display">Every shot from the day</h2>
            </motion.div>
            <div role="tablist" aria-label="Part of the job" className="mt-6 flex gap-6 border-b border-[#0C1215]/15">
              {stages.map((s) => (
                <button key={s} role="tab" aria-selected={tab === s} onClick={() => setTab(s)}
                  className={`label-caps -mb-px min-h-11 border-b-[3px] pb-2 text-[13px] transition-colors ${tab === s ? "border-[#2E9BC6] text-[#0C1215]" : "border-transparent text-[#5F676C] hover:text-[#0C1215]"}`}>
                  {STAGE_LABEL[s]} <span className="ml-1 font-body text-xs font-normal normal-case tracking-normal text-[#5F676C]">{r.media[s].length}</span>
                </button>
              ))}
            </div>
            <div key={tab} className="mt-6 columns-2 gap-3 md:columns-3 md:gap-4">
              {items.map((m, i) => (
                <motion.button key={m.url} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(i, 8) * 0.04 }}
                  onClick={() => setOpen(i)} aria-label={`Open ${STAGE_LABEL[tab].toLowerCase()} ${m.kind} ${i + 1}`}
                  className="frame group relative mb-3 block w-full overflow-hidden bg-[#0C1215] md:mb-4">
                  {m.kind === "image" || m.poster ? (
                    <img src={m.kind === "image" ? m.url : m.poster} alt="" width={m.w} height={m.h} loading="lazy"
                      className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
                  ) : (
                    <div style={{ aspectRatio: `${m.w}/${m.h}` }} />
                  )}
                  {m.kind === "video" && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#0C1215] bg-[#F2B632] shadow-[3px_3px_0_#0C1215]">
                        <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                      </span>
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── after the job ── */}
      <section className="py-16 md:py-24">
        <motion.div {...anim} className="container-site max-w-2xl text-center">
          <img src="/brand/hal/hal-approval.webp" alt="" width={600} height={591} className="mx-auto h-auto w-32 md:w-36" />
          <h2 className="mt-4 text-display">Happy with how it turned out?</h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-[#3B4247]">A quick Google review helps your neighbors find us. It takes about a minute.</p>
          <a href={REVIEW_URL} target="_blank" rel="noopener" className="btn-retro mt-7 inline-flex min-h-[52px] items-center justify-center bg-[#F2B632] px-7 py-4">
            Leave a Google review
          </a>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6">
            <a href="/plan" className="link-plain">Book the next clean</a>
            <a href={TEXT_US} className="link-plain"><MessageSquare className="h-4 w-4" /> Text us at (971) 626-4146</a>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[#E4DCCD] py-8">
        <div className="container-site flex flex-col items-center gap-2 text-center text-sm text-[#5F676C] sm:flex-row sm:justify-between sm:text-left">
          <span>Rinse It Off · Exterior cleaning around Portland, OR</span>
          <span className="inline-flex items-center gap-2"><Sparkle className="h-3 w-3" /> Questions about the job? Text us anytime.</span>
        </div>
      </footer>

      {open !== null && <Lightbox items={items} index={open} stage={tab} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** Before/after slider. Drag anywhere on it (or arrow keys on the handle). It sweeps once on its own
 *  the first time it scrolls into view, so people see it moves. */
function Compare({ before, after }: { before: JobMedia; after: JobMedia }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const drag = useRef(false);

  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const keys = [50, 22, 78, 50], dur = 2200;
      const t0 = performance.now() + 500;
      const step = (t: number) => {
        if (touched.current) return;
        const p = Math.max(0, Math.min((t - t0) / dur, 1)), seg = Math.min(p * 3, 2.999), i = Math.floor(seg), f = seg - i;
        setPos(keys[i] + (keys[i + 1] - keys[i]) * ((1 - Math.cos(f * Math.PI)) / 2));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const moveTo = (x: number) => {
    const b = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((x - b.left) / b.width) * 100)));
  };
  const portrait = after.h > after.w;

  return (
    <figure className={portrait ? "mx-auto max-w-[440px]" : ""}>
      <div className="mat">
        <div
          ref={box}
          className="relative cursor-ew-resize select-none overflow-hidden rounded-[10px] bg-[#0C1215]"
          style={{ aspectRatio: `${after.w}/${after.h}`, touchAction: "pan-y" }}
          onPointerDown={(e) => { touched.current = true; drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX); }}
          onPointerMove={(e) => drag.current && moveTo(e.clientX)}
          onPointerUp={() => (drag.current = false)}
          onPointerCancel={() => (drag.current = false)}
        >
          <img src={after.url} alt="After" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
          <img src={before.url} alt="Before" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
          <span className="label-caps pointer-events-none absolute left-3 top-3 rounded-md border-[1.5px] border-[#0C1215] bg-white px-2 py-1 text-[11px] transition-opacity" style={{ opacity: pos > 14 ? 1 : 0 }}>Before</span>
          <span className="label-caps pointer-events-none absolute right-3 top-3 rounded-md border-[1.5px] border-[#0C1215] bg-[#F2B632] px-2 py-1 text-[11px] transition-opacity" style={{ opacity: pos < 86 ? 1 : 0 }}>After</span>
          <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(12,18,21,.35)]" style={{ left: `${pos}%` }} />
          <button
            type="button"
            role="slider"
            aria-label="Compare before and after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); touched.current = true; setPos((p) => Math.max(0, Math.min(100, p + (e.key === "ArrowLeft" ? -5 : 5)))); }
            }}
            className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#0C1215] bg-white shadow-[3px_3px_0_#0C1215] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2E9BC6]"
            style={{ left: `${pos}%` }}
          >
            <span className="flex items-center"><ChevronLeft className="-mr-1 h-4 w-4" /><ChevronRight className="-ml-1 h-4 w-4" /></span>
          </button>
        </div>
      </div>
      <figcaption className="label-caps mt-3 text-center text-[11px] text-[#5F676C]">Drag the line to compare</figcaption>
    </figure>
  );
}

function Lightbox({ items, index, stage, onIndex, onClose }: { items: JobMedia[]; index: number; stage: Stage; onIndex: (i: number) => void; onClose: () => void }) {
  const m = items[index];
  const go = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);
  const startX = useRef<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", key);
    return () => { document.body.style.overflow = prev; removeEventListener("keydown", key); };
  }, [go, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${STAGE_LABEL[stage]} photos`} className="fixed inset-0 z-50 flex flex-col bg-[#0C1215]/95 text-white"
      onPointerDown={(e) => (startX.current = (e.target as HTMLElement).tagName === "VIDEO" ? null : e.clientX)} // scrubbing a video is not a swipe
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50 && items.length > 1) go(dx < 0 ? 1 : -1);
      }}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="label-caps text-[12px] text-white/80">{STAGE_LABEL[stage]} · {index + 1} of {items.length}</span>
        <button ref={closeBtn} onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-3">
        {m.kind === "image" ? (
          <img key={m.url} src={m.url} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
        ) : (
          <video key={m.url} src={m.url} poster={m.poster} controls autoPlay playsInline className="max-h-full max-w-full rounded-lg" />
        )}
      </div>
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-4 pb-6" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
          <button onClick={() => go(-1)} aria-label="Previous" className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/80 hover:bg-white/10"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={() => go(1)} aria-label="Next" className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/80 hover:bg-white/10"><ChevronRight className="h-6 w-6" /></button>
        </div>
      )}
    </div>
  );
}
