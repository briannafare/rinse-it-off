/**
 * Sanity connection values. Project ID and dataset are PUBLIC (they ship in
 * the client bundle by design). Literal fallbacks keep a missing dashboard
 * env var from breaking an otherwise-correct build. Keep in sync with
 * sanity.config.ts.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r7qcxvui'

export const studioUrl = '/studio'
