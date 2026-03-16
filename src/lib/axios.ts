import axios, { type AxiosInstance } from 'axios'

const createBaseInstance = (): AxiosInstance => {
  const instance = axios.create({
    // baseURL: 'https://api.vts-dasc.net',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return instance
}

const api = createBaseInstance()
export { api }
