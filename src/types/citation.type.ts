export const DocumentType = {
  text: 0,
  image: 1,
  table: 2,
  chart: 3,
} as const

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]

export const CitationType = {
  legacy: 'legacy',
  inline: 'inline',
} as const

export type CitationType = (typeof CitationType)[keyof typeof CitationType]

export interface Citation {
  id: number
  messageId: number
  documentId: number
  content: string
  source: string
  documentType: DocumentType
  score?: number
  url?: string
  contextId: string
  type: CitationType
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  metadata?: Record<string, any>
  updatedAt: Date
  createdAt: Date
}
