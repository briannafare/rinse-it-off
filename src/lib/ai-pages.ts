/** The seven AI-search pieces (blog answers, two comparison pages, one
 *  commercial guide). The copy lives, word for word as the editor finished it,
 *  in src/content/ai-search/*.md and reaches this module through the generated
 *  pages.generated.ts. Nothing here rewrites it: this file only reads the
 *  structure (headings, tables, lists, the question/answer pairs) so the page
 *  template and the JSON-LD are built from the same text. */
import { AI_SEARCH_SOURCES } from "@/content/ai-search/pages.generated";

export type Inline = string; // raw inline markdown: **bold**, *italic*, [text](url), bare URLs

export type Block =
  | { t: "h1" | "h2" | "h3"; text: string }
  | { t: "p"; text: Inline }
  | { t: "ul" | "ol"; items: Inline[] }
  | { t: "table"; head: Inline[]; rows: Inline[][] }
  | { t: "hr" }
  | { t: "faq"; q: string; a: string };

export type AiPage = {
  slug: string; // source file name
  title: string;
  description: string;
  path: string; // target URL path
  kind: "blog" | "compare" | "commercial";
  h1: string;
  blocks: Block[];
  faqs: { question: string; answer: string; answerRaw: string }[];
  /** Raw markdown, frontmatter and HTML comments removed. */
  markdown: string;
  /** Every [CONFIRM...] or [EDITOR...] marker still in the copy. */
  openMarkers: string[];
  /** Date on the page's "checked" line; also the sitemap lastmod. */
  checked: string;
};

/** ISO date the copy was last checked, from the "checked 2026-10-19" lines. */
const CHECKED_FALLBACK = "2026-10-19";

function frontmatter(src: string) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(src);
  const meta: Record<string, string> = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = /^(\w+):\s*(.*)$/.exec(line);
      if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
    }
  }
  return { meta, body: m ? src.slice(m[0].length) : src };
}

/** Plain text of inline markdown (for JSON-LD answers and the .md/llms copies). */
export function plainInline(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function parseBlocks(body: string): Block[] {
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const h = /^(#{1,3}) (.*)$/.exec(line);
    if (h) {
      blocks.push({ t: `h${h[1].length}` as "h1" | "h2" | "h3", text: h[2].trim() });
      i++;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push({ t: "hr" });
      i++;
      continue;
    }
    if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const [head, , ...rest] = rows; // second row is the |---| divider
      blocks.push({ t: "table", head, rows: rest });
      continue;
    }
    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].slice(2));
      blocks.push({ t: "ul", items });
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ""));
      blocks.push({ t: "ol", items });
      continue;
    }
    // Paragraph; a bold-only first line followed by answer lines is a Q/A pair.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3} |---+$|- |\d+\. )/.test(lines[i]) &&
      !lines[i].trim().startsWith("|")
    ) {
      para.push(lines[i++]);
    }
    const q = /^\*\*([^*]+\?)\*\*$/.exec(para[0].trim());
    if (q && para.length > 1) blocks.push({ t: "faq", q: q[1], a: para.slice(1).join(" ").trim() });
    else blocks.push({ t: "p", text: para.join(" ").trim() });
  }
  return blocks;
}

function build(slug: string, src: string): AiPage {
  const { meta, body } = frontmatter(src);
  const clean = body.replace(/<!--[\s\S]*?-->\n?/g, "").replace(/\n{3,}/g, "\n\n").trim();
  const blocks = parseBlocks(clean);
  const h1 = blocks.find((b) => b.t === "h1");
  const path = meta.target_url;
  const kind: AiPage["kind"] = path.startsWith("/compare/") ? "compare" : path.startsWith("/commercial/") ? "commercial" : "blog";
  const markers = clean.match(/\[(?:CONFIRM|EDITOR|Optional, CONFIRM)[^\]]*\]/g) ?? [];
  const checked = /(?:checked|Last checked) (\d{4}-\d{2}-\d{2})/.exec(clean)?.[1] ?? CHECKED_FALLBACK;
  return {
    slug,
    title: meta.title,
    description: meta.description,
    path,
    kind,
    h1: h1 && "text" in h1 ? h1.text : meta.title,
    blocks,
    faqs: blocks.filter((b): b is Extract<Block, { t: "faq" }> => b.t === "faq").map((b) => ({ question: b.q, answer: plainInline(b.a), answerRaw: b.a })),
    markdown: clean,
    openMarkers: markers,
    checked,
  };
}

export const AI_PAGES: AiPage[] = Object.entries(AI_SEARCH_SOURCES).map(([slug, src]) => build(slug, src));

export function getAiPage(path: string): AiPage | undefined {
  return AI_PAGES.find((p) => p.path === path);
}

/** True when the copy has no unresolved [CONFIRM]/[EDITOR] marker. Pages that
 *  fail this are held back from production, from the sitemap and from llms.txt;
 *  they still render on preview deployments so they can be reviewed. */
export const isPublishable = (p: AiPage) => p.openMarkers.length === 0;

/** Production serves a page only when it is publishable. Previews and local dev serve all. */
export function visibleHere(p: AiPage): boolean {
  return isPublishable(p) || process.env.VERCEL_ENV !== "production";
}

export const aiPagesByKind = (kind: AiPage["kind"]) => AI_PAGES.filter((p) => p.kind === kind);
