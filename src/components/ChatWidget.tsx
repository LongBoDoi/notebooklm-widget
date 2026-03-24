import { useDisclosure } from '@mantine/hooks'
import { RobotIcon } from '@phosphor-icons/react'
import ChatWidgetHeader from './ChatWidgetHeader'
import ChatWidgetFooter from './ChatWidgetFooter'
import { ConfigProvider, useConfig } from '../context/config-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from '../context/session-context'
import MessageList from './MessgeList'
import { BlurhashImage } from './BlurhashImage'
import { useEffect } from 'react'
import { Box } from '@mantine/core'

export default function ChatWidget({ embedToken }: { embedToken?: string }) {
  return (
    embedToken && (
      <QueryClientProvider client={new QueryClient()}>
        <ConfigProvider embedToken={embedToken}>
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
  const {config } = useConfig()

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const type = event.data?.type

      switch (type) {
      case 'OPEN':
        open()
        window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { width: `${config.theme.width || 320}px`, height: `${config.theme.height || 450}px` } }, '*')
        break
      case 'CLOSE':
        close()
        window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { width: '48px', height: '48px' } }, '*')
        break
      default:
        break
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return config && config.theme && (
    isOpen ? <Box className={`border bg-white text-foreground rounded-lg border overflow-hidden flex flex-col`}
      style={{
        borderColor: config.theme.primaryColor,
        width: config.theme.width || 320,
        height: config.theme.height || 450,
      }}
    >
      <ChatWidgetHeader onClose={() => {
        close()
        window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { width: '48px', height: '48px' } }, '*')
      }} />
      <MessageList />
      <ChatWidgetFooter />
    </Box> 
      : <div onClick={() => {
        open()
        window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { width: `${config.theme.width || 320}px`, height: `${config.theme.height || 450}px` } }, '*')
      }}>
        {config.avatarUrl ? <BlurhashImage blurhash={config.avatarUrl} className='w-12 h-12 rounded-full overflow-hidden' ratio={1} />
          :<RobotIcon
          size={48}
          className={`bg-white rounded-full p-2 flex-shrink-0 border cursor-pointer`}
          style={
            {
              color: config.theme.primaryColor,
              borderColor: config.theme.primaryColor
            }
          }
        />}
      </div>
  )

  // return config && config.theme && <Menu
  //   position="left-end"
  //   closeOnClickOutside={false}
  //   opened={isOpen}
  //   onOpen={open}
  //   onClose={close}
  //   withinPortal={false}
  //   radius='lg'
  // >
  //   <Menu.Target>
  //     <RobotIcon
  //       size={64}
  //       className={`bg-white rounded-full p-4 flex-shrink-0 border cursor-pointer fixed bottom-4 shadow-lg`}
  //       style={
  //         {
  //           color: config.theme.primaryColor,
  //           borderColor: config.theme.primaryColor,
  //           ...(config.position === 'BOTTOM_LEFT' && { left: 16 }),
  //           ...(config.position === 'BOTTOM_RIGHT' && { right: 16 }),
  //         }
  //       }
  //     />
  //   </Menu.Target>
  //   <Menu.Dropdown className={`absolute border text-foreground rounded-md border shadow-lg !p-0 overflow-hidden flex flex-col !shadow-lg`}
  //     style={{
  //       borderColor: config.theme.primaryColor,
  //       width: config.theme.width || 320,
  //       height: config.theme.height || 450,
  //     }}
  //   >
  //     <ChatWidgetHeader onClose={close} />
  //     <MessageList />
  //     <ChatWidgetFooter />
  //   </Menu.Dropdown>
  // </Menu>
}