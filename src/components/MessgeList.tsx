import MessageItem from './MessageItem'
import useMessagesStore from '../stores/messages.store'
import { CaretDoubleDownIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { Button, Center, ScrollArea, Transition } from '@mantine/core'
import { useConfig } from '../context/config-context'
import { useElementSize, useInViewport } from '@mantine/hooks'
import useConversationsStore from '../stores/conversations.store'
import { api } from '../lib/axios'

export default function MessageList() {
  const { messages, loading, enableScrollToBottom, isTyping, resetStore, setMessages } =
    useMessagesStore()
  const {config} = useConfig()

  const {selectedConversationId} = useConversationsStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: 'auto' | 'smooth' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (!loading && enableScrollToBottom) {
      scrollToBottom('auto')
    }
  }, [loading])

  useEffect(() => {
    resetStore()

    if (selectedConversationId) {
      api.get(`https://api.vts-dasc.net/deployment-messages`, {
        params: {
          conversationId: selectedConversationId,
          length: 100
        }
      }).then((res) => setMessages(res.data.results.flatMap((msg: any) => [
                  {
                    ...msg,
                    clientId: crypto.randomUUID(),
                    role: 'user' as const,
                    content: msg.userMessage ?? '',
                  },
                  {
                    ...msg,
                    clientId: crypto.randomUUID(),
                    role: 'assistant' as const,
                    content: msg.assistantMessage ?? '',
                  },
                ])))
    }
  }, [selectedConversationId])

  // useEffect(() => {
  //   if (scrollMessageId) {
  //     const messageElement = document.getElementById(`message-${scrollMessageId}`)

  //     if (messageElement) {
  //       messageElement.scrollIntoView({ behavior: 'smooth' })
  //     }
  //   }
  // }, [scrollMessageId])

  const { ref: viewportRef, height } = useElementSize()

  useEffect(() => {
    if (isTyping) {
      scrollToBottom('smooth')
    }
  }, [isTyping, height])

  const { ref: displayScrollBottomRef, inViewport} = useInViewport()

  // const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
  //   if (autoScroll.current) return

  //   const dom = event.target as HTMLDivElement
  //   const scrollPosition = dom.scrollHeight - dom.scrollTop
  //   if (scrollPosition > 3000) {
  //     setShowScrollToBottomButton(true)
  //   } else if (scrollPosition <= dom.clientHeight + 10) {
  //     setShowScrollToBottomButton(false)
  //   }
  // }

  return (
    <ScrollArea.Autosize
      scrollHideDelay={0}
      scrollbarSize={8}
      type='auto'
      // onScrollCapture={handleScroll}
      // onScrollEndCapture={() => (autoScroll.current = false)}
      // threshold={10}
    >
      <div className="flex flex-col gap-2 p-4 relative w-full" 
      ref={viewportRef}>
        {config?.welcomeMessage && <MessageItem
          message={{
            role: 'assistant',
            content: config.welcomeMessage
          }}
        />}

        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}

        <div ref={messagesEndRef} />

        <div className='absolute bottom-[3000px] h-full' ref={displayScrollBottomRef}>
        </div>
      </div>

      <Center className='absolute bottom-[12px] w-full'>
        <Transition transition="slide-up" mounted={inViewport}>
          {(transitionStyles) => (
            
            <Button color={config?.theme?.primaryColor} leftSection={<CaretDoubleDownIcon weight="bold" />} onClick={() => scrollToBottom('smooth')} style={transitionStyles}
            className='!text-white'>
              Đi tới hiện tại
            </Button>
          )}
        </Transition>
      </Center>
    </ScrollArea.Autosize>
  )
}
