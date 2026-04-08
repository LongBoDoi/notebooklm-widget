import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { WidgetService, type WidgetConfig } from '../services/widget.service'

interface ConfigContextType {
  config: WidgetConfig
  embedToken: string
}

const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType)
export const useConfig = () => useContext<ConfigContextType>(ConfigContext)

export const ConfigProvider = ({ children, embedToken }: { children: ReactNode, embedToken: string}) => {
  const configQuery = useQuery({
    queryKey: ['widget-config', embedToken],
    enabled: !!embedToken,
    queryFn: async () => {
      const data = await WidgetService.getConfig(embedToken)

      switch (data.position) {
        case 'BOTTOM_RIGHT':
          window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { position: 'fixed', bottom: '20px', right: '20px', left: 'unset' } }, '*')
          break
        case 'BOTTOM_LEFT':
          window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { position: 'fixed', bottom: '20px', left: '20px', right: 'unset' } }, '*')
          break
        default:
          window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { position: 'fixed', bottom: '20px', right: '20px', left: 'unset' } }, '*')
          break
      }

      return data
    },
  })

  useEffect(() => {
    if (configQuery.isError) {
      window.parent.postMessage({ type: 'SET_IFRAME_STYLE', style: { display: 'none' } }, '*')
    }
  }, [configQuery.isError])

  return (
    <ConfigContext.Provider
      value={{
        config: configQuery.data || {} as WidgetConfig,
        embedToken
      }}
    >
      {configQuery.isSuccess && configQuery.data && children}
    </ConfigContext.Provider>
  )
}
