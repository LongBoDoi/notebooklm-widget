import type { Citation } from "./citation.type"

export interface Message {
  id: number
  conversationId: number
  notebookId: number
  userId: number
  aiId?: string
  previousMessageId?: string
  instruction?: string
  userMessage: string
  assistantMessage?: string
  model?: string
  usageInputTokens?: number
  usageOutputTokens?: number
  usageTotalTokens?: number
  citations?: Partial<Citation>[]
  suggestions?: string[]
  reasoning?: string[]
  showReasoning?: boolean
  updatedAt: Date
  createdAt: Date
}

export interface ChatMessage extends Partial<Message> {
  clientId?: string
  role: 'user' | 'assistant'
  content: string
  typing?: boolean
  error?: string
  isHelpful?: boolean
  feedback?: string
  isLastMessage?: boolean
}