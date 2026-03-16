import { Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { RobotIcon } from '@phosphor-icons/react'
import ChatWidgetHeader from './ChatWidgetHeader'
import ChatWidgetFooter from './ChatWidgetFooter'
import { ConfigProvider, useConfig } from '../context/config-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from '../context/session-context'
import MessageList from './MessgeList'

export default function ChatWidget({ embedToken, apiUrl }: { embedToken?: string, apiUrl?: string }) {
  return (
    embedToken && apiUrl && (
      <QueryClientProvider client={new QueryClient()}>
        <ConfigProvider embedToken={embedToken} apiUrl={apiUrl}>
          <SessionProvider>
            <MainContent />
          </SessionProvider>
        </ConfigProvider>
      </QueryClientProvider>
    )
  )
}

function MainContent() {
  const [isOpen, { open, close }] = useDisclosure(false)
  const {config} = useConfig()

  return config && config.theme && <Menu
    position="left-end"
    closeOnClickOutside={false}
    opened={isOpen}
    onOpen={open}
    onClose={close}
    withinPortal={false}
    radius='lg'
  >
    <Menu.Target>
      <RobotIcon
        size={64}
        className={`bg-white rounded-full p-4 flex-shrink-0 border cursor-pointer fixed bottom-4 shadow-lg`}
        style={
          {
            color: config.theme.primaryColor,
            borderColor: config.theme.primaryColor,
            ...(config.position === 'BOTTOM_LEFT' && { left: 16 }),
            ...(config.position === 'BOTTOM_RIGHT' && { right: 16 }),
          }
        }
      />
    </Menu.Target>
    <Menu.Dropdown className={`absolute border text-foreground rounded-md !w-sm !h-[400px] border shadow-lg !p-0 overflow-hidden flex flex-col !shadow-lg`}
      style={{
        borderColor: config.theme.primaryColor,
      }}
    >
      <ChatWidgetHeader onClose={close} />
      <MessageList />
      <ChatWidgetFooter />
    </Menu.Dropdown>
  </Menu>
}