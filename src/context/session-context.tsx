import { createContext, useContext, useEffect, type ReactNode } from "react";
import { LocalStorageKey } from "../constants/LocalStorageKey";
import { WidgetService } from "../services/widget.service";
import useConversationsStore from "../stores/conversations.store";
import type { Conversation } from "../types/conversation.type";
import useMessagesStore from "../stores/messages.store";
import { useConfig } from "./config-context";

interface SessionContextType {
}

const SessionContext = createContext<SessionContextType>({} as SessionContextType)
export const useSession = () => useContext<SessionContextType>(SessionContext)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const {setSelectedConversation, setSelectedConversationId} = useConversationsStore()
    const {setMessages} = useMessagesStore()

    const { embedToken, apiUrl } = useConfig()

    const createNewSession = async () => {
        localStorage.removeItem(LocalStorageKey.SESSION_ID)
        localStorage.removeItem(LocalStorageKey.EMBED_TOKEN)
        setSelectedConversation(null)
        setSelectedConversationId(null)
        setMessages([])

        const data = await WidgetService.createConversation(apiUrl, embedToken)
        setSelectedConversation(data)
        setSelectedConversationId(data.id)

        localStorage.setItem(LocalStorageKey.SESSION_ID, data.sessionId)
        localStorage.setItem(LocalStorageKey.EMBED_TOKEN, embedToken)
    }

    useEffect(() => {
        if (window.OfficeMateChatbotConfig) {
            window.OfficeMateChatbotConfig.createNewSession = createNewSession
        }

        const sessionId = localStorage.getItem(LocalStorageKey.SESSION_ID)
        const embedToken = localStorage.getItem(LocalStorageKey.EMBED_TOKEN)

        if (!embedToken || embedToken !== embedToken) {
            createNewSession()
            return
        }

        if (sessionId) {
            WidgetService.getChatHistory(apiUrl, sessionId, embedToken).then((data) => {
                setSelectedConversation({
                    id: data.conversationId
                } as Conversation)
                setSelectedConversationId(data.conversationId)
                setMessages(data.messages)
            }).catch(() => {
                createNewSession()
            })
        } else {
            createNewSession()
        }
    }, [])

    return children
}