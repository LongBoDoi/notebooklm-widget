import axios, { type AxiosInstance } from 'axios'

const createBaseInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return instance
}

const api = createBaseInstance()
export { api }
