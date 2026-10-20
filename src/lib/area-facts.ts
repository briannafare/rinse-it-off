import data from "./area-facts.json";

/** Edited, sourced facts for /areas/<slug> pages. Source URLs stay in
 *  area-facts.json for auditing and are not rendered. Only entries with
 *  status "ok" are shown; "merge-candidate" pages get nothing. */
export type AreaFact = { text: string; source_url: string };

const FACTS = data as Record<string, { facts: AreaFact[]; status: string }>;

export function getAreaFacts(slug: string): AreaFact[] {
  const entry = FACTS[slug];
  return entry && entry.status === "ok" ? entry.facts : [];
}
