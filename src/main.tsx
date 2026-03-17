import { createRoot } from 'react-dom/client'
import './index.css'
import ChatWidget from './components/ChatWidget.tsx'
import { createTheme, MantineProvider } from '@mantine/core'
// import AppDemo from './components/demo/AppDemo.tsx'

declare global {
  interface Window {
    OfficeMateChatbotConfig?: {
      shadowRoot?: ShadowRoot
      mountChatbot: (embedToken: string, apiUrl: string) => void
      unmountChatbot: () => void

      createNewSession: () => void
    }
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

const appContainer = document.createElement('div')
const root = createRoot(appContainer)

function mountChatbot(embedToken: string, apiUrl: string) {
  // injectStyles(shadowRoot);
  const shadowRoot = window.OfficeMateChatbotConfig?.shadowRoot
  if (!shadowRoot) {
    console.error("Shadow root not found. Please initialize the chatbot container first.");
    return;
  } 

  appContainer.setAttribute('data-mantine-color-scheme', 'light')
  appContainer.style.position = "fixed"
  appContainer.style.bottom = "20px"
  appContainer.style.right = "20px"
  appContainer.style.zIndex = "999999"
  appContainer.id = "officemate-chatbot-container";
  shadowRoot.appendChild(appContainer)

  const resetStyle = document.createElement("style");
  resetStyle.textContent = `
    :host {
      all: initial;
      font-family: system-ui, sans-serif;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }
  `;
  shadowRoot.appendChild(resetStyle);

  // emotion cache -> inject CSS vào shadow DOM
  // const cache = createCache({
  //   key: 'chatbot',
  //   container: shadow,
  // })

  root.render(
    <MantineProvider theme={createTheme({
      defaultRadius: 'lg'
    })} cssVariablesSelector=":host" defaultColorScheme="light">
      <ChatWidget embedToken={embedToken} apiUrl={apiUrl} />
    </MantineProvider>
  )
}

function unmountChatbot() {
  root.unmount()
}

window.OfficeMateChatbotConfig = {
  ...window.OfficeMateChatbotConfig,
  mountChatbot,
  unmountChatbot,
  createNewSession: () => {
  }
}
