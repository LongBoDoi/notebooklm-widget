import { type ChatMessage } from '../types/message.type'
import { createContext, useContext } from 'react'

interface MessageContextProps {
  message: ChatMessage
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined)

export const MessageProvider = ({
  message,
  children,
}: React.PropsWithChildren<{ message: ChatMessage }>) => {
  return <MessageContext.Provider value={{ message }}>{children}</MessageContext.Provider>
}

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (!context) throw new Error('useMessage must be used within a MessageProvider')
  return context
}
