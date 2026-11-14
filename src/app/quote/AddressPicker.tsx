"use client";

/** Property address for the /quote tool (Bri 2026-11-13: "needs to actually look up and verify the
 *  address so I don't have to type in the full thing"). Typing the street suggests real addresses
 *  (Esri's free World Geocoder suggest, keyless, biased to Portland); picking one fills street, city,
 *  state and ZIP, then checks the county records the pricing uses (Metro RLIS via lookupHouse). */

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MapPin } from "lucide-react";
import { lookupHouse } from "@/app/book/actions";

export interface AddressParts {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const SUGGEST = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest";

export const fullAddress = (a: AddressParts) =>
  [a.street, a.city, [a.state, a.zip].filter(Boolean).join(" ")].map((s) => s.trim()).filter(Boolean).join(", ");

/** "226 SW Florida St, Portland, OR, 97219, USA" → parts */
function parse(text: string): AddressParts {
  const p = text.split(",").map((s) => s.trim());
  return { street: p[0] ?? "", city: p[1] ?? "", state: p[2] ?? "", zip: p[3]?.match(/^\d{5}/)?.[0] ?? "" };
}

type Check = { state: "idle" | "looking" | "found" | "none"; text?: string };

export default function AddressPicker({
  value,
  onChange,
  inputCls,
  labelCls,
}: {
  value: AddressParts;
  onChange: (a: AddressParts) => void;
  inputCls: string;
  labelCls: string;
}) {
  const [hits, setHits] = useState<string[]>([]);
  const [check, setCheck] = useState<Check>({ state: "idle" });
  const typed = useRef(false); // only suggest while someone is typing, not after a pick

  useEffect(() => {
    if (!typed.current || value.street.trim().length < 4) return setHits([]);
    const ctl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const q = new URLSearchParams({
          f: "json", text: value.street, location: "-122.68,45.52", countryCode: "USA", category: "Address", maxSuggestions: "8",
        });
        const d = (await (await fetch(`${SUGGEST}?${q}`, { signal: ctl.signal })).json()) as { suggestions?: { text: string }[] };
        // ponytail: the service area is Oregon and SW Washington
        setHits((d.suggestions ?? []).map((s) => s.text).filter((x) => /, (OR|WA), \d{5}/.test(x)).slice(0, 5));
      } catch {
        /* typed faster than the network, or offline: the fields still work by hand */
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [value.street]);

  const verify = async (a: AddressParts) => {
    if (!a.street.trim() || !(a.city.trim() || a.zip.trim())) return;
    setCheck({ state: "looking" });
    const h = await lookupHouse(fullAddress(a)).catch(() => null);
    setCheck(
      h
        ? { state: "found", text: `Found in county records: ${h.sqft.toLocaleString()} sq ft house at ${h.matched}.` }
        : { state: "none", text: "Not in the Portland-area county records (Multnomah, Washington, Clackamas). You can still go on; the AI will judge the size from the photos." },
    );
  };

  const set = (p: Partial<AddressParts>) => {
    onChange({ ...value, ...p });
    setCheck({ state: "idle" });
  };

  const pick = (text: string) => {
    const a = parse(text);
    typed.current = false;
    setHits([]);
    onChange(a);
    verify(a);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className={labelCls} htmlFor="q-address">Property address</label>
        <input
          id="q-address"
          className={inputCls}
          autoComplete="off"
          placeholder="Start typing: 226 SW Flor…"
          value={value.street}
          onChange={(e) => {
            typed.current = true;
            set({ street: e.target.value });
          }}
          onKeyDown={(e) => e.key === "Enter" && hits[0] && (e.preventDefault(), pick(hits[0]))}
          onBlur={() => setTimeout(() => setHits([]), 150)}
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="q-address-list"
        />
        {hits.length > 0 && (
          <ul id="q-address-list" role="listbox" className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-retro-line bg-white shadow-lg">
            {hits.map((h) => (
              <li key={h} role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(h)}
                  className="flex min-h-11 w-full items-center gap-2 border-b border-retro-line px-4 py-2.5 text-left text-sm last:border-0 hover:bg-[#E3ECE6]"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#2F6B66]" aria-hidden />
                  {h.replace(/, USA$/, "")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_5rem_7rem] [&>div]:min-w-0">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls} htmlFor="q-city">City</label>
          <input id="q-city" className={inputCls} autoComplete="off" value={value.city} onChange={(e) => set({ city: e.target.value })} />
        </div>
        <div>
          <label className={labelCls} htmlFor="q-state">State</label>
          <input id="q-state" className={inputCls} autoComplete="off" maxLength={2} value={value.state}
            onChange={(e) => set({ state: e.target.value.toUpperCase() })} />
        </div>
        <div>
          <label className={labelCls} htmlFor="q-zip">ZIP</label>
          <input id="q-zip" className={inputCls} autoComplete="off" inputMode="numeric" maxLength={5} value={value.zip}
            onChange={(e) => set({ zip: e.target.value.replace(/\D/g, "") })} onBlur={() => check.state === "idle" && verify(value)} />
        </div>
      </div>

      {check.state !== "idle" && (
        <p className={`flex items-start gap-2 text-sm ${check.state === "found" ? "text-[#16a34a]" : "text-[#4A4238]"}`} aria-live="polite">
          {check.state === "looking" ? (
            <><Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" aria-hidden /> Checking county records…</>
          ) : (
            <>{check.state === "found" && <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}{check.text}</>
          )}
        </p>
      )}
    </div>
  );
}
