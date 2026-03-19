import { Button, Container, Divider, TextInput } from "@mantine/core";
import ScriptEmbed from "./ScriptEmbed";
import ChatDemo from "./ChatDemo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConversationList from "./ConversationList";
import { useInputState } from "@mantine/hooks";
import { api } from "../../lib/axios";

export default function AppDemo() {
    const queryClient = new QueryClient();
    const [apiKey, setApiKey] = useInputState(localStorage.getItem('api_key') || '');

    return <QueryClientProvider client={queryClient}>
        <Container className="py-10 flex flex-col gap-10">

        <div>
        <TextInput 
            label="API Key"
            placeholder="Nhập API Key"
            value={apiKey}
            onChange={setApiKey}
        />
        <Button className="mt-4" onClick={() => {
            localStorage.setItem('api_key', apiKey);
            api.defaults.headers['X-Api-Key'] = apiKey;
            queryClient.resetQueries()
        }}>
            Lưu API Key
        </Button>
        </div>

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