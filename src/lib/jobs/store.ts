import "server-only";
import { del, list, put } from "@vercel/blob";
import { REPORT_ID, type JobReport } from "./types";

/* Every save is a NEW file, job-reports/<id>/report-<ms>.json, and a read takes the newest one.
 * Overwriting one report.json didn't work: Blob caches a file for at least 60 s, so a read right after a
 * save came back with the old copy (the AI saw "no photos" seconds after the upload, 2026-11-16).
 * A fresh name is never cached stale, and list() is current. The two newest copies are kept so a read
 * that lands mid-cleanup still finds one. */

const prefix = (id: string) => `job-reports/${id}/report-`;

async function versions(id: string) {
  const { blobs } = await list({ prefix: prefix(id), limit: 1000 });
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname)); // newest first (13-digit ms in the name)
}

async function fetchJson(url: string): Promise<JobReport | null> {
  const res = await fetch(url, { cache: "no-store" });
  return res.ok ? ((await res.json()) as JobReport) : null;
}

export async function readReport(id: string): Promise<JobReport | null> {
  if (!REPORT_ID.test(id)) return null;
  const v = await versions(id).catch(() => []);
  for (const b of v.slice(0, 2)) {
    const r = await fetchJson(b.url).catch(() => null);
    if (r) return r;
  }
  return null;
}

export async function writeReport(r: JobReport): Promise<void> {
  await put(`${prefix(r.id)}${Date.now()}.json`, JSON.stringify(r), {
    access: "public", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60,
  });
  const old = (await versions(r.id).catch(() => [])).slice(2).map((b) => b.url);
  if (old.length) await del(old).catch(() => null);
}

// ponytail: reads every report; fine for a few hundred jobs, add an index file past that.
export async function allReports(): Promise<JobReport[]> {
  const newest = new Map<string, { pathname: string; url: string }>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "job-reports/", limit: 1000, cursor });
    for (const b of page.blobs) {
      const m = b.pathname.match(/^job-reports\/([a-z0-9]{12})\/report-\d+\.json$/);
      if (m && (!newest.has(m[1]) || newest.get(m[1])!.pathname < b.pathname)) newest.set(m[1], b);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const rows = await Promise.all([...newest.values()].map((b) => fetchJson(b.url).catch(() => null)));
  return rows.filter((r): r is JobReport => !!r).sort((a, b) => b.updatedAt - a.updatedAt);
}
