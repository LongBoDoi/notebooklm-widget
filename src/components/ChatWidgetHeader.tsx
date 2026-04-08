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
    <Box className="px-4 py-2 gap-2 flex items-center text-white shadow-lg border-b bg-gradient-to-r from-[var(--widget-primary-color)] to-[var(--widget-secondary-color)]"
      style={{
        '--widget-primary-color': config.theme.titlePrimaryColor,
        '--widget-secondary-color': config.theme.titleSecondaryColor,
        borderColor: 'oklch(0.922 0 0)',
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
          className={`p-2 bg-white rounded-full flex-shrink-0 border`}
          style={{
            color: '#ef0604',
            borderColor: 'oklch(0.922 0 0)'
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
        style={{
          color: config.theme.titleTextColor
        }}
      />
    </Box>
  )
}
