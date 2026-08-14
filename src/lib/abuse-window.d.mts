export declare const WINDOW_MS: number;
export declare const FLAG_AFTER: number;
export declare const BLOCK_AFTER: number;

export interface WindowVerdict {
  count: number;
  flagged: boolean;
  blocked: boolean;
}

export declare function createWindow(opts?: {
  windowMs?: number;
  flagAfter?: number;
  blockAfter?: number;
}): (key: string, now?: number) => WindowVerdict;
