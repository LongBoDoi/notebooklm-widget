import { Textarea } from '@mantine/core'
import { PaperPlaneRightIcon, SquareIcon } from '@phosphor-icons/react'
import { useConfig } from '../context/config-context'
import { cn } from '../lib/utils'
import type { ChatMessage } from '../types/message.type'
import { useChatStream } from '../hooks/useChatStream'
import useConversationsStore from '../stores/conversations.store'
import useMessagesStore from '../stores/messages.store'
import { useInputState } from '@mantine/hooks'
import { WidgetService } from '../services/widget-demo.service'

export default function ChatWidgetFooter() {
  const { config, apiUrl } = useConfig()

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
    if (!text.trim() || !conversationId || isTyping) return

    const abortController = new AbortController()

    resetStream()

    startStream(abortController)

    const userMessage: ChatMessage = {
      clientId: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    }

    addUserMessage(userMessage)

    const emptyAssistantMessage: ChatMessage = {
      clientId: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      typing: true,
      isLastMessage: true,
    }

    addEmptyAssistantMessage(emptyAssistantMessage)

    setScrollMessageId(userMessage.clientId)

    try {
      const response = await WidgetService.sendMessage(
        'https://api.vts-dasc.net',
        text.trim(),
        abortController.signal,
        conversationId
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

      console.error('Error generating response:', error)
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
    <div className={cn(`py-2 px-4`, `border-t flex items-end gap-2`)}
      style={{
        backgroundColor: `${config?.theme?.primaryColor}1A`,
        borderColor: `${config?.theme?.primaryColor}`,
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
              '--input-bd-focus': config?.theme?.primaryColor,
            }
          }
        }
        value={message}
        onChange={setMessage}
        disabled={isTyping}
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
        <SquareIcon weight='fill' className={cn(`cursor-pointer mb-2.5 flex-shrink-0`)} onClick={stopStream} 
          style={{
            color: config?.theme?.primaryColor
          }}
        />
      : <PaperPlaneRightIcon weight="fill" className={cn(`cursor-pointer mb-2.5 flex-shrink-0`)} onClick={() => sendMessage(message)} 
          style={{
            color: config?.theme?.primaryColor
          }}
        />}
    </div>
  )
}
