import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

/**
 * Consumed by Next.js (embedded Studio at /studio, which inlines NEXT_PUBLIC_*)
 * and by the Sanity CLI (which only inlines SANITY_STUDIO_*). Resolve from both
 * prefixes with a literal fallback. Project ID and dataset are not secrets.
 */
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'r7qcxvui'

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production'

export default defineConfig({
  name: 'rinse-it-off',
  title: 'Rinse It Off Blog',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool({ defaultApiVersion: '2025-02-19' })]
      : []),
  ],
})
