import { useEffect, useState } from 'react'

import { Empty } from '@/components/empty'
import { FileIcon } from '@/components/icons'
import { listPublicDocuments } from '@/components/http/api'
import { useI18n } from '@/components/i18n'
import { FilePreview } from '@/components/preview'

const topics = ['study', 'life', 'entertainment', 'travel', 'motorcycle', 'music', 'other'] as const

type PublicDoc = { id: number; filename: string; category: string; summary: string; username: string }

function TopButton() {
  const { t } = useI18n()

  return (
    <button
      type="button"
      title={t('to_top')}
      onClick={(event) => {
        let parent = event.currentTarget.parentElement
        while (parent) {
          const overflow = getComputedStyle(parent).overflowY
          if (overflow === 'auto' || overflow === 'scroll') {
            parent.scrollTo({ top: 0, behavior: 'smooth' })
            return
          }
          parent = parent.parentElement
        }
      }}
      className="pointer fixed right-6 bottom-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(36,31,27,0.12)]"
    >
      <img src="/kb/topping.svg" alt="" className="h-5 w-5" />
    </button>
  )
}

export function DetailPage({ id, onBack }: { id: number; onBack: () => void }) {
  const { t } = useI18n()
  const [doc, setDoc] = useState<PublicDoc | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    listPublicDocuments()
      .then((rows) => {
        if (cancelled) return
        const found = rows.find((item) => item.id === id)
        if (!found) setMissing(true)
        else setDoc(found)
      })
      .catch(() => {
        if (!cancelled) setMissing(true)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const category = doc && ((topics as readonly string[]).includes(doc.category) ? t(doc.category as (typeof topics)[number]) : doc.category)

  return (
    <>
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <button type="button" onClick={onBack} className="pointer text-sm text-[#6f675f]">
        ← {t('back_home')}
      </button>
      {missing && <Empty className="mt-8" icon={<FileIcon />} />}
      {doc && (
        <>
          <h2 className="mt-4 font-serif text-4xl tracking-tight">{doc.filename}</h2>
          <p className="mt-3 text-sm text-[#8a8178]">
            {category}
            <span className="mx-2">·</span>
            {doc.username}
          </p>
          {doc.summary && <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6f675f]">{doc.summary}</p>}
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
            <FilePreview flow filename={doc.filename} url={`${import.meta.env.VITE_API_BASE_URL ?? '/api'}/documents/public/${id}`} />
          </div>
        </>
      )}
    </main>
    <TopButton />
    </>
  )
}
