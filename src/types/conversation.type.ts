export interface Conversation {
  id: number
  title: string
  userId: number
  notebookId: number
  dataSourceType: 'document' | 'system' | 'general'
  createdAt: Date
  updatedAt: Date
  isAttempted?: boolean
}
