import { useEffect, useState } from 'react'

import { en } from '@/components/i18n/en'
import { zhCN } from '@/components/i18n/zh-CN'

export type Lang = 'zh-CN' | 'en'

const locales: Record<Lang, typeof zhCN> = {
  'zh-CN': zhCN,
  en,
}

const actions: Record<string, keyof typeof zhCN> = {
  POST: 'add',
  PUT: 'update',
  PATCH: 'edit',
  DELETE: 'delete',
}

const details: Record<string, keyof typeof zhCN> = {
  'Username already exists': 'username_exists',
}

function readLang(): Lang {
  const saved = localStorage.getItem('lang')
  if (saved === 'en') return saved
  return 'zh-CN'
}

let lang: Lang = readLang()
document.documentElement.lang = lang

const listeners = new Set<() => void>()

export function setLang(next: Lang) {
  lang = next
  localStorage.setItem('lang', next)
  document.documentElement.lang = next
  listeners.forEach((listener) => listener())
}

export function t(key: keyof typeof zhCN) {
  return locales[lang][key]
}

export function useI18n() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const listener = () => setTick((value) => value + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])
  return { lang, t, setLang }
}

export function noticeText(ok: boolean, method: string, key?: string) {
  const action = actions[method]
  const named = key && key in zhCN ? t(key as keyof typeof zhCN) : ''
  const name = named || (action ? t(action) : '')
  if (!name) return ok ? t('success') : t('request_fail')
  return name + (ok ? t('success') : t('fail'))
}

export function errorDetail(detail: string) {
  const key = details[detail]
  return key ? t(key) : ''
}
