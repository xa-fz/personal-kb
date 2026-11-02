import { useEffect } from 'react'

import { useI18n } from '@/components/i18n'

export function Modal({ title, hint, onClose, wide, children }: { title: string; hint?: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  const { t } = useI18n()

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1c1915]/40 p-6" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`flex w-full flex-col bg-[#f3efe6] px-6 py-6 text-[#1c1915] ${wide ? 'h-[calc(100vh-3rem)] max-w-[calc(100vw-3rem)]' : 'h-[min(36rem,calc(100vh-3rem))] max-w-md'}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4">
          <h3 id="modal-title" title={hint ?? title} className="min-w-0 flex-1 truncate font-serif text-2xl tracking-tight">
            {title}
          </h3>
          <button type="button" aria-label={t('close')} onClick={onClose} className="pointer shrink-0 px-2 text-xl leading-none text-[#6f675f]">
            ×
          </button>
        </div>
        <div className="mt-6 flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}
