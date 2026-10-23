import { getToken } from '@/components/auth'
import { errorDetail, noticeText } from '@/components/i18n'
import { showNotice } from '@/components/notice'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

type Options = RequestInit & { key?: string }

export async function request<T>(path: string, options?: Options): Promise<T> {
  const { key, headers, ...init } = options ?? {}
  const method = (init.method ?? 'GET').toUpperCase()
  const token = getToken()
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    })
  } catch {
    const text = noticeText(false, method, key)
    showNotice('error', text)
    throw new Error(text)
  }
  if (!res.ok) {
    let detail = ''
    try {
      const body = (await res.json()) as { detail?: unknown }
      if (typeof body.detail === 'string') detail = errorDetail(body.detail)
    } catch {
      detail = ''
    }
    const text = detail || noticeText(false, method, key)
    showNotice('error', text)
    throw new Error(text)
  }
  if (method !== 'GET') showNotice('success', noticeText(true, method, key))
  return (await res.json()) as T
}
