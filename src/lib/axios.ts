import axios, { type AxiosInstance } from 'axios'

const createBaseInstance = (): AxiosInstance => {
  const instance = axios.create({
    // baseURL: 'https://api.vts-dasc.net',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'ndk_f068689f7ae0a10c226d846b08951693cb6078d7d10c4d4422e1b185502abfc0',
    },
  })

  return instance
}

const api = createBaseInstance()

export { api }
