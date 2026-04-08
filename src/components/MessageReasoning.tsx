

import removeMd from 'remove-markdown'
import truncate from 'lodash/truncate'
import { marked } from 'marked'
import { LightbulbFilamentIcon } from '@phosphor-icons/react'
import type { ChatMessage } from '../types/message.type'
import { cn } from '../lib/utils'
import { Accordion } from '@mantine/core'

interface MessageItemProps {
  message: ChatMessage
}

export default function MessageReasoning({ message }: MessageItemProps) {
  if (message.role !== 'assistant' || !message.reasoning || message.reasoning.length === 0)
    return null

  const subText = truncate(removeMd(message.reasoning[message.reasoning.length - 1]), {
    length: 50,
    separator: ' ',
  })

  return (
      <Accordion chevron={null} className='mb-4'>
        <Accordion.Item value="item-1">
          <Accordion.Control className="group focus-visible:ring-0 [&>svg]:hidden !px-0 !bg-transparent">
            <p
              className={cn(
                'text-sm flex items-center gap-2',
                message.typing ? 'text-shimmer' : 'text-gray-500 group-hover:text-gray-700',
              )}
            >
              <LightbulbFilamentIcon
                size={18}
                weight="duotone"
                className="text-gray-500 group-hover:text-gray-700"
              />
              <span>Quá trình suy luận {message.showReasoning ? `:${subText}` : ''}</span>
            </p>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-col space-y-2 relative ml-3">
              <div className="absolute left-0 top-4 bottom-0 border-l-1"></div>
              {(message.reasoning || []).map((reasoning, index) => (
                <div className="relative pl-5 last:pb-0" key={index}>
                  <div className="absolute h-1.5 w-1.5 -translate-x-1/2 left-px top-3 rounded-full bg-gray-500"></div>
                  <div className="space-y-1">
                    <div
                      className="prose prose-sm max-w-none prose-strong:text-gray-500"
                      dangerouslySetInnerHTML={{ __html: marked.parse(reasoning) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
  )
}
