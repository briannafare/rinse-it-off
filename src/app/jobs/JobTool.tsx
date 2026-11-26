"use client";

/** The crew's side of job reports: pick the client, shoot before / during / after, let the AI write
 *  what we did, add a note, send the link. Every change saves to the report in Blob, so Alstun can
 *  take the before photos and Bri can finish it from her phone. */

import { upload } from "@vercel/blob/client";
import { ArrowLeft, Camera, Check, ExternalLink, ImagePlus, Loader2, Plus, Search, Send, Sparkles, Star, Video, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchGhlContacts } from "@/app/quote/actions";
import type { GhlContactMatch } from "@/lib/quote/types";
import { firstName, SERVICES, sliderPair, STAGES, WORKERS, type JobMedia, type JobReport, type Stage } from "@/lib/jobs/types";
import { balancesForJob, billBalance, listReports, loadReport, newReport, saveReport, sendReport, writeRemarks, type BalanceOption } from "./actions";

const inputCls =
  "min-h-11 w-full rounded-xl border border-retro-line bg-white px-4 py-3 text-[15px] text-[#26211B] placeholder:text-[#8A8072] focus:border-[#2F6B66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66]";
const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] btn-print bg-[#F2B632] px-5 py-3 text-[#0C1215] disabled:cursor-not-allowed disabled:opacity-50";
const btnOutline =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-retro-line bg-white px-4 py-2.5 text-sm font-semibold text-[#26211B] hover:border-[#2F6B66] disabled:opacity-50";
const cardCls = "rounded-2xl border border-retro-line bg-white p-5";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#4A4238]";
const STAGE_COPY: Record<Stage, { title: string; hint: string }> = {
  before: { title: "Before", hint: "Before anything gets wet. Stand where you can stand again for the after." },
  during: { title: "During", hint: "Mid-job: the clean line, the surface cleaner going, the gunk coming off." },
  after: { title: "After", hint: "Same spots as the befores, same angle. These are what the client looks at first." },
};

type Row = Awaited<ReturnType<typeof listReports>>[number];
type Pending = { key: string; stage: Stage; preview: string; pct: number; error?: string };

// ── media prep: photos shrink to 2400px JPEG (fast on the client's phone, under the AI's size limit) ──
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((ok, bad) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => bad(new Error(`Couldn't read ${file.name}`));
    img.src = URL.createObjectURL(file);
  });
}
async function shrinkPhoto(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  const img = await loadImage(file);
  const s = Math.min(2400 / img.naturalWidth, 2400 / img.naturalHeight, 1);
  const c = document.createElement("canvas");
  c.width = Math.round(img.naturalWidth * s);
  c.height = Math.round(img.naturalHeight * s);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(img.src);
  const blob = await new Promise<Blob>((ok, bad) => c.toBlob((b) => (b ? ok(b) : bad(new Error("Couldn't compress"))), "image/jpeg", 0.85));
  return { blob, w: c.width, h: c.height };
}
/** One still from early in the clip (the poster), plus the clip's shape. Fails soft: some desktop browsers can't decode iPhone video. */
async function videoStill(file: File): Promise<{ blob?: Blob; w: number; h: number }> {
  const v = document.createElement("video");
  v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = URL.createObjectURL(file);
  try {
    await new Promise((ok, bad) => { v.onloadeddata = ok; v.onerror = bad; setTimeout(bad, 15000); });
    v.currentTime = Math.min(1, (v.duration || 2) * 0.1);
    await new Promise((ok) => (v.onseeked = ok));
    const s = Math.min(1600 / v.videoWidth, 1600 / v.videoHeight, 1);
    const c = document.createElement("canvas");
    c.width = Math.round(v.videoWidth * s); c.height = Math.round(v.videoHeight * s);
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | undefined>((ok) => c.toBlob((b) => ok(b ?? undefined), "image/jpeg", 0.82));
    return { blob, w: v.videoWidth, h: v.videoHeight };
  } catch {
    return { w: 1080, h: 1920 };
  } finally {
    URL.revokeObjectURL(v.src);
  }
}

const niceDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export default function JobTool() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [r, setR] = useState<JobReport | null>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState<"saved" | "saving" | "error">("saved");
  const [pending, setPending] = useState<Pending[]>([]);
  const [sentInfo, setSentInfo] = useState<{ url: string; sent: string[]; problems: string[] } | null>(null);
  const dirty = useRef(false);

  const refresh = useCallback(() => { listReports().then(setRows); }, []);
  useEffect(refresh, [refresh]);

  // Remember which job is open, so a reload or a locked phone comes back to it.
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    if (id) loadReport(id).then((x) => x && setR(x));
  }, []);
  const open = (x: JobReport | null) => {
    setR(x); setErr(""); setSentInfo(null); dirty.current = false;
    history.replaceState(null, "", x ? `/jobs?id=${x.id}` : "/jobs");
    if (!x) refresh();
    window.scrollTo(0, 0);
  };

  // Autosave: every edit marks the report dirty; 700 ms after the last one it goes to Blob.
  const edit = (fn: (x: JobReport) => JobReport) => { dirty.current = true; setR((x) => (x ? fn(x) : x)); };
  useEffect(() => {
    if (!r || !dirty.current) return;
    setSaved("saving");
    const t = setTimeout(async () => {
      dirty.current = false;
      const res = await saveReport(r).catch(() => ({ ok: false }));
      setSaved(res.ok ? "saved" : "error");
    }, 700);
    return () => clearTimeout(t);
  }, [r]);

  async function start() {
    setBusy("new");
    const res = await newReport();
    setBusy("");
    if (res.ok) open(res.report); else setErr(res.error);
  }

  async function addFiles(stage: Stage, files: FileList | null) {
    if (!r || !files?.length) return;
    const id = r.id;
    await Promise.all(Array.from(files).map(async (file, i) => {
      const key = `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`;
      const isVideo = file.type.startsWith("video/");
      const preview = isVideo ? "" : URL.createObjectURL(file);
      setPending((p) => [...p, { key, stage, preview, pct: 0 }]);
      const progress = (pct: number) => setPending((p) => p.map((x) => (x.key === key ? { ...x, pct } : x)));
      try {
        let media: JobMedia;
        const base = `job-reports/${id}/${stage}/${key}`;
        if (isVideo) {
          const still = await videoStill(file);
          const ext = (file.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
          const up = await upload(`${base}.${ext}`, file, {
            access: "public", handleUploadUrl: "/api/quote/upload", multipart: file.size > 50e6, contentType: file.type,
            onUploadProgress: (e) => progress(e.percentage),
          });
          const poster = still.blob
            ? (await upload(`${base}-poster.jpg`, still.blob, { access: "public", handleUploadUrl: "/api/quote/upload", contentType: "image/jpeg" })).url
            : undefined;
          media = { url: up.url, kind: "video", w: still.w, h: still.h, poster };
        } else {
          const { blob, w, h } = await shrinkPhoto(file);
          const up = await upload(`${base}.jpg`, blob, {
            access: "public", handleUploadUrl: "/api/quote/upload", contentType: "image/jpeg", onUploadProgress: (e) => progress(e.percentage),
          });
          media = { url: up.url, kind: "image", w, h };
        }
        edit((x) => ({ ...x, media: { ...x.media, [stage]: [...x.media[stage], media] } }));
        setPending((p) => p.filter((x) => x.key !== key));
        if (preview) URL.revokeObjectURL(preview);
      } catch (e) {
        setPending((p) => p.map((x) => (x.key === key ? { ...x, error: e instanceof Error ? e.message : "Upload failed" } : x)));
      }
    }));
  }

  async function aiWrite() {
    if (!r) return;
    setBusy("ai"); setErr("");
    await saveReport(r); // the AI reads the saved report, so the newest photos have to be in it
    const res = await writeRemarks(r.id);
    setBusy("");
    if (res.ok) edit((x) => ({ ...x, remarks: res.remarks })); else setErr(res.error);
  }

  async function send() {
    if (!r) return;
    if (!confirm(`Send the job report to ${r.client.name || "the client"} now?`)) return;
    setBusy("send"); setErr("");
    await saveReport(r);
    const res = await sendReport(r.id);
    setBusy("");
    if (!res.ok) { setErr(res.error); return; }
    setSentInfo(res);
    const fresh = await loadReport(r.id);
    if (fresh) { dirty.current = false; setR(fresh); }
  }

  // ── list of jobs ──
  if (!r) {
    return (
      <div className="min-h-screen bg-retro-paper font-body text-[#0C1215]">
        <header className="border-b border-retro-line bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
            <div>
              <p className="label-caps text-[#1A6E93]">Rinse It Off crew</p>
              <h1 className="font-title text-2xl">Job reports</h1>
            </div>
            <a href="/quote" className="text-sm font-semibold text-[#1A6E93]">Quote tool</a>
          </div>
        </header>
        <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
          <button onClick={start} disabled={busy === "new"} className={`${btnPrimary} w-full`}>
            {busy === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Start a job report
          </button>
          {err && <p className="text-sm font-medium text-[#DC4B2A]">{err}</p>}
          {rows === null ? (
            <p className="flex items-center gap-2 text-sm text-[#5F676C]"><Loader2 className="h-4 w-4 animate-spin" /> Loading jobs</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-[#5F676C]">No job reports yet. Start one when you pull up to the next job.</p>
          ) : (
            <ul className="space-y-2">
              {rows.map((x) => (
                <li key={x.id}>
                  <button onClick={() => loadReport(x.id).then((y) => y && open(y))} className={`${cardCls} flex w-full items-center gap-3 text-left hover:border-[#2F6B66]`}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{x.name || "No client yet"}</p>
                      <p className="truncate text-sm text-[#5F676C]">{[niceDate(x.date), x.address, `${x.photos} photos`, x.lead].filter(Boolean).join(" · ")}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${x.status === "sent" ? "bg-[#E3ECE6] text-[#2F6B66]" : "bg-[#FCEBC0] text-[#7A5A00]"}`}>
                      {x.status === "sent" ? "Sent" : "Draft"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    );
  }

  // ── one job ──
  const pair = sliderPair(r);
  const first = firstName(r.client.name);
  const uploading = pending.some((p) => !p.error);
  const canSend = !!(r.client.phone || r.client.email) && r.media.after.length > 0 && !uploading;

  return (
    <div className="min-h-screen bg-retro-paper pb-32 font-body text-[#0C1215]">
      <header className="sticky top-0 z-20 border-b border-retro-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => open(null)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> All jobs</button>
          <span className="flex-1" />
          <span className="text-xs text-[#5F676C]">{saved === "saving" ? "Saving…" : saved === "error" ? "Not saved, check signal" : "Saved"}</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "sent" ? "bg-[#E3ECE6] text-[#2F6B66]" : "bg-[#FCEBC0] text-[#7A5A00]"}`}>{r.status === "sent" ? "Sent" : "Draft"}</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        <ClientCard r={r} edit={edit} />

        <section className={cardCls}>
          <h2 className="font-display text-lg font-semibold">The job</h2>
          <label className={`${labelCls} mt-4`}>Lead on this job</label>
          <div className="grid grid-cols-2 gap-2">
            {WORKERS.map((w) => (
              <button key={w.name} onClick={() => edit((x) => ({ ...x, lead: w.name }))}
                className={`min-h-11 rounded-xl border-2 text-sm font-semibold ${r.lead === w.name ? "border-[#0C1215] bg-[#F2B632]" : "border-retro-line bg-white"}`}>
                {w.name}
              </button>
            ))}
          </div>
          <label className={`${labelCls} mt-4`}>What we cleaned</label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const on = r.services.includes(s);
              return (
                <button key={s} onClick={() => edit((x) => ({ ...x, services: on ? x.services.filter((y) => y !== s) : [...x.services, s] }))}
                  className={`min-h-10 rounded-full border px-3.5 text-sm font-medium ${on ? "border-[#0C1215] bg-[#0C1215] text-white" : "border-retro-line bg-white"}`}>
                  {on && <Check className="-ml-0.5 mr-1 inline h-3.5 w-3.5" />}{s}
                </button>
              );
            })}
          </div>
          <label className={`${labelCls} mt-4`} htmlFor="j-date">Job date</label>
          <input id="j-date" type="date" className={inputCls} value={r.date} onChange={(e) => edit((x) => ({ ...x, date: e.target.value }))} />
        </section>

        {STAGES.map((stage) => (
          <section key={stage} className={cardCls}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">{STAGE_COPY[stage].title}</h2>
              <span className="text-xs text-[#5F676C]">{r.media[stage].length} added</span>
            </div>
            <p className="mt-1 text-sm text-[#5F676C]">{STAGE_COPY[stage].hint}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Picker label="Photo" icon={<Camera className="h-5 w-5" />} accept="image/*" capture onFiles={(f) => addFiles(stage, f)} />
              <Picker label="Video" icon={<Video className="h-5 w-5" />} accept="video/*" capture onFiles={(f) => addFiles(stage, f)} />
              <Picker label="From phone" icon={<ImagePlus className="h-5 w-5" />} accept="image/*,video/*" multiple onFiles={(f) => addFiles(stage, f)} />
            </div>
            {(r.media[stage].length > 0 || pending.some((p) => p.stage === stage)) && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {r.media[stage].map((m) => {
                  const inSlider = (stage === "before" || stage === "after") && m.kind === "image" && pair?.[stage].url === m.url;
                  return (
                    <div key={m.url} className="relative aspect-square overflow-hidden rounded-xl border border-retro-line bg-[#F3EDE2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.kind === "image" ? m.url : m.poster || ""} alt="" className="h-full w-full object-cover" />
                      {m.kind === "video" && <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">Video</span>}
                      <button aria-label="Remove" onClick={() => edit((x) => ({ ...x, media: { ...x.media, [stage]: x.media[stage].filter((y) => y.url !== m.url) } }))}
                        className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white"><X className="h-4 w-4" /></button>
                      {(stage === "before" || stage === "after") && m.kind === "image" && (
                        <button aria-label="Use in the before and after slider" onClick={() => edit((x) => ({ ...x, pair: { ...x.pair, [stage]: m.url } }))}
                          className={`absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full ${inSlider ? "bg-[#F2B632] text-[#0C1215]" : "bg-black/50 text-white"}`}>
                          <Star className="h-4 w-4" fill={inSlider ? "currentColor" : "none"} />
                        </button>
                      )}
                    </div>
                  );
                })}
                {pending.filter((p) => p.stage === stage).map((p) => (
                  <div key={p.key} className="relative grid aspect-square place-items-center overflow-hidden rounded-xl border border-retro-line bg-[#F3EDE2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.preview && <img src={p.preview} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />}
                    <span className="relative rounded-md bg-white/90 px-2 py-1 text-xs font-semibold">
                      {p.error ? "Failed" : `${Math.round(p.pct)}%`}
                    </span>
                    {p.error && (
                      <button className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white" aria-label="Dismiss"
                        onClick={() => setPending((x) => x.filter((y) => y.key !== p.key))}><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {(stage === "before" || stage === "after") && r.media[stage].some((m) => m.kind === "image") && (
              <p className="mt-2 text-xs text-[#5F676C]"><Star className="mr-1 inline h-3 w-3" fill="#F2B632" />The starred {stage} photo goes in the slider at the top of the client&apos;s page.</p>
            )}
          </section>
        ))}

        <section className={cardCls}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">What we did</h2>
            {r.remarks && <button onClick={aiWrite} disabled={busy === "ai"} className="text-sm font-semibold text-[#1A6E93]">Write it again</button>}
          </div>
          <p className="mt-1 text-sm text-[#5F676C]">The AI looks at the photos and writes a few plain lines. Change anything you like.</p>
          {!r.remarks || busy === "ai" ? (
            <button onClick={aiWrite} disabled={busy === "ai" || !(r.media.before.length + r.media.after.length)} className={`${btnOutline} mt-3 w-full`}>
              {busy === "ai" ? <><Loader2 className="h-4 w-4 animate-spin" /> Looking at the photos…</> : <><Sparkles className="h-4 w-4" /> Write it from the photos</>}
            </button>
          ) : (
            <div className="mt-3 space-y-3">
              <label className={labelCls} htmlFor="j-sum">Summary</label>
              <textarea id="j-sum" rows={3} className={inputCls} value={r.remarks.summary}
                onChange={(e) => edit((x) => ({ ...x, remarks: { ...x.remarks!, summary: e.target.value } }))} />
              {r.remarks.items.map((it, i) => (
                <div key={i} className="rounded-xl border border-retro-line p-3">
                  <div className="flex gap-2">
                    <input className={`${inputCls} font-semibold`} value={it.area} aria-label="Area"
                      onChange={(e) => edit((x) => ({ ...x, remarks: { ...x.remarks!, items: x.remarks!.items.map((y, j) => (j === i ? { ...y, area: e.target.value } : y)) } }))} />
                    <button aria-label="Remove line" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-retro-line"
                      onClick={() => edit((x) => ({ ...x, remarks: { ...x.remarks!, items: x.remarks!.items.filter((_, j) => j !== i) } }))}><X className="h-4 w-4" /></button>
                  </div>
                  <textarea rows={2} className={`${inputCls} mt-2`} value={it.did} aria-label="What we did"
                    onChange={(e) => edit((x) => ({ ...x, remarks: { ...x.remarks!, items: x.remarks!.items.map((y, j) => (j === i ? { ...y, did: e.target.value } : y)) } }))} />
                </div>
              ))}
              <button onClick={() => edit((x) => ({ ...x, remarks: { ...x.remarks!, items: [...x.remarks!.items, { area: "", did: "" }] } }))} className={btnOutline}>
                <Plus className="h-4 w-4" /> Add a line
              </button>
            </div>
          )}
        </section>

        <section className={cardCls}>
          <h2 className="font-display text-lg font-semibold">A note from {r.lead} <span className="text-sm font-normal text-[#5F676C]">(optional)</span></h2>
          <p className="mt-1 text-sm text-[#5F676C]">Anything you&apos;d say at the door: something you noticed, a tip, a thank you. It shows with your name.</p>
          <textarea rows={4} className={`${inputCls} mt-3`} placeholder="The moss on the north side will come back first. Worth a look next fall."
            value={r.note} onChange={(e) => edit((x) => ({ ...x, note: e.target.value }))} />
        </section>

        <BalanceCard r={r} save={() => saveReport(r)} />

        {err &&<p className="rounded-xl bg-[#FDE8E2] px-4 py-3 text-sm font-medium text-[#B23A1E]">{err}</p>}
        {sentInfo && (
          <div className="rounded-xl bg-[#E3ECE6] px-4 py-3 text-sm text-[#1F4D49]">
            <p className="font-semibold">Sent to {first} by {sentInfo.sent.join(" and ")}.</p>
            {sentInfo.problems.map((p) => <p key={p}>{p}</p>)}
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-retro-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2 px-4 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <a href={`/done/${r.id}`} target="_blank" rel="noopener" className={`${btnOutline} min-h-12`}><ExternalLink className="h-4 w-4" /> Preview</a>
          <button onClick={send} disabled={!canSend || busy === "send"} className={`${btnPrimary} flex-1`}>
            {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {r.status === "sent" ? "Send again" : `Send to ${r.client.name ? first : "client"}`}
          </button>
        </div>
        {!canSend && (
          <p className="mx-auto max-w-2xl px-4 pb-3 text-xs text-[#5F676C]">
            {uploading ? "Wait for the uploads to finish." : !(r.client.phone || r.client.email) ? "Add the client's mobile or email to send." : "Add at least one after photo to send."}
          </p>
        )}
      </div>
    </div>
  );
}

/** The other half of a deposit invoice goes out from here and nowhere else (Bri 2026-11-21: "only sends
 *  when the crew lead specifies the job is complete"). The lead picks this client's balance and taps once. */
function BalanceCard({ r, save }: { r: JobReport; save: () => Promise<unknown> }) {
  const [rows, setRows] = useState<BalanceOption[] | null>(null);
  const [pick, setPick] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const load = useCallback(() => {
    balancesForJob(r.id).then((x) => {
      setRows(x);
      const mine = x.filter((b) => b.thisClient && !b.billed);
      if (mine.length === 1) setPick(mine[0].id);
    });
  }, [r.id]);
  useEffect(load, [load, r.client.contactId]);

  const done = rows?.find((b) => b.billed); // only this job's own billed balance comes back billed
  const open = (rows ?? []).filter((b) => !b.billed);
  const chosen = open.find((b) => b.id === pick);
  const money = (n: number) => `$${n.toFixed(2)}`;

  async function bill() {
    if (!chosen) return;
    if (!confirm(`The job's done and ${r.lead} is the lead. Send ${chosen.name} the ${money(chosen.balance)} balance invoice now?`)) return;
    setBusy(true); setMsg(null);
    await save(); // billBalance reads the lead from the saved report
    const res = await billBalance(r.id, chosen.id).catch(() => ({ ok: false as const, error: "Couldn't reach the server. Try again." }));
    setBusy(false);
    if (!res.ok) { setMsg({ ok: false, text: res.error }); return; }
    setMsg({ ok: res.sent, text: res.sent ? `Balance invoice for ${money(res.amount)} sent.` : res.problem || "The invoice is in GHL but didn't send." });
    load();
  }

  return (
    <section className={cardCls}>
      <h2 className="font-display text-lg font-semibold">Job done? Bill the balance</h2>
      {rows === null ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-[#5F676C]"><Loader2 className="h-4 w-4 animate-spin" /> Looking for the balance</p>
      ) : done ? (
        <p className="mt-2 text-sm text-[#2F6B66]"><Check className="mr-1 inline h-4 w-4" />{money(done.balance)} balance billed to {done.name}{done.billed?.by ? ` by ${done.billed.by}` : ""}.</p>
      ) : !open.length ? (
        <p className="mt-1 text-sm text-[#5F676C]">No balance is waiting. Only quotes sent as a deposit invoice leave one here.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-[#5F676C]">The client only gets the second invoice when the lead taps this, once the work is finished. Nothing goes out on the job date by itself.</p>
          <div className="mt-3 space-y-2">
            {open.map((b) => (
              <button key={b.id} onClick={() => setPick(b.id === pick ? "" : b.id)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left text-sm ${pick === b.id ? "border-[#0C1215] bg-[#FCEBC0]" : "border-retro-line bg-white"}`}>
                <span className="flex-1">
                  <span className="font-semibold">{b.name}</span>{b.thisClient && <span className="ml-2 rounded-full bg-[#E3ECE6] px-2 py-0.5 text-xs text-[#2F6B66]">this client</span>}
                  <span className="block text-xs text-[#5F676C]">{[b.address, `job ${niceDate(b.jobDate)}`, `${money(b.total)} total`].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="font-semibold">{money(b.balance)}</span>
              </button>
            ))}
          </div>
          <button onClick={bill} disabled={!chosen || busy} className={`${btnPrimary} mt-3 w-full`}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {chosen ? `Job's done: bill ${money(chosen.balance)}` : "Pick the balance for this job"}
          </button>
        </>
      )}
      {msg && <p className={`mt-2 text-sm font-medium ${msg.ok ? "text-[#2F6B66]" : "text-[#B23A1E]"}`}>{msg.text}</p>}
    </section>
  );
}

function Picker({ label, icon, accept, capture, multiple, onFiles }: { label: string; icon: React.ReactNode; accept: string; capture?: boolean; multiple?: boolean; onFiles: (f: FileList | null) => void }) {
  return (
    <label className="flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-retro-line bg-[#FBF8F2] text-xs font-semibold text-[#26211B] hover:border-[#2F6B66]">
      {icon}{label}
      <input type="file" className="sr-only" accept={accept} multiple={multiple} {...(capture ? { capture: "environment" } : {})}
        onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
    </label>
  );
}

function ClientCard({ r, edit }: { r: JobReport; edit: (fn: (x: JobReport) => JobReport) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<GhlContactMatch[]>([]);
  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const t = setTimeout(() => searchGhlContacts(q).then((res) => setHits(res.contacts)), 300);
    return () => clearTimeout(t);
  }, [q]);
  const set = (k: keyof JobReport["client"]) => (e: React.ChangeEvent<HTMLInputElement>) => edit((x) => ({ ...x, client: { ...x.client, [k]: e.target.value } }));
  return (
    <section className={cardCls}>
      <h2 className="font-display text-lg font-semibold">Client</h2>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8072]" />
        <input className={`${inputCls} pl-9`} placeholder="Find them in GHL: name, phone or email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {hits.length > 0 && (
        <ul className="mt-2 divide-y divide-retro-line overflow-hidden rounded-xl border border-retro-line">
          {hits.map((c) => (
            <li key={c.id}>
              <button className="w-full px-4 py-3 text-left hover:bg-[#FBF8F2]" onClick={() => {
                edit((x) => ({ ...x, client: { contactId: c.id, name: c.name, phone: c.phone, email: c.email, address: [c.address, c.city, c.state].filter(Boolean).join(", ") } }));
                setQ(""); setHits([]);
              }}>
                <p className="font-semibold">{c.name || "(no name)"}</p>
                <p className="text-sm text-[#5F676C]">{[c.phone, c.email, c.address].filter(Boolean).join(" · ")}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 grid gap-3">
        <input className={inputCls} placeholder="Name" value={r.client.name} onChange={set("name")} autoComplete="off" />
        <input className={inputCls} placeholder="Mobile" type="tel" value={r.client.phone} onChange={set("phone")} autoComplete="off" />
        <input className={inputCls} placeholder="Email" type="email" value={r.client.email} onChange={set("email")} autoComplete="off" />
        <input className={inputCls} placeholder="Street, city" value={r.client.address} onChange={set("address")} autoComplete="off" />
      </div>
      {r.client.contactId && <p className="mt-2 text-xs text-[#2F6B66]"><Check className="mr-1 inline h-3 w-3" />Linked to their GHL contact</p>}
    </section>
  );
}
