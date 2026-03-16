
import { createContext, useContext } from 'react'
import type { CitationInline } from '../components/markdown/remark-citation.plugin'

export const CitationContext = createContext<CitationInline[]>([])

export function useCitations() {
  return useContext(CitationContext)
}
