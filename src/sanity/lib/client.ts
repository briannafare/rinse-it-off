import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * Published reads only. New Sanity projects gate document reads behind roles
 * (no anonymous role), so a "public" dataset still returns nothing without a
 * token. SANITY_API_READ_TOKEN is a Viewer token set in Vercel; every importer
 * of this module is server-side, so it never reaches the browser.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN,
})
