import 'server-only'
import type { QueryParams } from 'next-sanity'
import { client } from '@/sanity/lib/client'

/**
 * Published reads, cached and refreshed every five minutes. Fails soft: if
 * Sanity is unreachable the blog renders its empty state instead of taking
 * the build down with it.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  fallback,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
  fallback: T
}): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: 300, tags },
    })
    return result ?? fallback
  } catch (err) {
    console.error('[sanityFetch]', err)
    return fallback
  }
}
