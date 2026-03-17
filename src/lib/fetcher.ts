export type FetcherOptions = {
  method?: string
  headers?: Record<string, string>
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  body?: any
  signal?: AbortSignal
}

export async function originFetcher(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<Response> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Api-Key': 'ndk_f068689f7ae0a10c226d846b08951693cb6078d7d10c4d4422e1b185502abfc0',
  }

  const { headers, body, method, ...rest } = options

  const res = await fetch(`${endpoint}`, {
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
