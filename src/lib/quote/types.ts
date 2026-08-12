/** Shared data shapes for the internal /quote audit tool. Plain module — no
 *  "use client" / "use server" directives, so it is safe to import from both
 *  server code (route handler, server actions) and client components. Shapes
 *  are ported from rio_pricing_fix_export/shared/schema.ts. */

export type PropertyType = "residential" | "commercial" | "multifamily" | "hoa";

export interface Finding {
  area: string;
  issue: string;
  severity: "low" | "medium" | "high" | "recommended";
  photoRefs?: string[];
  remediation?: string;
  /** legacy field name — maps to remediation */
  professionalApproach?: string;
}

export interface RecommendedService {
  category: string;
  description: string;
  estimatedPrice: number;
  isAddon: boolean;
  addonFor?: string | null;
  minimumTier?: "driveway" | "commercial" | "general";
}

export interface Assessment {
  conditionScore: number; // 1-10
  summaryText: string;
  findings: Finding[];
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  type: "text" | "number" | "choice";
  choices?: string[];
}

export interface AnalyzeResponse {
  assessment: Assessment;
  recommendedServices: RecommendedService[];
  pricingNote: string | null;
  minimumApplied: { tier: string; floor: number; originalPrice: number } | null;
  clarifyingQuestions?: ClarifyingQuestion[] | null;
}

export interface QuoteLineItem {
  id: string;
  category: string;
  description: string;
  qty: number;
  unitPrice: number;
  isAddon: boolean;
  addonFor?: string | null;
}

export interface QuotePhoto {
  id: string;
  name: string;
  /** full data URI (data:image/jpeg;base64,...) — used for thumbnails and print embeds */
  dataUrl: string;
  mediaType: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface GhlContactMatch {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type StepStatus = "ok" | "skip" | "fail";

export interface SendStepResult {
  status: StepStatus;
  detail?: string;
  id?: string;
}

export interface SendToGhlResult {
  contact: SendStepResult;
  opportunity: SendStepResult;
  estimate: SendStepResult;
  sent: SendStepResult;
  tag: SendStepResult;
}

export interface SendQuotePayload {
  contact: ContactInfo;
  propertyType: PropertyType;
  quoteNumber: string;
  lineItems: Array<{
    name: string;
    description: string;
    qty: number;
    unitPrice: number;
    isAddon: boolean;
  }>;
  discountPercent: number;
  discountReason: string;
  subtotal: number;
  total: number;
}

/** Quote number format RIO-YYYY-MMDD-XX. Generated once per draft and kept
 *  stable (the original app regenerated it at print time — a known bug). */
export function makeQuoteNumber(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const xx = String(Math.floor(Math.random() * 90) + 10);
  return `RIO-${yyyy}-${mm}${dd}-${xx}`;
}
