import { createRoot } from 'react-dom/client'
import './index.css'
import ChatWidget from './components/ChatWidget.tsx'
import { createTheme, MantineProvider } from '@mantine/core'
// import AppDemo from './components/demo/AppDemo.tsx'

declare global {
  interface Window {
    __CHATBOT_CONFIG__?: {
      embedToken: string;
    };
  }
}

// const rootDom = document.getElementById('root')
// if (rootDom) {
//   createRoot(rootDom).render(
//     <MantineProvider>
//       <AppDemo />
//       <ChatWidget embedToken='820b4e80-a92c-4ea8-aadf-aa7b7a27b402' apiUrl='https://api.vts-dasc.net' />
//     </MantineProvider>,
//   )
// }

function renderApp() {
  const config = window.__CHATBOT_CONFIG__;

  if (!config) {
    console.error("Missing chatbot config");
    return;
  }

  const rootEl = document.getElementById("root");
  if (!rootEl) {
    console.error("Missing root element");
    return;
  }

  const root = createRoot(rootEl);

  root.render(
    <MantineProvider
      theme={createTheme({
        defaultRadius: "lg",
      })}
      defaultColorScheme="light"
    >
      <ChatWidget
        embedToken={config.embedToken}
      />
    </MantineProvider>
  );

  // ✅ notify host
  window.parent.postMessage({ type: "IFRAME_READY" }, "*");

  // ✅ listen from host
  window.addEventListener("message", (event) => {
    const data = event.data || {};

    if (data.type === "OPEN") {
      window.dispatchEvent(new Event("chatbot:open"));
    }

    if (data.type === "CLOSE") {
      window.dispatchEvent(new Event("chatbot:close"));
    }

    if (data.type === "NEW_SESSION") {
      window.dispatchEvent(new Event("chatbot:new-session"));
    }

    if (data.type === "IDENTIFY") {
      window.dispatchEvent(
        new CustomEvent("chatbot:identify", {
          detail: { token: data.token },
        })
      );
    }
  });
}

// chỉ chạy trong iframe
if (window !== window.parent) {
  renderApp();
}