export declare const DRY_RUN_ERROR: string;

export interface DepositCheckoutPlan {
  ok: boolean;
  /** Whether the caller may write membership-deposit-sent to the contact. */
  tag: boolean;
  url?: string;
  error?: string;
}

export declare function depositCheckoutPlan(opts: {
  dryRun: boolean;
  base: string;
  id: string;
  email?: string;
  name?: string;
  phone?: string;
}): DepositCheckoutPlan;
