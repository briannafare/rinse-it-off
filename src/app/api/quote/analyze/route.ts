/** POST /api/quote/analyze — internal audit-tool AI analysis.
 *  Receives compressed photos (base64) + job context, calls the Anthropic
 *  Messages API with the approved pricing prompt, applies the tiered-minimums
 *  logic SERVER-SIDE, and returns the assessment + priced services.
 *  A route handler (not a server action) so the multi-MB photo payload avoids
 *  the 1MB server-action body limit. ANTHROPIC_API_KEY never leaves the server. */

import { NextResponse } from "next/server";
import { isQuoteAuthed } from "@/app/quote/auth";
import { SYSTEM_PROMPT } from "@/app/quote/prompt";
import { applyTieredMinimums } from "@/lib/quote/minimums.mjs";
import type { AnalyzeResponse, Finding, RecommendedService } from "@/lib/quote/types";

export const runtime = "nodejs";
export const maxDuration = 300; // analysis takes 30-90s; give it headroom

const ANTHROPIC_MODEL = "claude-sonnet-5";
const MAX_PHOTOS = 8; // cap to avoid oversized Anthropic requests (matches v1)

const ALLOWED_MEDIA = new Set(["image/jpeg", "image/png", "image/webp"]);

interface AnalyzeRequestBody {
  photos: Array<{ data: string; mediaType: string }>;
  propertyType?: string;
  address?: string;
  contactName?: string;
  notes?: string;
}

export async function POST(req: Request) {
  if (!(await isQuoteAuthed())) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Unlock the tool first." }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NO_API_KEY", message: "ANTHROPIC_API_KEY is not set on the server. Add it to the environment and redeploy." },
      { status: 402 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = (await req.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST", message: "Invalid JSON body." }, { status: 400 });
  }

  const photos = (body.photos || [])
    .filter((p) => p?.data && ALLOWED_MEDIA.has(p.mediaType))
    .slice(0, MAX_PHOTOS);
  if (!photos.length) {
    return NextResponse.json({ error: "NO_PHOTOS", message: "Upload at least one photo first." }, { status: 400 });
  }

  const imageContents = photos.map((p) => ({
    type: "image" as const,
    source: { type: "base64" as const, media_type: p.mediaType, data: p.data },
  }));

  const contextText = [
    `Analyze these ${photos.length} property photos and generate a complete diagnostic assessment.`,
    body.address ? `Property address: ${body.address}` : "",
    body.propertyType ? `Property type: ${body.propertyType}` : "",
    body.contactName ? `Client contact: ${body.contactName}` : "",
    body.notes
      ? `MANDATORY INSPECTOR FIELD NOTES — READ THIS FIRST:\nEvery item, surface, or condition mentioned below MUST appear as a finding and quoted service in your response. These notes come from a salesperson who physically inspected the property. They take precedence over your photo interpretation.\n---\n${body.notes}\n---`
      : "",
    "\nReturn ONLY valid JSON, no markdown fences.",
  ]
    .filter(Boolean)
    .join("\n");

  let resp: Response;
  try {
    resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        // Sonnet 5 thinks by default and max_tokens caps thinking + text — keep headroom.
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: [...imageContents, { type: "text", text: contextText }] }],
      }),
    });
  } catch (e) {
    console.error("Anthropic network error:", e);
    return NextResponse.json(
      { error: "API_ERROR", message: "Could not reach the AI service — check the connection and try again." },
      { status: 502 },
    );
  }

  if (!resp.ok) {
    const text = await resp.text();
    console.error("Anthropic API error:", resp.status, text);
    const friendly =
      resp.status === 401
        ? "The Anthropic API key was rejected — check ANTHROPIC_API_KEY."
        : resp.status === 429
          ? "The AI service is rate-limited right now — wait a minute and try again."
          : resp.status === 529
            ? "The AI service is overloaded — try again in a moment."
            : `The AI service returned an error (${resp.status}).`;
    return NextResponse.json({ error: "API_ERROR", message: friendly }, { status: 502 });
  }

  const data = (await resp.json()) as {
    stop_reason?: string;
    content?: Array<{ type: string; text?: string }>;
  };

  if (data.stop_reason === "refusal") {
    return NextResponse.json(
      { error: "API_ERROR", message: "The AI declined this request. Try different photos or rephrase the notes." },
      { status: 502 },
    );
  }

  // Sonnet 5 responses can include thinking blocks — take the first TEXT block.
  const textBlock = (data.content || []).find((b) => b.type === "text" && b.text);
  if (!textBlock?.text) {
    return NextResponse.json(
      { error: "API_ERROR", message: "The AI returned an empty response — try again." },
      { status: 502 },
    );
  }

  let parsed: {
    conditionScore?: number;
    summaryText?: string;
    findings?: Finding[];
    recommendedServices?: RecommendedService[];
    clarifyingQuestions?: AnalyzeResponse["clarifyingQuestions"];
  };
  try {
    const cleaned = textBlock.text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON parse failed:", e, textBlock.text.slice(0, 500));
    return NextResponse.json(
      { error: "PARSE_ERROR", message: "The AI returned an unreadable response — run the analysis again." },
      { status: 502 },
    );
  }

  // Tiered standalone minimums — enforced server-side, exactly per the approved
  // export logic (shared module, also exercised by scripts/check-pricing.mjs).
  const { services, pricingNote, applied } = applyTieredMinimums(parsed.recommendedServices || []);

  const payload: AnalyzeResponse = {
    assessment: {
      conditionScore: parsed.conditionScore || 5,
      summaryText: parsed.summaryText || "",
      findings: parsed.findings || [],
    },
    recommendedServices: services,
    pricingNote,
    minimumApplied: applied,
    clarifyingQuestions: parsed.clarifyingQuestions ?? null,
  };

  return NextResponse.json(payload);
}
