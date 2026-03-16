import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

import type { Conversation } from '../types/conversation.type'
import type { Citation } from '../types/citation.type'

// 1. State type
export type State = {
  tempMessage: string | null
  conversations: Conversation[]
  selectedConversationId: number | null
  selectedConversation: Conversation | null
  loading: boolean
  error: string | null
  createLoading: boolean
  createError: string | null
  canLoadMore: boolean
  rightPanelLayout: 'normal' | 'expanded' | 'collapsed'
  showDocumentDetail: boolean
  activeDocumentTab: 'summary' | 'keywords' | 'ingest'
  selectedCitation: Citation | null
}

// 2. Initial state
export const initialState: State = {
  tempMessage: null,
  conversations: [],
  selectedConversation: null,
  selectedConversationId: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  canLoadMore: true,
  rightPanelLayout: 'normal',
  showDocumentDetail: false,
  activeDocumentTab: 'summary',
  selectedCitation: null,
}

// 3. Action type
export type Action = {
  setTempMessage: (message: string | null) => void
  addConversation: (conversation: Conversation) => void
  setConversations: (conversations: Conversation[]) => void
  setSelectedConversation: (conversation: Conversation | null) => void
  setSelectedConversationId: (conversationId: number | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  deleteConversation: (conversationId: number) => Promise<void>
  setRightPanelLayout: (layout: 'normal' | 'expanded' | 'collapsed') => void
  setShowDocumentDetail: (show: boolean) => void
  setActiveDocumentTab: (tab: 'summary' | 'keywords' | 'ingest') => void
  setSelectedCitation: (citation: Citation | null) => void
  resetStore: () => void
}

// 4. Action implementation
export const createActions = (
  set: (
    fn: (state: State & Action) => void,
    shouldReplace?: false | undefined,
    actionName?: string,
  ) => void,
): Action => ({
  setTempMessage: (message) =>
    set(
      (state) => {
        state.tempMessage = message
      },
      false,
      'setTempMessage',
    ),

  addConversation: (conversation) =>
    set(
      (state) => {
        state.conversations.unshift(conversation)
      },
      false,
      'addConversation',
    ),

  setConversations: (conversations) =>
    set(
      (state) => {
        state.conversations = conversations
      },
      false,
      'setConversations',
    ),

  setSelectedConversation: (conversation) =>
    set(
      (state) => {
        state.selectedConversation = conversation
        state.selectedConversationId = conversation?.id ?? null
      },
      false,
      'setSelectedConversation',
    ),

  setSelectedConversationId: (conversationId) =>
    set(
      (state) => {
        state.selectedConversationId = conversationId
      },
      false,
      'setSelectedConversationId',
    ),

  setLoading: (loading) =>
    set(
      (state) => {
        state.loading = loading
      },
      false,
      'setLoading',
    ),
  setError: (error) =>
    set(
      (state) => {
        state.error = error
      },
      false,
      'setError',
    ),

  deleteConversation: async (conversationId: number) => {
    console.log('Deleting conversation with ID:', conversationId)
    // set(
    //   (state) => {
    //     state.conversations = state.conversations.filter((c) => c.id !== conversationId)

    //     if (state.selectedConversation?.id === conversationId) {
    //       state.selectedConversation = null
    //     }
    //   },
    //   false,
    //   'deleteConversation:success',
    // )

    // try {
    //   await ConversationService.delete(conversationId)
    // } catch {}
  },

  setRightPanelLayout: (layout) =>
    set((state) => {
      state.rightPanelLayout = layout
    }),

  setShowDocumentDetail: (show) =>
    set((state) => {
      state.showDocumentDetail = show
    }),

  setActiveDocumentTab: (tab) =>
    set((state) => {
      state.activeDocumentTab = tab
    }),

  setSelectedCitation: (citation) =>
    set((state) => {
      state.selectedCitation = citation
    }),

  resetStore: () =>
    set(
      (state) => {
        Object.assign(state, initialState)
      },
      false,
      'resetStore',
    ),
})

const useConversationsStore = create<State & Action>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        ...initialState,
        ...createActions(set),
      })),
    ),
    {
      name: 'ConversationsStore',
    },
  ),
)

export default useConversationsStore
