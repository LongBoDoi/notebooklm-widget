import { Button, Textarea } from "@mantine/core"
import { useInputState } from "@mantine/hooks"

export default function ScriptEmbed() {
    const [scriptString, setScript] = useInputState('')

    const handleEmbed = () => {
        const container = document.createElement("div");
        container.innerHTML = scriptString.trim();

        const script = container.querySelector("script");
        if (!script) return;

        const newScript = document.createElement("script");

        // copy attributes
        for (const attr of script.attributes) {
            newScript.setAttribute(attr.name, attr.value);
        }

        // copy inline code if exists
        if (script.textContent) {
            newScript.textContent = script.textContent;
        }

        document.head.appendChild(newScript);
    }

    return <div>
        <h1 className="text-2xl font-bold mb-4">Nhúng Script</h1>

        <Textarea
            label="Nhập đoạn script để nhúng chatbot"
            placeholder='Nhập đoạn script để nhúng chatbot'
            value={scriptString}
            onChange={setScript}
            rows={4}
        />

        <Button className="mt-4" onClick={handleEmbed}>
            Nhúng
        </Button>
    </div>
}