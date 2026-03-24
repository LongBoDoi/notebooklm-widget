import { api } from '../lib/axios'
import { originFetcher } from '../lib/fetcher'
import type { Conversation } from '../types/conversation.type'
import type { ChatMessage } from '../types/message.type'

export interface WidgetConfig {
  avatarUrl: string
  title: string
  welcomeMessage: string
  position: 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
  theme: {
    primaryColor: string
    secondaryColor: string
    userTextColor: string
    assistantTextColor: string
    titleTextColor: string
    width: number
    height: number
  }
}

export const WidgetService = {
  async getConfig(embedToken: string): Promise<WidgetConfig> {
    const response = await api.get(`/widget/${embedToken}/config`)
    return response.data
  },

  async createConversation(embedToken: string):Promise<Conversation & {sessionId: string}> {
    const res = await api.post(`/widget/${embedToken}/conversations`)
    return {
      id: res.data.conversationId,
      sessionId: res.data.sessionId,
    } as Conversation & {sessionId: string}
  },

  async sendMessage(message: string, sessionId: string, signal: AbortSignal, embedToken: string) {
    const res = await originFetcher(`/widget/${embedToken}/messages`, {
      method: 'POST',
      body: {
        message,
        sessionId
      },
      signal,
    })

    return res
  },

  async getChatHistory(sessionId: string, embedToken: string): Promise<{
    conversationId: number,
    messages: ChatMessage[]
  }> {
    const res = await api.get(`/widget/${embedToken}/conversations/${sessionId}`)
    return res.data
  }
}
