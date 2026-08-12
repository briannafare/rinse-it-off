"use client";

/** Audit Tool v2 — internal AI photo-audit quoting wizard.
 *  5 steps: Property -> Photos -> Analysis -> Quote -> Send.
 *  Mobile-first (Kenn runs this from a phone in driveways): 44px targets,
 *  light canvas, ink text, single water-blue accent, soft rectangles, no emoji.
 *  Draft persists to localStorage; GHL is the system of record after send. */

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Camera,
  Check,
  ChevronLeft,
  FileText,
  Images,
  Loader2,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { searchGhlContacts, sendQuoteToGhl } from "./actions";
import { buildClientQuoteHTML, buildInternalJobSheetHTML } from "@/lib/quote/print-templates";
import {
  makeQuoteNumber,
  type AnalyzeResponse,
  type ContactInfo,
  type GhlContactMatch,
  type PropertyType,
  type QuoteLineItem,
  type QuotePhoto,
  type SendToGhlResult,
} from "@/lib/quote/types";

// ── Draft persistence ─────────────────────────────────────────────────────────
const DRAFT_KEY = "rio-quote-draft-v2";

interface Draft {
  version: 2;
  savedAt: number;
  step: number;
  quoteNumber: string;
  propertyType: PropertyType;
  contact: ContactInfo;
  notes: string;
  photos: QuotePhoto[];
  analysis: AnalyzeResponse | null;
  lineItems: QuoteLineItem[];
  discountPct: number;
  discountReason: string;
}

function emptyDraft(): Draft {
  return {
    version: 2,
    savedAt: 0,
    step: 1,
    quoteNumber: "",
    propertyType: "residential",
    contact: { name: "", email: "", phone: "", address: "" },
    notes: "",
    photos: [],
    analysis: null,
    lineItems: [],
    discountPct: 0,
    discountReason: "",
  };
}

// ── Style constants (brand: light canvas, ink, one blue) ─────────────────────
const inputCls =
  "min-h-11 w-full rounded-xl border border-[#E4ECF1] bg-white px-4 py-3 text-sm text-[#0C1215] placeholder:text-[#8899A6] focus:border-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#62C4EB] px-5 py-3 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none";
const btnOutline =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E4ECF1] bg-white px-5 py-3 text-sm font-semibold text-[#0C1215] transition-colors hover:border-[#62C4EB] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none";
const cardCls = "rounded-2xl border border-[#EFF4F7] bg-white p-5 shadow-soft sm:p-6";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#4B5C6B]";

const STEPS = ["Property", "Photos", "Analysis", "Quote", "Send"];

const PROPERTY_TYPES: Array<{ value: PropertyType; label: string }> = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "multifamily", label: "Multifamily" },
  { value: "hoa", label: "HOA" },
];

function money(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function scoreColor(s: number): string {
  return s <= 3 ? "#3AA8D4" : s <= 6 ? "#D97706" : "#DC4B2A";
}

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  return `li-${Date.now().toString(36)}-${idCounter}`;
}

// ── Photo compression (ported from the v1 teardown: max 1200px, JPEG q0.72) ──
function compressImage(file: File): Promise<{ dataUrl: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const MAX_DIM = 1200;
    const QUALITY = 0.72;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const scale = Math.min(MAX_DIM / width, MAX_DIM / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      // Always re-encode to JPEG so HEIC and oversized files normalize.
      const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
      resolve({ dataUrl, mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}`));
    };
    img.src = url;
  });
}

// ── Print helper (window.open + document.write + print, per v1) ──────────────
function printHTML(html: string) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked — allow popups for this site to export PDFs.");
    return;
  }
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 900);
}

// ═════════════════════════════════════════════════════════════════════════════
export default function QuoteWizard() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [resumeAvailable, setResumeAvailable] = useState<Draft | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Photo upload state
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Contact search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GhlContactMatch[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  // Send state
  const [sendResult, setSendResult] = useState<SendToGhlResult | null>(null);
  const [sending, startSend] = useTransition();

  // ── Mount: assign quote number, offer draft resume ─────────────────────────
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Draft;
        if (saved?.version === 2 && saved.savedAt) setResumeAvailable(saved);
      }
    } catch {
      /* corrupted draft — ignore */
    }
    setDraft((d) => (d.quoteNumber ? d : { ...d, quoteNumber: makeQuoteNumber() }));
  }, []);

  // ── Persist draft on change (photos included; fall back without on quota) ──
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      const toSave: Draft = { ...draft, savedAt: Date.now() };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      } catch {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...toSave, photos: [] }));
        } catch {
          /* storage unavailable */
        }
      }
    }, 400);
    return () => clearTimeout(t);
  }, [draft, hydrated]);

  const patch = useCallback((p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p })), []);
  const patchContact = useCallback(
    (p: Partial<ContactInfo>) => setDraft((d) => ({ ...d, contact: { ...d.contact, ...p } })),
    [],
  );

  const startFresh = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setResumeAvailable(null);
    setSendResult(null);
    setAnalyzeError(null);
    setDraft({ ...emptyDraft(), quoteNumber: makeQuoteNumber() });
  }, []);

  // ── Totals ─────────────────────────────────────────────────────────────────
  const pricedItems = draft.lineItems.filter((i) => i.category !== "Pricing Note");
  const subtotal = pricedItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const discountAmt = draft.discountPct > 0 ? subtotal * (draft.discountPct / 100) : 0;
  const total = subtotal - discountAmt;
  const pricingNoteItem = draft.lineItems.find((i) => i.category === "Pricing Note");

  // ── Photos ─────────────────────────────────────────────────────────────────
  const addPhotos = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setPhotoError(null);
    try {
      const list = Array.from(files);
      const compressed = await Promise.all(list.map((f) => compressImage(f)));
      setDraft((d) => ({
        ...d,
        photos: [
          ...d.photos,
          ...compressed.map((c, i) => ({
            id: newId(),
            name: list[i].name,
            dataUrl: c.dataUrl,
            mediaType: c.mediaType,
          })),
        ],
      }));
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : "Could not process photos.");
    } finally {
      setUploading(false);
      if (cameraRef.current) cameraRef.current.value = "";
      if (galleryRef.current) galleryRef.current.value = "";
    }
  }, []);

  const removePhoto = useCallback((id: string) => {
    setDraft((d) => ({ ...d, photos: d.photos.filter((p) => p.id !== id) }));
  }, []);

  // ── Contact search ─────────────────────────────────────────────────────────
  const runSearch = useCallback(async () => {
    if (searchQuery.trim().length < 2) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await searchGhlContacts(searchQuery.trim());
      if (res.ok) setSearchResults(res.contacts);
      else {
        setSearchResults([]);
        setSearchError(res.error || "Search failed");
      }
    } catch {
      setSearchError("Search failed — try again.");
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  // ── Analysis ───────────────────────────────────────────────────────────────
  const runAnalysis = useCallback(async () => {
    if (!draft.photos.length) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await fetch("/api/quote/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: draft.photos.map((p) => ({
            data: p.dataUrl.replace(/^data:[^;]+;base64,/, ""),
            mediaType: p.mediaType,
          })),
          propertyType: draft.propertyType,
          address: draft.contact.address,
          contactName: draft.contact.name,
          notes: draft.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnalyzeError(
          data?.message ||
            (data?.error === "NO_API_KEY"
              ? "The Anthropic API key is missing on the server."
              : "Analysis failed — try again."),
        );
        return;
      }
      patch({ analysis: data as AnalyzeResponse });
    } catch {
      setAnalyzeError("Analysis failed — check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  }, [draft.photos, draft.propertyType, draft.contact.address, draft.contact.name, draft.notes, patch]);

  const seedLineItems = useCallback(() => {
    if (!draft.analysis) return;
    const items: QuoteLineItem[] = draft.analysis.recommendedServices.map((s) => ({
      id: newId(),
      category: s.category,
      description: s.description,
      qty: 1,
      unitPrice: s.estimatedPrice,
      isAddon: !!s.isAddon,
      addonFor: s.addonFor ?? null,
    }));
    setDraft((d) => ({ ...d, lineItems: items, step: 4 }));
  }, [draft.analysis]);

  // ── Line item editing ──────────────────────────────────────────────────────
  const updateItem = useCallback((id: string, p: Partial<QuoteLineItem>) => {
    setDraft((d) => ({
      ...d,
      lineItems: d.lineItems.map((i) => (i.id === id ? { ...i, ...p } : i)),
    }));
  }, []);
  const removeItem = useCallback((id: string) => {
    setDraft((d) => ({ ...d, lineItems: d.lineItems.filter((i) => i.id !== id) }));
  }, []);
  const addCustomItem = useCallback(() => {
    setDraft((d) => ({
      ...d,
      lineItems: [
        ...d.lineItems,
        { id: newId(), category: "Other", description: "Custom service", qty: 1, unitPrice: 0, isAddon: false, addonFor: null },
      ],
    }));
  }, []);

  // ── Print exports ──────────────────────────────────────────────────────────
  const printInput = useCallback(() => {
    const a = draft.analysis;
    return {
      quoteNumber: draft.quoteNumber || makeQuoteNumber(),
      propertyAddress: draft.contact.address || "Property",
      contactName: draft.contact.name,
      contactEmail: draft.contact.email,
      contactPhone: draft.contact.phone,
      assessment: {
        conditionScore: a?.assessment.conditionScore ?? 5,
        summaryText: a?.assessment.summaryText ?? "",
      },
      findings: a?.assessment.findings ?? [],
      lineItems: draft.lineItems,
      subtotal,
      discountPct: draft.discountPct,
      discountLabel: draft.discountReason || "Discount",
      discountAmt,
      total,
      photoUrls: draft.photos.map((p) => p.dataUrl),
      logoUrl: `${window.location.origin}/logo-dark.png`,
    };
  }, [draft, subtotal, discountAmt, total]);

  const exportClientQuote = useCallback(() => printHTML(buildClientQuoteHTML(printInput())), [printInput]);
  const exportJobSheet = useCallback(() => printHTML(buildInternalJobSheetHTML(printInput())), [printInput]);

  // ── Send to GHL ────────────────────────────────────────────────────────────
  const discountNeedsReason = draft.discountPct > 0 && !draft.discountReason.trim();

  const doSend = useCallback(() => {
    setSendResult(null);
    startSend(async () => {
      const res = await sendQuoteToGhl({
        contact: draft.contact,
        propertyType: draft.propertyType,
        quoteNumber: draft.quoteNumber,
        lineItems: pricedItems.map((i) => ({
          name: i.description,
          description: i.category + (i.isAddon ? " (add-on)" : ""),
          qty: i.qty,
          unitPrice: i.unitPrice,
          isAddon: i.isAddon,
        })),
        discountPercent: draft.discountPct,
        discountReason: draft.discountReason,
        subtotal,
        total,
      });
      setSendResult(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, pricedItems, subtotal, total]);

  // ── Step gating ────────────────────────────────────────────────────────────
  const canLeaveStep1 = draft.contact.name.trim().length > 0 && draft.contact.address.trim().length > 0;
  const step = draft.step;
  const go = (n: number) => patch({ step: n });

  // ═══ Render ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F4F7F8] font-body text-[#0C1215]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#EFF4F7] bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-semibold tracking-tight">Audit Tool</h1>
            <p className="truncate text-xs text-[#8899A6]">
              {draft.quoteNumber || "New quote"}
              {draft.contact.address ? ` — ${draft.contact.address}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("Start a new quote? The current draft will be cleared.")) startFresh();
            }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-[#4B5C6B] hover:bg-[#EDF7FC]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> New
          </button>
        </div>
        {/* Step dots */}
        <div className="mx-auto max-w-2xl px-4 pb-3 sm:px-6">
          <div className="flex items-center">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={label} className="flex min-w-0 flex-1 items-center">
                  <button
                    type="button"
                    disabled={n > step}
                    onClick={() => n <= step && go(n)}
                    className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1"
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-semibold ${
                        active
                          ? "bg-[#62C4EB] text-[#0C1215]"
                          : done
                            ? "bg-[#EDF7FC] text-[#3AA8D4]"
                            : "bg-[#F4F7F8] text-[#8899A6]"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : n}
                    </span>
                    <span
                      className={`text-[10px] leading-none ${active ? "font-semibold text-[#0C1215]" : "text-[#8899A6]"}`}
                    >
                      {label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <span
                      className={`mx-1 mb-3.5 h-px flex-1 ${done ? "bg-[#62C4EB]" : "bg-[#E4ECF1]"}`}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-5 sm:px-6">
        {/* Resume banner */}
        {resumeAvailable && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#C8E8F5] bg-[#EDF7FC] p-4 text-sm">
            <p className="min-w-0 flex-1 text-[#0C1215]">
              Draft from {new Date(resumeAvailable.savedAt).toLocaleString()} found
              {resumeAvailable.contact.address ? ` — ${resumeAvailable.contact.address}` : ""}.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={btnPrimary}
                onClick={() => {
                  setDraft(resumeAvailable);
                  setResumeAvailable(null);
                }}
              >
                Resume
              </button>
              <button
                type="button"
                className={btnOutline}
                onClick={() => {
                  localStorage.removeItem(DRAFT_KEY);
                  setResumeAvailable(null);
                }}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Property & contact ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className={cardCls}>
              <h2 className="font-display text-base font-semibold">Property &amp; contact</h2>
              <p className="mt-1 text-sm text-[#4B5C6B]">Who and where is this quote for?</p>

              {/* Property type */}
              <div className="mt-4">
                <span className={labelCls}>Property type</span>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => patch({ propertyType: t.value })}
                      className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none ${
                        draft.propertyType === t.value
                          ? "border-[#62C4EB] bg-[#EDF7FC] font-semibold"
                          : "border-[#E4ECF1] bg-white hover:border-[#62C4EB]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Find existing contact */}
              <div className="mt-5">
                <span className={labelCls}>Find existing contact (GHL)</span>
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    placeholder="Name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        runSearch();
                      }
                    }}
                  />
                  <button type="button" onClick={runSearch} disabled={searching} className={`${btnOutline} shrink-0`}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
                    Search
                  </button>
                </div>
                {searchError && <p className="mt-1.5 text-xs font-medium text-[#DC4B2A]">{searchError}</p>}
                {searchResults !== null && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-[#E4ECF1]">
                    {searchResults.length === 0 ? (
                      <p className="bg-white px-4 py-3 text-sm text-[#8899A6]">
                        No matches — fill the fields below to create a new contact on send.
                      </p>
                    ) : (
                      searchResults.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            patchContact({
                              name: c.name || draft.contact.name,
                              email: c.email || "",
                              phone: c.phone || "",
                              address: c.address || draft.contact.address,
                            });
                            setSearchResults(null);
                          }}
                          className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-[#EFF4F7] bg-white px-4 py-2.5 text-left text-sm last:border-0 hover:bg-[#EDF7FC]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{c.name || "(no name)"}</span>
                            <span className="block truncate text-xs text-[#8899A6]">
                              {[c.email, c.phone, c.address].filter(Boolean).join(" · ")}
                            </span>
                          </span>
                          <Plus className="h-4 w-4 shrink-0 text-[#62C4EB]" aria-hidden />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Contact fields */}
              <div className="mt-5 grid gap-3">
                <div>
                  <label className={labelCls} htmlFor="q-name">Contact name</label>
                  <input id="q-name" className={inputCls} autoComplete="off" placeholder="Full name"
                    value={draft.contact.name} onChange={(e) => patchContact({ name: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-address">Property address</label>
                  <input id="q-address" className={inputCls} autoComplete="off" placeholder="1234 SE Oak St, Portland, OR"
                    value={draft.contact.address} onChange={(e) => patchContact({ address: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="q-email">Email</label>
                    <input id="q-email" type="email" className={inputCls} autoComplete="off" placeholder="Email"
                      value={draft.contact.email} onChange={(e) => patchContact({ email: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="q-phone">Phone</label>
                    <input id="q-phone" type="tel" className={inputCls} autoComplete="off" placeholder="Phone"
                      value={draft.contact.phone} onChange={(e) => patchContact({ phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-notes">Inspector notes</label>
                  <textarea
                    id="q-notes"
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="What did you see? Counts and sizes price best — e.g. 18 windows, ~600 sqft driveway, heavy moss on north wall, 3 trash enclosures, gate access on south side."
                    value={draft.notes}
                    onChange={(e) => patch({ notes: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-[#8899A6]">
                    Everything written here MUST be quoted by the AI — notes override photos.
                  </p>
                </div>
              </div>
            </div>

            <button type="button" disabled={!canLeaveStep1} onClick={() => go(2)} className={`${btnPrimary} w-full`}>
              Continue to photos
            </button>
            {!canLeaveStep1 && (
              <p className="text-center text-xs text-[#8899A6]">Contact name and property address are required.</p>
            )}
          </div>
        )}

        {/* ── Step 2: Photos ─────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className={cardCls}>
              <h2 className="font-display text-base font-semibold">Property photos</h2>
              <p className="mt-1 text-sm text-[#4B5C6B]">
                More photos, better quote. Capture every dirty area — close-ups of stains and moss, wide shots for
                scale, all sides of the building, driveways and enclosures.
              </p>

              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" id="q-camera"
                onChange={(e) => addPhotos(e.target.files)} />
              <input ref={galleryRef} type="file" accept="image/*" multiple className="sr-only" id="q-gallery"
                onChange={(e) => addPhotos(e.target.files)} />

              {uploading && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#C8E8F5] bg-[#EDF7FC] px-4 py-3 text-sm font-medium">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#3AA8D4]" aria-hidden />
                  Compressing photos…
                </div>
              )}
              {photoError && <p className="mt-3 text-sm font-medium text-[#DC4B2A]">{photoError}</p>}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <label
                  htmlFor="q-camera"
                  className={`flex min-h-[88px] cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#E4ECF1] text-sm font-medium hover:border-[#62C4EB] ${uploading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Camera className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                  Take photo
                </label>
                <label
                  htmlFor="q-gallery"
                  className={`flex min-h-[88px] cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#E4ECF1] text-sm font-medium hover:border-[#62C4EB] ${uploading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Images className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                  Choose photos
                </label>
              </div>

              {draft.photos.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">
                    {draft.photos.length} photo{draft.photos.length > 1 ? "s" : ""}
                    {draft.photos.length > 8 ? " (first 8 are sent to the AI)" : ""}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {draft.photos.map((p) => (
                      <div key={p.id} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.dataUrl} alt={p.name} className="h-24 w-full rounded-lg border border-[#E4ECF1] object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          aria-label={`Remove ${p.name}`}
                          className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-lg bg-[#0C1215]/70 text-white"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => go(1)} className={btnOutline}>
                <ChevronLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button type="button" disabled={!draft.photos.length || uploading} onClick={() => go(3)} className={`${btnPrimary} flex-1`}>
                Continue to analysis
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: AI analysis ────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
            {analyzing ? (
              <div className={`${cardCls} py-10 text-center`}>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#EDF7FC]">
                  <Sparkles className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                </div>
                <h2 className="font-display text-base font-semibold">Analyzing {Math.min(draft.photos.length, 8)} photos</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[#4B5C6B]">
                  This takes 30–90 seconds. Stay on this page — results appear automatically.
                </p>
                <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-[#3AA8D4]" aria-hidden />
              </div>
            ) : draft.analysis ? (
              <>
                {/* Summary */}
                <div className={cardCls}>
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] text-base font-bold"
                      style={{
                        borderColor: scoreColor(draft.analysis.assessment.conditionScore),
                        color: scoreColor(draft.analysis.assessment.conditionScore),
                      }}
                    >
                      {draft.analysis.assessment.conditionScore}/10
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-semibold">Diagnostic summary</h2>
                      <p className="mt-1 text-sm leading-relaxed text-[#4B5C6B]">
                        {draft.analysis.assessment.summaryText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Minimum floor note */}
                {draft.analysis.minimumApplied && (
                  <div className="rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-4 text-sm text-[#9A3412]">
                    <p className="font-semibold">
                      Standalone minimum applied — {draft.analysis.minimumApplied.tier} floor $
                      {draft.analysis.minimumApplied.floor}
                      {draft.analysis.minimumApplied.originalPrice > 0
                        ? ` (raised from $${draft.analysis.minimumApplied.originalPrice})`
                        : ""}
                    </p>
                    {draft.analysis.pricingNote && <p className="mt-1 leading-relaxed">{draft.analysis.pricingNote}</p>}
                  </div>
                )}

                {/* Findings */}
                {draft.analysis.assessment.findings.length > 0 && (
                  <div className={`${cardCls} p-0 sm:p-0`}>
                    <div className="border-b border-[#EFF4F7] px-5 py-3">
                      <h3 className="font-display text-sm font-semibold">
                        Findings ({draft.analysis.assessment.findings.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-[#EFF4F7]">
                      {draft.analysis.assessment.findings.map((f, i) => (
                        <div key={i} className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                f.severity === "high"
                                  ? "bg-[#FDE8E4] text-[#B3341C]"
                                  : f.severity === "medium"
                                    ? "bg-[#FEF3D9] text-[#92600A]"
                                    : "bg-[#EDF7FC] text-[#3AA8D4]"
                              }`}
                            >
                              {f.severity}
                            </span>
                            <p className="text-sm font-medium">{f.area}</p>
                          </div>
                          <p className="mt-1 text-xs text-[#4B5C6B]">{f.issue}</p>
                          {(f.remediation || f.professionalApproach) && (
                            <p className="mt-2 rounded-xl bg-[#F4F7F8] p-3 text-xs leading-relaxed text-[#4B5C6B]">
                              <span className="font-semibold text-[#0C1215]">Remediation: </span>
                              {f.remediation || f.professionalApproach}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services preview */}
                <div className={`${cardCls} p-0 sm:p-0`}>
                  <div className="border-b border-[#EFF4F7] px-5 py-3">
                    <h3 className="font-display text-sm font-semibold">Recommended services</h3>
                  </div>
                  <div className="divide-y divide-[#EFF4F7]">
                    {draft.analysis.recommendedServices
                      .filter((s) => s.category !== "Pricing Note")
                      .map((s, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 px-5 py-3">
                          <div className="min-w-0">
                            <p className={`text-sm ${s.isAddon ? "italic text-[#4B5C6B]" : "font-medium"}`}>
                              {s.isAddon ? "+ " : ""}
                              {s.description}
                            </p>
                            <p className="text-xs text-[#8899A6]">{s.category}</p>
                          </div>
                          <p className="shrink-0 text-sm font-semibold">${money(s.estimatedPrice)}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => go(2)} className={btnOutline}>
                    <ChevronLeft className="h-4 w-4" aria-hidden /> Photos
                  </button>
                  <button type="button" onClick={runAnalysis} className={btnOutline}>
                    <RotateCcw className="h-4 w-4" aria-hidden /> Re-run
                  </button>
                  <button type="button" onClick={seedLineItems} className={`${btnPrimary} flex-1`}>
                    Build quote from these prices
                  </button>
                </div>
                {draft.lineItems.length > 0 && (
                  <p className="text-center text-xs text-[#8899A6]">
                    Building the quote again replaces your edited line items with these prices.
                  </p>
                )}
              </>
            ) : (
              <div className={`${cardCls} py-10 text-center`}>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#EDF7FC]">
                  <Sparkles className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                </div>
                <h2 className="font-display text-base font-semibold">Ready to analyze</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[#4B5C6B]">
                  {Math.min(draft.photos.length, 8)} photo{draft.photos.length !== 1 ? "s" : ""} plus your notes go to
                  the AI, which prices every surface off the approved rate table.
                </p>
                {analyzeError && (
                  <p className="mx-auto mt-3 max-w-sm rounded-xl border border-[#F5C6BB] bg-[#FDF2EF] px-4 py-3 text-sm font-medium text-[#B3341C]">
                    {analyzeError}
                  </p>
                )}
                <div className="mt-5 flex justify-center gap-3">
                  <button type="button" onClick={() => go(2)} className={btnOutline}>
                    <ChevronLeft className="h-4 w-4" aria-hidden /> Back
                  </button>
                  <button type="button" onClick={runAnalysis} disabled={!draft.photos.length} className={btnPrimary}>
                    <Sparkles className="h-4 w-4" aria-hidden /> Run AI analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Quote editor ───────────────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className={`${cardCls} p-0 sm:p-0`}>
              <div className="border-b border-[#EFF4F7] px-5 py-3">
                <h2 className="font-display text-base font-semibold">Quote editor</h2>
                <p className="text-xs text-[#8899A6]">Tap any field to edit. Prices are per unit.</p>
              </div>

              {pricingNoteItem && (
                <div className="mx-5 mt-4 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-3 text-xs leading-relaxed text-[#9A3412]">
                  <span className="font-semibold">Pricing note: </span>
                  {pricingNoteItem.description}
                </div>
              )}

              {pricedItems.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[#8899A6]">
                  No line items yet — run the analysis (step 3) or add a custom line below.
                </p>
              ) : (
                <div className="divide-y divide-[#EFF4F7]">
                  {draft.lineItems.map((item) =>
                    item.category === "Pricing Note" ? null : (
                      <div key={item.id} className={`px-5 py-4 ${item.isAddon ? "bg-[#F8FBFE]" : ""}`}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#8899A6]">
                            {item.category}
                            {item.isAddon ? " · add-on" : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove line item"
                            className="grid h-9 w-9 place-items-center rounded-lg text-[#8899A6] hover:bg-[#FDF2EF] hover:text-[#B3341C]"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          className={`${inputCls} resize-none ${item.isAddon ? "italic" : ""}`}
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <label className="flex flex-1 items-center gap-1.5 text-xs text-[#8899A6]">
                            Qty
                            <input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              className={`${inputCls} text-right`}
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, { qty: Math.max(0, parseFloat(e.target.value) || 0) })}
                            />
                          </label>
                          <label className="flex flex-1 items-center gap-1.5 text-xs text-[#8899A6]">
                            $
                            <input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              className={`${inputCls} text-right`}
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(item.id, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })
                              }
                            />
                          </label>
                          <span className="w-24 shrink-0 text-right text-sm font-semibold">
                            ${money(item.qty * item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              <div className="border-t border-[#EFF4F7] px-5 py-3">
                <button type="button" onClick={addCustomItem} className={`${btnOutline} w-full border-dashed`}>
                  <Plus className="h-4 w-4" aria-hidden /> Add custom line
                </button>
              </div>
            </div>

            {/* Discount */}
            <div className={cardCls}>
              <h3 className="font-display text-sm font-semibold">Discount</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[0, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => patch({ discountPct: pct, ...(pct === 0 ? { discountReason: "" } : {}) })}
                    className={`min-h-11 rounded-xl border px-4 text-sm font-medium ${
                      draft.discountPct === pct
                        ? "border-[#62C4EB] bg-[#EDF7FC] font-semibold"
                        : "border-[#E4ECF1] bg-white hover:border-[#62C4EB]"
                    }`}
                  >
                    {pct === 0 ? "None" : `${pct}%`}
                  </button>
                ))}
                <label className="flex min-h-11 items-center gap-1.5 text-sm text-[#4B5C6B]">
                  Custom
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    className={`${inputCls} w-24 text-right`}
                    value={draft.discountPct || ""}
                    placeholder="0"
                    onChange={(e) =>
                      patch({ discountPct: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })
                    }
                  />
                  <span>%</span>
                </label>
              </div>
              {draft.discountPct > 0 && (
                <div className="mt-3">
                  <label className={labelCls} htmlFor="q-discount-reason">
                    Reason (required)
                  </label>
                  <input
                    id="q-discount-reason"
                    className={inputCls}
                    placeholder="e.g. Neighbor bundle, repeat client, first-visit offer"
                    value={draft.discountReason}
                    onChange={(e) => patch({ discountReason: e.target.value })}
                  />
                  {discountNeedsReason && (
                    <p className="mt-1.5 text-xs font-medium text-[#DC4B2A]">
                      A reason is required before the discount can go out.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className={`${cardCls} p-0 sm:p-0`}>
              <div className="flex justify-between px-5 py-3 text-sm text-[#4B5C6B]">
                <span>Subtotal</span>
                <span>${money(subtotal)}</span>
              </div>
              {draft.discountPct > 0 && (
                <div className="flex justify-between border-t border-dashed border-[#EFF4F7] px-5 py-3 text-sm text-[#16a34a]">
                  <span>
                    {draft.discountReason || "Discount"} ({draft.discountPct}%)
                  </span>
                  <span>-${money(discountAmt)}</span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-b-2xl bg-[#0C1215] px-5 py-4 text-white">
                <span className="text-sm font-bold">TOTAL DUE</span>
                <span className="text-xl font-bold">${money(total)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => go(3)} className={btnOutline}>
                <ChevronLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button
                type="button"
                disabled={pricedItems.length === 0 || discountNeedsReason}
                onClick={() => go(5)}
                className={`${btnPrimary} flex-1`}
              >
                Continue to send
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Actions ────────────────────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-4">
            <div className={cardCls}>
              <h2 className="font-display text-base font-semibold">Quote {draft.quoteNumber}</h2>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8899A6]">Contact</dt>
                  <dd className="text-right font-medium">{draft.contact.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8899A6]">Property</dt>
                  <dd className="min-w-0 truncate text-right font-medium">{draft.contact.address}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8899A6]">Line items</dt>
                  <dd className="text-right font-medium">{pricedItems.length}</dd>
                </div>
                {draft.discountPct > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8899A6]">Discount</dt>
                    <dd className="text-right font-medium">
                      {draft.discountPct}% — {draft.discountReason}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-[#EFF4F7] pt-2">
                  <dt className="font-semibold">Total</dt>
                  <dd className="text-right text-base font-bold">${money(total)}</dd>
                </div>
              </dl>
            </div>

            {/* PDF exports */}
            <div className={cardCls}>
              <h3 className="font-display text-sm font-semibold">Print / PDF</h3>
              <p className="mt-1 text-xs text-[#8899A6]">
                Opens a print window — choose &quot;Save as PDF&quot; as the destination.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={exportClientQuote} className={btnOutline}>
                  <Printer className="h-4 w-4" aria-hidden /> Client Quote PDF
                </button>
                <button type="button" onClick={exportJobSheet} className={btnOutline}>
                  <FileText className="h-4 w-4" aria-hidden /> Internal Job Sheet PDF
                </button>
              </div>
            </div>

            {/* Send to GHL */}
            <div className={cardCls}>
              <h3 className="font-display text-sm font-semibold">Send to GHL</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#8899A6]">
                Upserts the contact, files the opportunity, creates the estimate with a 50% deposit due on acceptance,
                and sends it by text and email. GHL becomes the system of record.
              </p>
              <button
                type="button"
                onClick={doSend}
                disabled={sending || pricedItems.length === 0 || !draft.contact.name.trim()}
                className={`${btnPrimary} mt-3 w-full`}
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden /> Send to GHL
                  </>
                )}
              </button>

              {sendResult && (
                <ul className="mt-4 space-y-2">
                  {(
                    [
                      ["Contact", sendResult.contact],
                      ["Opportunity", sendResult.opportunity],
                      ["Estimate", sendResult.estimate],
                      ["Sent (SMS + email)", sendResult.sent],
                      ["Tags", sendResult.tag],
                    ] as const
                  ).map(([label, r]) => (
                    <li key={label} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md text-[10px] font-bold ${
                          r.status === "ok"
                            ? "bg-[#E7F6EE] text-[#16a34a]"
                            : r.status === "skip"
                              ? "bg-[#F4F7F8] text-[#8899A6]"
                              : "bg-[#FDF2EF] text-[#B3341C]"
                        }`}
                      >
                        {r.status === "ok" ? <Check className="h-3 w-3" aria-hidden /> : r.status === "skip" ? "–" : <X className="h-3 w-3" aria-hidden />}
                      </span>
                      <span className="min-w-0">
                        <span className="font-medium">{label}</span>
                        {r.detail && <span className="block text-xs text-[#8899A6]">{r.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => go(4)} className={btnOutline}>
                <ChevronLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Start a new quote? The current draft will be cleared.")) startFresh();
                }}
                className={`${btnOutline} flex-1`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Start next quote
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
