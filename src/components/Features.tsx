"use client";
import { useState, useEffect, useRef } from "react";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { Calendar, ArrowRight } from "lucide-react";

/* ═══════════════ CARD 1: Diagnostic Shuffler ═══════════════ */
const SHUFFLE_ITEMS = [
  { label: "Building Exterior Wash", status: "Scheduled", accent: "bg-brand-mint" },
  { label: "Parking Lot Degrease", status: "In Progress", accent: "bg-brand-blue" },
  { label: "Storefront Soft Wash", status: "Complete", accent: "bg-emerald-400" },
];

function DiagnosticShuffler() {
  const [items, setItems] = useState(SHUFFLE_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => { const copy = [...prev]; copy.unshift(copy.pop()!); return copy; });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-40 flex items-center justify-center">
      {items.map((item, i) => {
        const isTop = i === 0;
        const offset = i * 8;
        const scale = 1 - i * 0.04;
        const opacity = 1 - i * 0.25;
        return (
          <div
            key={item.label}
            className="absolute left-4 right-4 rounded-xl border border-border-light bg-white px-4 py-3 shadow-soft flex items-center justify-between"
            style={{
              transform: `translateY(${offset}px) scale(${scale})`,
              opacity,
              zIndex: 3 - i,
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${item.accent}`} />
              <span className="text-sm font-medium text-text-primary">{item.label}</span>
            </div>
            <span className="text-[11px] text-text-muted font-mono">{item.status}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════ CARD 2: Telemetry Typewriter ═══════════════ */
const FEED_MESSAGES = [
  "Crew dispatched to NW 23rd...",
  "Building wash complete — 4 stories",
  "Parking lot degrease started",
  "Gutter clearing in progress",
  "Client approved maintenance plan",
  "Hot water unit deployed",
  "Soft wash application — stucco",
  "Window cleaning — RO water feed",
];

function TelemetryTypewriter() {
  const [lines, setLines] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const msg = FEED_MESSAGES[msgIdx % FEED_MESSAGES.length];
    if (charIdx <= msg.length) {
      const timeout = setTimeout(() => {
        setCurrent(msg.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, 35 + Math.random() * 25);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev.slice(-4), msg]);
        setCurrent("");
        setCharIdx(0);
        setMsgIdx(i => i + 1);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [charIdx, msgIdx]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [lines, current]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
        <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Live Feed</span>
      </div>
      <div ref={feedRef} className="h-32 overflow-hidden font-mono text-xs leading-loose text-text-secondary space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="opacity-40">{line}</div>
        ))}
        {current && (
          <div className="text-text-primary">
            {current}<span className="inline-block w-1.5 h-3.5 bg-brand-mint ml-0.5 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ CARD 3: Cursor Protocol Scheduler ═══════════════ */
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function CursorScheduler() {
  const [activeDay, setActiveDay] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: -20, y: -20 });
  const [phase, setPhase] = useState<"idle" | "moving" | "clicking" | "saving" | "done">("idle");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = async () => {
      await sleep(1500);
      // Move to a random day
      const dayIdx = 2; // Wednesday
      const dayEl = gridRef.current?.children[dayIdx] as HTMLElement | undefined;
      if (!dayEl) return;
      const rect = dayEl.getBoundingClientRect();
      const parentRect = gridRef.current!.getBoundingClientRect();
      setPhase("moving");
      setCursorPos({ x: rect.left - parentRect.left + rect.width / 2, y: rect.top - parentRect.top + rect.height / 2 });
      await sleep(800);
      setPhase("clicking");
      await sleep(200);
      setActiveDay(dayIdx);
      setPhase("saving");
      await sleep(1200);
      setPhase("done");
      await sleep(2000);
      setActiveDay(-1);
      setCursorPos({ x: -20, y: -20 });
      setPhase("idle");
    };
    sequence();
    const interval = setInterval(sequence, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <p className="text-[11px] font-mono text-text-muted uppercase tracking-wider mb-3">Maintenance Schedule</p>
      <div ref={gridRef} className="grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
              activeDay === i
                ? "bg-brand-mint text-brand-black scale-95 shadow-glow-mint"
                : "bg-surface-alt text-text-muted border border-border-light"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      {phase === "done" && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-mint font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-mint" />
          Wednesday service confirmed
        </div>
      )}
      {/* Animated cursor */}
      {phase !== "idle" && phase !== "done" && (
        <svg
          className="absolute pointer-events-none z-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ left: cursorPos.x - 6, top: cursorPos.y - 2, transform: phase === "clicking" ? "scale(0.85)" : "scale(1)" }}
          width="20" height="24" viewBox="0 0 20 24" fill="none"
        >
          <path d="M4 1L4 16L8 12L12 19L15 17.5L11 10.5L16 10L4 1Z" fill="white" stroke="#0C1215" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════════════ EXPORT ═══════════════ */
export function Features() {
  const headingRef = useScrollReveal();
  const cardsRef = useStaggerReveal(0.15);

  const cards = [
    {
      heading: "Real-Time Service Tracking",
      desc: "Every project managed, tracked, and delivered on schedule. Full visibility from booking to completion.",
      content: <DiagnosticShuffler />,
    },
    {
      heading: "Active Operations",
      desc: "Our crew is always moving. Live updates on active jobs across Portland metro.",
      content: <TelemetryTypewriter />,
    },
    {
      heading: "Flexible Scheduling",
      desc: "Book one-time cleans or set recurring maintenance. We work around your tenants and business hours.",
      content: <CursorScheduler />,
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-site">
        <div ref={headingRef} className="max-w-xl mb-14">
          <h2 className="font-display font-bold text-display-lg text-text-primary leading-tight mb-4">
            How We <span className="font-serif font-normal italic text-brand-blue">Operate</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Professional systems, not fly-by-night operations. Your property is an asset — we treat it like one.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div key={card.heading} className="group rounded-[2rem] bg-white border border-border-light p-6 md:p-7 shadow-soft hover:shadow-soft-lg hover:border-brand-blue/15 transition-all duration-500">
              {card.content}
              <div className="mt-5 pt-5 border-t border-border-light">
                <h3 className="font-display font-bold text-base text-text-primary mb-1.5">{card.heading}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
