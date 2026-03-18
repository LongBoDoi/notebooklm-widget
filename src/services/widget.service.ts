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
    width: number
    height: number
  }
}

export const WidgetService = {
  async getConfig(apiUrl: string, embedToken: string): Promise<WidgetConfig> {
    const response = await api.get(`${apiUrl}/widget/${embedToken}/config`)
    return response.data
  },

  async createConversation(apiUrl: string, embedToken: string):Promise<Conversation & {sessionId: string}> {
    const res = await api.post(`${apiUrl}/widget/${embedToken}/conversations`)
    return {
      id: res.data.conversationId,
      sessionId: res.data.sessionId,
    } as Conversation & {sessionId: string}
  },

  async sendMessage(apiUrl: string, message: string, sessionId: string, signal: AbortSignal, embedToken: string) {
    const res = await originFetcher(`${apiUrl}/widget/${embedToken}/messages`, {
      method: 'POST',
      body: {
        message,
        sessionId
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
