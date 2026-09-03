export declare const TEST_RUN_TAG: string;

export declare function isTestEmail(email?: string | null): boolean;

export interface TestRunPlan {
  isTest: boolean;
  /** Why it was treated as a test — "dry run" or "test email address". */
  reason?: string;
  /** The caller's tags, with the test tag appended when it applies. */
  tags: string[];
  /** False on a test run: no pipeline card, ever. */
  createOpportunity: boolean;
}

export declare function testRunPlan(opts: {
  dryRun: boolean;
  email?: string;
  tags?: string[];
}): TestRunPlan;
