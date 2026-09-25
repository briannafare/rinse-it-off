import { defineCliConfig } from 'sanity/cli'

/**
 * Loaded outside the Next.js module graph, so no "@/" alias and no import of
 * src/sanity/env.ts. The project ID and dataset are public values.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r7qcxvui',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  // Pinned: runtime auto-updates would serve a newer Studio major against this
  // v3-authored config. Upgrade deliberately.
  autoUpdates: false,
})
