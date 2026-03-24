import { createContext, useContext, useEffect, type ReactNode } from "react";
import { LocalStorageKey } from "../constants/LocalStorageKey";
import { WidgetService } from "../services/widget.service";
import useConversationsStore from "../stores/conversations.store";
import type { Conversation } from "../types/conversation.type";
import useMessagesStore from "../stores/messages.store";
import { useConfig } from "./config-context";
import { useMutation } from "@tanstack/react-query";

interface SessionContextType {
    creatingNewSession: boolean
}

const SessionContext = createContext<SessionContextType>({} as SessionContextType)
export const useSession = () => useContext<SessionContextType>(SessionContext)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const {setSelectedConversation, setSelectedConversationId} = useConversationsStore()
    const {setMessages} = useMessagesStore()

    const { embedToken } = useConfig()

    const createNewSessionMutation = useMutation({
        mutationFn: async () => {
            const data = await WidgetService.createConversation(embedToken)
            return data
        },
        onSuccess: (data) => {
            setSelectedConversation(data)
            setSelectedConversationId(data.id)

            localStorage.setItem(LocalStorageKey.SESSION_ID, data.sessionId)
            localStorage.setItem(LocalStorageKey.EMBED_TOKEN, embedToken)

            setMessages([])
        },
        onError: () => {
            console.error('OfficeMate Chatbot Agent: Có lỗi xảy ra khi tạo phiên mới. Vui lòng thử lại!')
        }
    })

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'CREATE_NEW_SESSION') {
                createNewSessionMutation.mutate()
            }
        }

        window.addEventListener('message', handleMessage)

        const sessionId = localStorage.getItem(LocalStorageKey.SESSION_ID)
        const storedEmbedToken = localStorage.getItem(LocalStorageKey.EMBED_TOKEN)

        if (!embedToken || embedToken !== storedEmbedToken) {
            createNewSessionMutation.mutate()
            return
        }

        if (sessionId) {
            WidgetService.getChatHistory(sessionId, embedToken).then((data) => {
                setSelectedConversation({
                    id: data.conversationId
                } as Conversation)
                setSelectedConversationId(data.conversationId)
                setMessages(data.messages)
            }).catch(() => {
                createNewSessionMutation.mutate()
            })
        } else {
            createNewSessionMutation.mutate()
        }

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    return (
        <SessionContext.Provider value={{ creatingNewSession: createNewSessionMutation.isPending }}>
            {children}
        </SessionContext.Provider>
    )
}