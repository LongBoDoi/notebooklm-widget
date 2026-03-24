import { RobotIcon, XIcon } from '@phosphor-icons/react'
import { useConfig } from '../context/config-context'
import { Box } from '@mantine/core'
import { BlurhashImage } from './BlurhashImage'
import { cn } from '../lib/utils'

export default function ChatWidgetHeader(props: { onClose?: () => void }) {
  const {
    config
  } = useConfig()

  return (
    <Box className="px-4 py-2 gap-2 flex items-center text-white shadow-xl border-b border-white bg-gradient-to-r from-[var(--widget-primary-color)] to-[var(--widget-secondary-color)]"
      style={{
        '--widget-primary-color': config.theme.primaryColor,
        '--widget-secondary-color': config.theme.secondaryColor
      }}
    >
      {config.avatarUrl ? 
        <BlurhashImage
          className={cn("w-8 h-8 rounded-full overflow-hidden")}
          ratio={1}
          blurhash={config.avatarUrl}
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
      <span className="font-bold" style={
        {
          color: config.theme.titleTextColor
        }
      }>{config.title}</span>

      <XIcon
        className={`flex-shrink-0 p-1 cursor-pointer rounded-full ml-auto transition-all`}
        size={24}
        weight="bold"
        onClick={props.onClose}
      />
    </Box>
  )
}
