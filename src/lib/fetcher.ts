export type FetcherOptions = {
  method?: string
  headers?: Record<string, string>
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  body?: any
  signal?: AbortSignal
}

const BASE_URL = 'https://api.vts-dasc.net'

export async function originFetcher(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<Response> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  const { headers, body, method, ...rest } = options

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: method || 'GET',
    // credentials: isProduction ? 'include' : 'same-origin',
    headers: {
      ...defaultHeaders,
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  return res
}
