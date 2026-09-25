'use client'

/**
 * Must be a Client Component: the `sanity` package calls React.createContext at
 * module scope, which does not exist under the react-server condition, so
 * importing the config from a Server Component fails the build with
 * "(0 , r.createContext) is not a function".
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
