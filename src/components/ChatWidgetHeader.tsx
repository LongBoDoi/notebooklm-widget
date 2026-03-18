import { RobotIcon, XIcon } from '@phosphor-icons/react'
import { useConfig } from '../context/config-context'
import type { WidgetConfig } from '../services/widget.service'
import { Box } from '@mantine/core'
import { BlurhashImage } from './BlurhashImage'
import { cn } from '../lib/utils'

export default function ChatWidgetHeader(props: { onClose?: () => void }) {
  const {
    config = {
      avatarUrl: '',
      title: 'Chatbot',
      theme: {
        primaryColor: '#ef0604',
      },
    } as WidgetConfig,
  } = useConfig()

  return (
    <Box bg={config.theme?.primaryColor} className="px-4 py-2 gap-2 flex items-center text-white shadow-xl border-b border-white">
      {config.avatarUrl ? 
        <BlurhashImage
          className={cn("w-8 h-8 rounded-full overflow-hidden border")}
          ratio={1}
          blurhash={config.avatarUrl}
          style={{ borderColor: config.theme.primaryColor }}
        />
       : (
        <RobotIcon
          size={32}
          className={`p-2 bg-white rounded-full flex-shrink-0`}
          style={{
            color: config.theme.primaryColor
          }}
        />
      )}
      <span className="font-bold">{config.title}</span>

      <XIcon
        className={`flex-shrink-0 p-1 cursor-pointer rounded-full ml-auto transition-all`}
        size={24}
        weight="bold"
        onClick={props.onClose}
      />
    </Box>
  )
}
