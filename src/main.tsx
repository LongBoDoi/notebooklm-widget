import { createRoot } from 'react-dom/client'
// import { CacheProvider } from '@emotion/react'
// import createCache from '@emotion/cache'
import './index.css'
import ChatWidget from './components/ChatWidget.tsx'
import { createTheme, MantineProvider } from '@mantine/core'
// import AppDemo from './components/demo/AppDemo.tsx'

// import mantineCss from "@mantine/core/styles.css?inline";
// import widgetCss from "./index.css?inline";

// function injectStyles(shadowRoot: ShadowRoot) {
//   const style = document.createElement("style");

//   style.textContent = `
//     :host {
//       all: initial;
//       font-family: system-ui, sans-serif;
//     }

//     *, *::before, *::after {
//       box-sizing: border-box;
//     }

//     ${mantineCss}
//   `;

//   shadowRoot.appendChild(style);
// }

declare global {
  interface Window {
    OfficeMateChatbotConfig?: {
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

const host = document.createElement('div')
const shadow = host.attachShadow({ mode: 'open' })

const appContainer = document.createElement('div')
const root = createRoot(appContainer)

function mountChatbot(embedToken: string, apiUrl: string) {
  // injectStyles(shadowRoot);

  document.body.appendChild(host)

  appContainer.setAttribute('data-mantine-color-scheme', 'light')
  appContainer.style.position = "fixed"
  appContainer.style.bottom = "20px"
  appContainer.style.right = "20px"
  appContainer.style.zIndex = "999999"
  appContainer.id = "officemate-chatbot-container";
  shadow.appendChild(appContainer)

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = "http://localhost:3000/widget.css"
  shadow.appendChild(link)

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
  shadow.appendChild(resetStyle);

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
  mountChatbot,
  unmountChatbot,
  createNewSession: () => {
  }
}
