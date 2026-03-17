import { useMutation } from "@tanstack/react-query";
import MessageList from "../MessgeList";
import { WidgetService } from "../../services/widget-demo.service";
import useConversationsStore from "../../stores/conversations.store";
import { Button } from "@mantine/core";
import ChatWidgetFooter from "../ChatWidgetFooter";

export default function ChatDemo() {
    const {selectedConversation, setSelectedConversation, setSelectedConversationId} = useConversationsStore()

    const createConversationMutation = useMutation({
        mutationFn: async () => {
            const data = await WidgetService.createConversation('https://api.vts-dasc.net', '820b4e80-a92c-4ea8-aadf-aa7b7a27b402')

            setSelectedConversation(data)
            setSelectedConversationId(data.id)

            return data
        }
    })

    return <div>
        <h1 className="text-2xl font-bold">Chat Demo</h1>
        {selectedConversation ?<div className="border rounded-lg p-4 mt-4">
            <MessageList />

            <ChatWidgetFooter />
        </div> : <Button onClick={() => createConversationMutation.mutate()} className="mt-4">Tạo hội thoại mới</Button>}
    </div>
}