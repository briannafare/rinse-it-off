import type { RecommendedService } from "./types";

export declare const MINIMUM_FLOORS: {
  driveway: number;
  commercial: number;
  general: number;
};

export declare const DRIVEWAY_MINIMUM_NOTE: string;

export declare function applyTieredMinimums(rawServices: RecommendedService[]): {
  services: RecommendedService[];
  pricingNote: string | null;
  applied: { tier: string; floor: number; originalPrice: number } | null;
};
