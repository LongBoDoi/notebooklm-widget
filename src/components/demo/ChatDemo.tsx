
import MessageList from "../MessgeList";
import ChatWidgetFooter from "../ChatWidgetFooter";

export default function ChatDemo() {

    return <div>
        <h1 className="text-2xl font-bold">Chat Demo</h1>
        <div className="border rounded-lg p-4 mt-4">
            <MessageList />

            <ChatWidgetFooter />
        </div>
    </div>
}