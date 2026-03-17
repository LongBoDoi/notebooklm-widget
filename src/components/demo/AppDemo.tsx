import { Button, Container, Divider } from "@mantine/core";
import ScriptEmbed from "./ScriptEmbed";
import ChatDemo from "./ChatDemo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConversationList from "./ConversationList";

export default function AppDemo() {
    const queryClient = new QueryClient();

    return <QueryClientProvider client={queryClient}>
        <Container className="py-10 flex flex-col gap-10">

        <ConversationList />

        <ChatDemo />

        <Divider />

        <ScriptEmbed />

        <div>
            <h1 className="text-2xl font-bold mb-4">Gỡ script</h1>
            <Button color="red" onClick={() => window.OfficeMateChatbotConfig?.unmountChatbot()}>
                Gỡ
            </Button>
        </div>

        <div>
            <h1 className="text-2xl font-bold mb-4">Khởi động lại hội thoại</h1>
            <Button onClick={() => window.OfficeMateChatbotConfig?.createNewSession()}>
                Khởi động lại
            </Button>
        </div>

    </Container>
    </QueryClientProvider>
}