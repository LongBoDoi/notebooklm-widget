import { useCallback } from 'react'
import useMessagesStore from '../stores/messages.store'
import { type Citation as CitationType } from '../types/citation.type'

export const useChatStream = () => {
  const { updateMessage, setIsTyping, setPreviousMessageId } = useMessagesStore()

  const processStream = useCallback(
    async (response: Response, assistantMessageId: string, userMessageId: string) => {
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''
      let content = ''
      let reasoning: string[] = []

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          buffer += chunk

          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '' || !line.startsWith('data: ')) continue

            try {
              const data = JSON.parse(line.slice(5))

              if (data.choices?.[0]?.message?.content?.includes('Error from rag server')) {
                throw new Error('RAG server error')
              }

              // Handle delta content
              const deltaContent = data.choices?.[0]?.delta?.content
              if (deltaContent) {
                if (data.choices?.[0]?.delta.role === 'system') {
                  reasoning = [...reasoning, deltaContent]

                  // Update message reasoning
                  updateMessage(assistantMessageId, { reasoning, showReasoning: true })
                } else {
                  content += deltaContent

                  // Update message content
                  updateMessage(assistantMessageId, { content })
                }
              }

              if (data.tempMessage?.id) {
                updateMessage(assistantMessageId, { id: data.tempMessage.id })
                updateMessage(userMessageId, { id: data.tempMessage.id })
              }

              if (data.citations?.results) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const citationsData = data.citations?.results.map((citation: any) => ({
                  content: citation.content,
                  source: citation.document_name,
                  documentType: citation.document_type as CitationType['documentType'],
                  score: citation.score,
                  metadata: citation.metadata,
                  contextId: citation.context_id,
                  type: citation.citation_type as CitationType['type'],
                }))

                if (citationsData.length > 0) {
                  updateMessage(assistantMessageId, {
                    citations: citationsData,
                  })
                }
              }

              if (data.suggestions) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const suggestions = data.suggestions.filter((item: any) => typeof item === 'string')

                updateMessage(assistantMessageId, {
                  suggestions: suggestions,
                })
              }

              // Handle stream completion
              if (data.choices?.[0]?.finish_reason === 'stop') {
                setIsTyping(false)

                updateMessage(assistantMessageId, {
                  typing: false,
                  aiId: data.id,
                  showReasoning: false,
                })

                setPreviousMessageId(data.id)

                if (data.usage) {
                  updateMessage(assistantMessageId, {
                    usageTotalTokens: data.usage.total_tokens,
                    usageInputTokens: data.usage.prompt_tokens,
                    usageOutputTokens: data.usage.completion_tokens,
                  })

                  updateMessage(userMessageId, {
                    usageTotalTokens: data.usage.total_tokens,
                    usageInputTokens: data.usage.prompt_tokens,
                    usageOutputTokens: data.usage.completion_tokens,
                  })
                }

                break
              }
            } catch (parseError) {
              console.error('Error parsing stream data:', parseError)
              if (!(parseError instanceof SyntaxError)) {
                throw parseError
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error)
        throw error
      } finally {
        reader.releaseLock()
        setIsTyping(false)

        updateMessage(assistantMessageId, {
          typing: false,
          error: content ? '' : 'Không thể xử lý yêu cầu',
        })
      }
    },
    [],
  )

  return {
    processStream,
  }
}
