import "server-only";
import { get, list, put } from "@vercel/blob";
import { REPORT_ID, type JobReport } from "./types";

const path = (id: string) => `job-reports/${id}/report.json`;

export async function readReport(id: string): Promise<JobReport | null> {
  if (!REPORT_ID.test(id)) return null;
  const r = await get(path(id), { access: "public", useCache: false }).catch(() => null);
  return r?.stream ? ((await new Response(r.stream).json()) as JobReport) : null;
}

export async function writeReport(r: JobReport): Promise<void> {
  await put(path(r.id), JSON.stringify(r), {
    access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60,
  });
}

// ponytail: reads every report.json; fine for a few hundred jobs, add an index file past that.
export async function allReports(): Promise<JobReport[]> {
  const paths: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "job-reports/", limit: 1000, cursor });
    paths.push(...page.blobs.map((b) => b.pathname).filter((p) => p.endsWith("/report.json")));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const rows = await Promise.all(paths.map((p) => readReport(p.split("/")[1]).catch(() => null)));
  return rows.filter((r): r is JobReport => !!r).sort((a, b) => b.updatedAt - a.updatedAt);
}
