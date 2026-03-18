import { createContext, useContext, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { WidgetService, type WidgetConfig } from '../services/widget.service'

interface ConfigContextType {
  config: WidgetConfig
  embedToken: string
  apiUrl: string
}

const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType)
export const useConfig = () => useContext<ConfigContextType>(ConfigContext)

export const ConfigProvider = ({ children, embedToken, apiUrl }: { children: ReactNode, embedToken: string, apiUrl: string }) => {
  const configQuery = useQuery({
    queryKey: ['widget-config', embedToken],
    enabled: !!embedToken,
    queryFn: async () => {
      const data = await WidgetService.getConfig(apiUrl, embedToken)
      if (!data.theme) {
        data.theme = {
          primaryColor: '#ef0604',
          width: 320,
          height: 450
        }
      }
      return data
    },
  })

  return (
    <ConfigContext.Provider
      value={{
        config: configQuery.data || {} as WidgetConfig,
        embedToken,
        apiUrl
      }}
    >
      {configQuery.isSuccess && configQuery.data && children}
    </ConfigContext.Provider>
  )
}
