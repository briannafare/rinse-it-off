import type { Metadata } from 'next'

/**
 * Route config and metadata live here because page.tsx must be a Client
 * Component (see the note there).
 */
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Rinse It Off Blog Studio',
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
