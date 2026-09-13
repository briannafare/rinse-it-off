"use client";
import { useEffect } from "react";

// Meta Pixel, only when NEXT_PUBLIC_META_PIXEL_ID is set (Vercel env). PageView on load; the
// plan calculator fires Lead (quote saved) and Purchase (the $99 reservation) through track().
declare global {
  interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown }
}
const ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) window.fbq("track", event, params);
}

export default function MetaPixel() {
  useEffect(() => {
    if (!ID || window.fbq) return;
    const w = window as Window & { fbq?: unknown };
    // Meta's standard loader, unminified only as far as needed to satisfy the type checker.
    const f = function (...args: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = f as any;
      q.callMethod ? q.callMethod(...args) : q.queue.push(args);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = f as any;
    q.push = f; q.loaded = true; q.version = "2.0"; q.queue = [];
    w.fbq = f; w._fbq = f;
    const s = document.createElement("script");
    s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    f("init", ID);
    f("track", "PageView");
  }, []);
  return null;
}
