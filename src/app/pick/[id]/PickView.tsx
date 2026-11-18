"use client";
/* eslint-disable @next/next/no-img-element -- the logo, same as /done */

import { Check, Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { StripeBand } from "@/components/retro/Bits";
import { priceSelection, type OfferLine } from "@/lib/quote/bundle";
import { bookPicks } from "./actions";

const TEXT_US = "sms:+19716264146";
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

export default function PickView({
  id,
  first,
  street,
  lines,
  accepted,
}: {
  id: string;
  first: string;
  street: string;
  lines: OfferLine[];
  accepted: { ids: string[]; total: number; pct: number } | null;
}) {
  const [picked, setPicked] = useState<string[]>(accepted?.ids ?? lines.map((l) => l.id));
  const [done, setDone] = useState<{ total: number; pct: number; sent: boolean } | null>(
    accepted ? { total: accepted.total, pct: accepted.pct, sent: true } : null,
  );
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const r = useMemo(() => priceSelection(lines, picked), [lines, picked]);
  // A line shows what it costs alongside what's picked now (gutters are half price with the roof).
  const shown = (l: OfferLine) =>
    r.lines.find((x) => x.id === l.id) ?? priceSelection(lines, [...picked, l.id]).lines.find((x) => x.id === l.id) ?? l;
  const toggle = (lineId: string) =>
    !done && setPicked((p) => (p.includes(lineId) ? p.filter((x) => x !== lineId) : [...p, lineId]));

  const book = () =>
    start(async () => {
      setError("");
      const res = await bookPicks(id, picked);
      if (res.ok) setDone({ total: res.total, pct: res.pct, sent: res.sent });
      else setError(res.error);
    });

  return (
    <div className="min-h-screen bg-retro-paper pb-40 text-[#0C1215]">
      <header className="container-site flex items-center justify-between py-4 md:py-5">
        <a href="/" aria-label="Rinse It Off home"><img src="/logo-dark.png" alt="Rinse It Off" width={706} height={438} className="h-11 w-auto md:h-12" /></a>
        <span className="label-caps text-[#1A6E93]">Your quote</span>
      </header>

      <section className="bg-stars pb-10 md:pb-14">
        <div className="container-site max-w-3xl pt-4 md:pt-8">
          {street && <p className="label-caps text-[#1A6E93]">{street}</p>}
          <h1 className="mt-3 text-display-lg md:text-[3rem]">{done ? `You're set${first ? `, ${first}` : ""}.` : `Pick what you want${first ? `, ${first}` : ""}.`}</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#3B4247]">
            {done
              ? done.sent
                ? "We just texted and emailed you the estimate for these services. Accept it there and pay the 50% deposit, and we'll get you on the schedule."
                : "We have your picks. We'll text you the estimate shortly to accept and pay the 50% deposit."
              : `Everything we'd do at your place is checked. Uncheck anything you don't want.${r.tiers.length ? " Bigger visits get more off the total." : ""}`}
          </p>
        </div>
      </section>
      <StripeBand />

      <main className="container-site max-w-3xl py-10 md:py-14">
        {!done && r.tiers.length > 0 && (
          <ol className="mb-8 grid gap-2 sm:grid-cols-3" aria-label="Bundle discounts">
            {r.tiers.map((t) => (
              <li
                key={t.pct}
                className={`rounded-[14px] border-[1.5px] px-4 py-3 text-sm ${r.pct === t.pct ? "border-[#0C1215] bg-[#F2B632] font-semibold" : "border-[#0C1215]/20 bg-white"}`}
              >
                <span className="block font-title text-2xl leading-none">{t.pct}% off</span>
                <span className="mt-1 block">{t.label}</span>
              </li>
            ))}
          </ol>
        )}

        <ul className="space-y-3">
          {lines.map((l) => {
            const on = picked.includes(l.id);
            if (done && !on) return null;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  disabled={!!done}
                  onClick={() => toggle(l.id)}
                  className={`flex w-full min-h-16 items-center gap-4 rounded-[14px] border-[1.5px] bg-white px-4 py-4 text-left transition-colors motion-reduce:transition-none ${on ? "border-[#0C1215]" : "border-[#0C1215]/20 opacity-70"} ${done ? "cursor-default" : "hover:border-[#0C1215]"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border-[1.5px] border-[#0C1215] ${on ? "bg-[#62C4EB]" : "bg-white"}`}>
                    {on && <Check className="h-4 w-4" aria-hidden />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{shown(l).category}</span>
                    <span className="block text-sm text-[#3B4247]">{l.name}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{money(shown(l).price)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-[#3B4247]">
          Questions or want something changed? <a href={TEXT_US} className="font-semibold underline">Text us at (971) 626-4146</a>.
        </p>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-[1.5px] border-[#0C1215] bg-white">
        <div className="container-site flex max-w-3xl flex-wrap items-center justify-between gap-3 py-4">
          <div className="text-sm leading-tight" aria-live="polite">
            {r.pct > 0 && <span className="block text-[#3B4247]"><s>{money(r.subtotal)}</s> · {r.pct}% off saves {money(r.discount)}</span>}
            {r.minimumAdd > 0 && <span className="block text-[#3B4247]">Includes our {money(r.total)} visit minimum</span>}
            <span className="block font-title text-2xl">{money(done ? done.total : r.total)}</span>
            {!done && r.next && <span className="block text-[#1A6E93]">{r.next.need} for {r.next.pct}% off</span>}
          </div>
          {done ? (
            <span className="inline-flex items-center gap-2 font-semibold"><Check className="h-5 w-5" aria-hidden /> Booked</span>
          ) : (
            <button
              type="button"
              onClick={book}
              disabled={pending || !r.lines.length}
              className="inline-flex min-h-12 items-center gap-2 rounded-[14px] border-2 border-[#0C1215] bg-[#F2B632] px-5 py-3 text-sm font-bold uppercase tracking-[.06em] disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {r.lines.length ? `Book ${r.lines.length === 1 ? "this service" : `these ${r.lines.length}`}` : "Pick a service"}
            </button>
          )}
          {error && <p className="w-full text-sm font-semibold text-[#B3341C]" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}
