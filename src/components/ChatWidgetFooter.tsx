import { Box, Textarea } from '@mantine/core'
import { PaperPlaneRightIcon, SquareIcon } from '@phosphor-icons/react'
import { useConfig } from '../context/config-context'
import { cn } from '../lib/utils'
import { WidgetService } from '../services/widget.service'
import { LocalStorageKey } from '../constants/LocalStorageKey'
import type { ChatMessage } from '../types/message.type'
import { useChatStream } from '../hooks/useChatStream'
import useConversationsStore from '../stores/conversations.store'
import useMessagesStore from '../stores/messages.store'
import { useInputState } from '@mantine/hooks'
import { v4 as uuid } from 'uuid'
import { useSession } from '../context/session-context'

export default function ChatWidgetFooter() {
  const { config, embedToken } = useConfig()
  const { creatingNewSession } = useSession()

  const [message, setMessage] = useInputState('')
  
  const setIsTyping = useMessagesStore((s) => s.setIsTyping)
  const isTyping = useMessagesStore((s) => s.isTyping)
  const startStream = useMessagesStore((s) => s.startStream)
  const resetStream = useMessagesStore((s) => s.resetStream)
  const stopStream = useMessagesStore((s) => s.stopStream)
  const addUserMessage = useMessagesStore((s) => s.addUserMessage)
  const addEmptyAssistantMessage = useMessagesStore((s) => s.addEmptyAssistantMessage)
  const updateMessage = useMessagesStore((s) => s.updateMessage)
  const setScrollMessageId = useMessagesStore((s) => s.setScrollMessageId)

  const selectedConversation = useConversationsStore((s) => s.selectedConversation)

  const conversationId = selectedConversation?.id

  const { processStream } = useChatStream()

  const sendMessage = async (text: string) => {
    if (!text.trim() || !conversationId || isTyping || creatingNewSession) return

    const abortController = new AbortController()

    resetStream()

    startStream(abortController)

    const userMessage: ChatMessage = {
      clientId: uuid(),
      role: 'user',
      content: text.trim(),
    }

    addUserMessage(userMessage)

    const emptyAssistantMessage: ChatMessage = {
      clientId: uuid(),
      role: 'assistant',
      content: '',
      typing: true,
      isLastMessage: true,
    }

    addEmptyAssistantMessage(emptyAssistantMessage)

    setScrollMessageId(userMessage.clientId)

    try {
      const response = await WidgetService.sendMessage(
        text.trim(),
        localStorage.getItem(LocalStorageKey.SESSION_ID) || '',
        abortController.signal,
        embedToken,
      )

      setMessage('')

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json()
          if (data.code === 'USAGE_LIMIT_EXCEEDED') {
            // toast.warning('Thông báo!', {
            //   description: ErrorCodes[ErrorCodeKeys.USAGE_LIMIT_EXCEEDED],
            //   position: 'top-center',
            //   duration: 10000,
            //   closeButton: true,
            // })
          }
        }

        setIsTyping(false)

        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await processStream(
        response,
        emptyAssistantMessage.clientId as string,
        userMessage.clientId as string,
      )
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        updateMessage(emptyAssistantMessage.clientId as string, {
          typing: false,
          error: 'Yêu cầu đã bị hủy',
        })
        return
      }

      console.error('OfficeMate Chatbot Agent: Error generating response:', error)
      updateMessage(emptyAssistantMessage.clientId as string, {
        content: '',
        typing: false,
        error: 'Đã xảy ra lỗi khi tạo phản hồi',
      })
    } finally {
      setMessage('')
    }
  }

  // useEffect(() => {
  //   if (suggestion) {
  //     sendMessage(suggestion)

  //     setSuggestion('')
  //   }
  // }, [suggestion])

  // useEffect(() => {
  //   if (tempMessage) {
  //     const timeout = setTimeout(() => {
  //       sendMessage(tempMessage)

  //       setTempMessage(null)
  //     }, 500)

  //     return () => clearTimeout(timeout)
  //   }
  // }, [])

  // Auto focus when component mounts
  // useEffect(() => {
  //   if (textareaRef.current) {
  //     textareaRef.current.focus()
  //   }
  // }, [conversationId])

  return (
    <Box className={cn(`py-2 px-4`, `border-t flex items-end gap-2 bg-gradient-to-r from-[var(--widget-primary-color)] to-[var(--widget-secondary-color)]`)}
      style={{
        borderColor: `oklch(0.922 0 0)`,
        '--widget-primary-color': `${config.theme.titlePrimaryColor}1A`,
        '--widget-secondary-color': `${config.theme.titleSecondaryColor}1A`
      }}
    >
      <Textarea
        autosize
        autoFocus
        rows={1}
        maxRows={6}
        resize="none"
        radius='lg'
        placeholder="Nhập tin nhắn của bạn..."
        classNames={{
          root: `flex-1`,
        }}
        styles={
          {
            input: {
              '--input-bd': 'oklch(0.922 0 0)',
              '--input-bd-focus': 'oklch(0.922 0 0)',
              '--input-placeholder-color': 'oklch(0.556 0 0)',
            }
          }
        }
        value={message}
        onChange={setMessage}
        disabled={isTyping || creatingNewSession}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const message = (e.currentTarget as HTMLTextAreaElement).value.trim()
            if (message) {
              sendMessage(message)
            }
          }
        }}
      />

      {isTyping ? 
        <SquareIcon weight='fill' className={cn(`cursor-pointer flex-shrink-0`)} onClick={stopStream} 
          size={20}
          style={{
            color: config.theme.titleSecondaryColor,
            marginBottom: 8
          }}
        />
      : <PaperPlaneRightIcon weight="fill" className={cn(`cursor-pointer flex-shrink-0`)} onClick={() => sendMessage(message)}
          size={20}
          style={{
            color: config.theme.titleSecondaryColor,
            opacity: creatingNewSession ? 0.7 : 1,
            marginBottom: 8
          }}
        />}
    </Box>
  )
}
