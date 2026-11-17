/** Job reports (Bri 2026-11-16): the crew uploads before, during and after photos and video from the
 *  job, the AI writes a few plain lines on what we did, the lead adds a note if they want, and the
 *  client gets one link (/done/<id>) by text and email when we finish. Stored as one JSON file per
 *  report in Blob store "rinse-quote-files": job-reports/<id>/report.json. Media sits beside it. */

export const STAGES = ["before", "during", "after"] as const;
export type Stage = (typeof STAGES)[number];

// ponytail: the crew is two people until we hire; add a row here (and their GHL user id) when we do.
export const WORKERS = [
  { name: "Bri", full: "Bri Lindley", ghlUserId: "9iXXFaE4tKyRGSvd2aBq" },
  { name: "Alstun", full: "Alstun Thurman", ghlUserId: "qJFn3bLe4o3h1to8xrRp" },
] as const;

export const SERVICES = ["House wash", "Driveway", "Walkways", "Patio", "Deck", "Fence", "Roof", "Gutters", "Windows", "Siding", "Other"] as const;

export interface JobMedia {
  url: string;
  kind: "image" | "video";
  w: number;
  h: number;
  poster?: string; // a still from the video, shown before it plays
}

export interface JobRemarks {
  summary: string; // one or two sentences under the client's name
  items: { area: string; did: string }[];
}

export interface JobReport {
  id: string;
  status: "draft" | "sent";
  client: { name: string; contactId?: string; phone: string; email: string; address: string };
  date: string; // YYYY-MM-DD, Pacific
  lead: string; // a WORKERS name
  services: string[];
  media: Record<Stage, JobMedia[]>;
  pair?: { before?: string; after?: string }; // which two photos the slider compares (default: the first of each)
  remarks?: JobRemarks;
  note: string;
  sentAt?: number;
  updatedAt: number;
}

export const REPORT_ID = /^[a-z0-9]{12}$/;

export function firstName(name: string): string {
  return (name.trim().split(/\s+/)[0] || "there").replace(/^./, (c) => c.toUpperCase());
}

/** The two photos the slider compares, or null when there isn't one of each. */
export function sliderPair(r: Pick<JobReport, "media" | "pair">): { before: JobMedia; after: JobMedia } | null {
  const pick = (s: "before" | "after") => {
    const imgs = r.media[s].filter((m) => m.kind === "image");
    return imgs.find((m) => m.url === r.pair?.[s]) ?? imgs[0];
  };
  const before = pick("before"), after = pick("after");
  return before && after ? { before, after } : null;
}
