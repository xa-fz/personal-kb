import { useEffect, useState } from 'react'

const EVENT = 'app-notice'

type Kind = 'success' | 'error' | 'warning' | 'info'
type Item = { type: Kind; text: string }

const iconColor: Record<Kind, string> = {
  success: '#52c41a',
  error: '#ff4d4f',
  warning: '#faad14',
  info: '#1677ff',
}

export function showNotice(type: Kind, text: string) {
  window.dispatchEvent(new CustomEvent<Item>(EVENT, { detail: { type, text } }))
}

function Icon({ type }: { type: Kind }) {
  const fill = iconColor[type]
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={fill} />
      {type === 'success' && (
        <path d="M7 12.5 10 15.5 17 8.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {type === 'error' && (
        <path d="M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      )}
      {type === 'warning' && (
        <>
          <path d="M12 7.2v6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.6" r="1" fill="#fff" />
        </>
      )}
      {type === 'info' && (
        <>
          <circle cx="12" cy="8" r="1" fill="#fff" />
          <path d="M12 11v6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function Notice() {
  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    let timer = 0
    const onNotice = (event: Event) => {
      setItem((event as CustomEvent<Item>).detail)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setItem(null), 4500)
    }
    window.addEventListener(EVENT, onNotice)
    return () => {
      window.removeEventListener(EVENT, onNotice)
      window.clearTimeout(timer)
    }
  }, [])

  if (!item) return null

  return (
    <div className="fixed top-6 right-6 z-50 w-96 max-w-[calc(100%-3rem)]" role="status">
      <div className="relative rounded-lg bg-white px-6 py-5 shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)]">
        <span className="absolute top-5 left-6">
          <Icon type={item.type} />
        </span>
        <div className="pr-5 pl-9 text-base leading-6 text-[rgba(0,0,0,0.88)]">{item.text}</div>
        <button
          type="button"
          className="pointer absolute top-4 right-4 text-[rgba(0,0,0,0.45)]"
          aria-label="关闭"
          onClick={() => setItem(null)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2 12 12M12 2 2 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
