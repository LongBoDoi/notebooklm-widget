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
  }
}

export const WidgetService = {
  async getConfig(apiUrl: string, embedToken: string): Promise<WidgetConfig> {
    const response = await api.get(`${apiUrl}/widget/${embedToken}/config`)
    return response.data
  },

  async createConversation(apiUrl: string, title: string):Promise<Conversation> {
    const res = await api.post(`${apiUrl}/deployment-conversations`, {
      title
    })
    return res.data as Conversation
  },

  async sendMessage(apiUrl: string, content: string, signal: AbortSignal, conversationId?: number) {
    const res = await originFetcher(`${apiUrl}/deployment-messages`, {
      method: 'POST',
      body: {
        conversationId,
        content
      },
      signal,
    })

    return res
  },

  async getChatHistory(apiUrl: string, sessionId: string, embedToken: string): Promise<{
    conversationId: number,
    messages: ChatMessage[]
  }> {
    const res = await api.get(`${apiUrl}/widget/${embedToken}/conversations/${sessionId}`)
    return res.data
  }
}
