
import {
  WarningCircleIcon
} from '@phosphor-icons/react'
import { MessageProvider } from '../context/message-context'
import { cn } from '../lib/utils'
import { type ChatMessage } from '../types/message.type'
// import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Box, Loader } from '@mantine/core'
import { useConfig } from '../context/config-context'
import { MessageMarkdownRenderer } from './markdown/MessageMarkdownRenderer'

interface MessageItemProps {
  message: ChatMessage
}

// const CITATION_REGEX_HTML = /&lt;&lt;&lt;context_id[:=]"(.*?)"(?:&gt;){1,5}/g

// async function markdownToPlainText(markdown: string): Promise<ClipboardItem> {
//   // Convert Markdown to HTML
//   const html = await marked.parse(markdown)

//   // Create a temporary element to extract clean plain text
//   const tempElement = document.createElement('div')
//   tempElement.innerHTML = html
//   const plainText = tempElement.innerText

//   return new ClipboardItem({
//     'text/plain': new Blob([plainText], { type: 'text/plain' }),
//     'text/html': new Blob([html], { type: 'text/html' }),
//   })
// }

// function removeCitation(text: string) {
//   return text.replace(CITATION_REGEX_HTML, '')
// }

export default function MessageItem({ message }: MessageItemProps) {
  // const [isHelpful, setIsHelpful] = useState<boolean | undefined>(
  //   get(message, 'isHelpful', undefined),
  // )

  // const [openFeedbackDialog, setOpenFeedbackDialog] = useState<boolean>(false)
  const {config} = useConfig()

  const renderMessageContent = (content: string, isTyping: boolean) => {
    if (isTyping) {
      return (
        <div className='overflow-hidden'>
          <Loader color={config.theme.primaryColor} type='dots' size={24} />
        </div>
      )
    }
    return (
      <div className="max-w-none message-content">
        <MessageMarkdownRenderer content={content} />
      </div>
    )
  }

  // const handleReviewMessage = async (newIsHelpful: boolean) => {
  //   if (isHelpful === newIsHelpful || message.id === undefined) return

  //   try {
  //     await MessageService.reviewMessage(message.id, {
  //       isHelpful: newIsHelpful,
  //     })
  //     toast.success('Gửi đánh giá thành công!')

  //     setIsHelpful(newIsHelpful)
  //   } catch {
  //     toast.error('Có lỗi xảy ra, vui lòng thử lại sau!')
  //   }
  // }

  return (
    <MessageProvider message={message}>
      <div className={cn('flex gap-2',
        message.role === 'user' && 'justify-end',
        message.role === 'assistant' && 'justify-start',
      )}>
      <Box
        className={cn(
          `flex flex-col gap-2 px-4 py-2 rounded-xl shadow-xl`,
          message.role === 'user' && `font-medium rounded-tr-none bg-gradient-to-br from-[var(--widget-primary-color)] to-[var(--widget-secondary-color)]`,
          message.role === 'assistant' && `rounded-tl-none border`,
        )}
        style={{
          maxWidth: 'calc(100% - 40px)',
          borderColor: message.role === 'assistant' ? 'oklch(0.922 0 0)' : undefined,
          '--widget-primary-color': config.theme.primaryColor,
          '--widget-secondary-color': config.theme.secondaryColor,
          color: message.role === 'assistant' ? config.theme.assistantTextColor : config.theme.userTextColor
        }}
        id={`message-${message.clientId}`}
      >
        <div
          className={cn(
            'relative max-w-full text-xs overflow-auto'
          )}
        >
          {/* <MessageReasoning message={message} /> */}

          {message.content
            ? renderMessageContent(message.content, false)
            : message.role === 'assistant' && message.typing
              ? renderMessageContent('', true)
              : message.error
                ? renderMessageContent('Không có nội dung!', false)
                : ''}
        </div>

        {message.error && (
          <div className="flex items-center gap-2 text-red-500">
            <span className="text-xs">{message.error}</span>
            <WarningCircleIcon size={16} />
          </div>
        )}
      </Box>
        
      </div>
    </MessageProvider>
  )
}