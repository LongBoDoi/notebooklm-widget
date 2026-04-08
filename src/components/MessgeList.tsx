import MessageItem from './MessageItem'
import useMessagesStore from '../stores/messages.store'
import { CaretDoubleDownIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { Button, Center, ScrollArea, Transition } from '@mantine/core'
import { useConfig } from '../context/config-context'
import { useElementSize, useInViewport } from '@mantine/hooks'

export default function MessageList() {
  const { messages, loading, enableScrollToBottom, isTyping } =
    useMessagesStore()
  const {config} = useConfig()

  // const selectedConversationId = useConversationsStore((s) => s.selectedConversationId)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: 'auto' | 'smooth' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (!loading && enableScrollToBottom) {
      scrollToBottom('auto')
    }
  }, [loading])

  // useEffect(() => {
  //   resetStore()

  //   if (selectedConversationId) {
  //     loadMoreMessages()
  //   }
  // }, [selectedConversationId])

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
    <ScrollArea
      className='flex-grow-1 flex flex-col items-center relative'
      scrollHideDelay={0}
      scrollbarSize={8}
      type='auto'
      // onScrollCapture={handleScroll}
      // onScrollEndCapture={() => (autoScroll.current = false)}
      // threshold={10}
      
    >
      <div className="flex flex-col gap-4 p-4 relative" 
      ref={viewportRef}>
        {config.welcomeMessage && <MessageItem
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
            
            <Button
              variant='gradient' 
              gradient={{
                from: config.theme.titlePrimaryColor,
                to: config.theme.titleSecondaryColor,
                deg: 90
              }}
              autoContrast
              leftSection={<CaretDoubleDownIcon weight="bold" />} 
              onClick={() => scrollToBottom('smooth')} 
              style={{
                ...transitionStyles,
                borderColor: 'oklch(0.922 0 0)',
                color: config.theme.titleTextColor
              }}
              className='!shadow-lg border'
            >
              Đi tới hiện tại
            </Button>
          )}
        </Transition>
      </Center>
    </ScrollArea>
  )
}
