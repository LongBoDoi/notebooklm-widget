import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { ChatMessage } from '../types/message.type'

// 1. State type
export type State = {
  messages: ChatMessage[]
  loading: boolean
  isTyping: boolean
  abortController: AbortController | null
  previousMessageId?: string
  enableScrollToBottom?: boolean
  canLoadMore: boolean
  suggestion: string
  scrollMessageId?: string
}

// 2. Initial state
export const initialState: State = {
  messages: [],
  loading: false,
  isTyping: false,
  abortController: null,
  previousMessageId: undefined,
  enableScrollToBottom: true,
  canLoadMore: true,
  suggestion: '',
  scrollMessageId: undefined,
}

// 3. Action type
export type Action = {
  setMessages: (messages: ChatMessage[]) => void
  addMessage: (message: ChatMessage) => void
  addUserMessage: (chatMessage: ChatMessage) => void
  addEmptyAssistantMessage: (chatMessage: ChatMessage) => void
  updateMessage: (clientId: string, data: Partial<ChatMessage>) => void
  setSuggestion: (suggestion: string) => void
  setScrollMessageId: (messageId?: string) => void
  setIsTyping: (isTyping: boolean) => void
  setPreviousMessageId: (messageId?: string) => void
  resetAbortController: () => void
  startStream: (abortController: AbortController) => void
  resetStream: () => void
  stopStream: () => void
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
  setMessages: (messages) =>
    set(
      (state) => {
        state.messages = messages
      },
      false,
      'setMessages',
    ),
  addMessage: (message) =>
    set(
      (state) => {
        state.messages.push(message)
      },
      false,
      'addMessage',
    ),
  addUserMessage: (chatMessage: ChatMessage) =>
    set(
      (state) => {
        state.messages.push(chatMessage)
      },
      false,
      'addUserMessage',
    ),
  addEmptyAssistantMessage: (chatMessage: ChatMessage) =>
    set(
      (state) => {
        state.messages.push(chatMessage)
        state.isTyping = true
      },
      false,
      'addEmptyAssistantMessage',
    ),
  updateMessage: (clientId, data) =>
    set(
      (state) => {
        const messageIndex = state.messages.findIndex((msg) => msg.clientId === clientId)
        if (messageIndex !== -1) {
          state.messages[messageIndex] = {
            ...state.messages[messageIndex],
            ...data,
          }
        }
      },
      false,
      'updateMessage',
    ),
  setSuggestion: (suggestion) =>
    set(
      (state) => {
        state.suggestion = suggestion
      },
      false,
      'setSuggestion',
    ),
  setScrollMessageId: (messageId) =>
    set(
      (state) => {
        state.scrollMessageId = messageId
      },
      false,
      'setScrollMessageId',
    ),
  setIsTyping: (isTyping) =>
    set(
      (state) => {
        state.isTyping = isTyping
      },
      false,
      'setIsTyping',
    ),
  setPreviousMessageId: (messageId) =>
    set(
      (state) => {
        state.previousMessageId = messageId
      },
      false,
      'setPreviousMessageId',
    ),
  resetAbortController: () =>
    set(
      (state) => {
        state.abortController = new AbortController()
      },
      false,
      'resetAbortController',
    ),
  startStream: (abortController) =>
    set(
      (state) => {
        if (state.messages.length > 0) {
          state.messages[state.messages.length - 1].suggestions = []
          state.messages[state.messages.length - 1].isLastMessage = false
        }

        state.abortController = abortController
        state.isTyping = true
      },
      false,
      'startStream',
    ),
  resetStream: () =>
    set(
      (state) => {
        state.isTyping = false
      },
      false,
      'resetStream',
    ),
  stopStream: () =>
    set(
      (state) => {
        state.abortController?.abort()
        state.isTyping = false
      },
      false,
      'stopStream',
    ),
  resetStore: () =>
    set(
      (state) => {
        Object.assign(state, initialState)
      },
      false,
      'resetStore',
    ),
})

const useMessagesStore = create<State & Action>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        ...initialState,
        ...createActions(set),
      })),
    ),
    {
      name: 'MessagesStore',
    },
  ),
)

export default useMessagesStore
