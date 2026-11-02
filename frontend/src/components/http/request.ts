import axios from 'axios'

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
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export async function fileBlob(path: string): Promise<Blob> {
  const token = getToken()
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch {
    const text = noticeText(false, 'GET')
    showNotice('error', text)
    throw new Error(text)
  }
  if (!res.ok) {
    const text = noticeText(false, 'GET')
    showNotice('error', text)
    throw new Error(text)
  }
  return res.blob()
}

export async function upload<T>(path: string, body: FormData, onProgress: (loaded: number, total: number) => void, key?: string): Promise<T> {
  const token = getToken()
  try {
    const res = await axios.post<T>(`${BASE_URL}${path}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      onUploadProgress: (event) => {
        if (event.total) onProgress(event.loaded, event.total)
      },
    })
    return res.data
  } catch (error) {
    let detail = ''
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { detail?: unknown } | undefined
      if (typeof data?.detail === 'string') detail = errorDetail(data.detail)
    }
    const text = detail || noticeText(false, 'POST', key)
    showNotice('error', text)
    throw new Error(text)
  }
}
