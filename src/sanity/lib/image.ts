import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from '@/sanity/env'

const builder = createImageUrlBuilder({ projectId, dataset })

/** Fixed-width helper that always emits a modern format. */
export function imageUrl(source: Image, width: number, height?: number) {
  let b = builder.image(source).auto('format').width(width).quality(82)
  if (height) b = b.height(height).fit('crop')
  return b.url()
}
