import { useEffect, useState } from 'react'

import { Empty } from '@/components/empty'
import { FileIcon, LikeIcon } from '@/components/icons'
import { listPublicDocuments } from '@/components/http/api'
import { useI18n } from '@/components/i18n'

const topics = ['study', 'life', 'entertainment', 'travel', 'motorcycle', 'music', 'other'] as const

type PublicDoc = { id: number; filename: string; category: string; summary: string; username: string }
type Score = { likes: number; dislikes: number; mine: 0 | 1 | -1 }

export function HomePage({ onOpen }: { onOpen: (id: number) => void }) {
  const { t } = useI18n()
  const [docs, setDocs] = useState<PublicDoc[]>([])
  const [score, setScore] = useState<Record<number, Score>>({})
  const [index, setIndex] = useState(0)
  const hot = docs.slice(0, 3)
  const slide = hot[index]
  const featured = docs[0]
  const rest = docs.slice(1)

  useEffect(() => {
    listPublicDocuments()
      .then((rows) => {
        setDocs(rows)
        setScore(Object.fromEntries(rows.map((doc) => [doc.id, { likes: 0, dislikes: 0, mine: 0 as const }])))
        setIndex(0)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (hot.length === 0) return
    const timer = setInterval(() => setIndex((value) => (value + 1) % hot.length), 5000)
    return () => clearInterval(timer)
  }, [hot.length])

  function vote(id: number, next: 1 | -1) {
    setScore((current) => {
      const item = current[id]
      const mine = item.mine === next ? 0 : next
      return {
        ...current,
        [id]: {
          likes: item.likes - (item.mine === 1 ? 1 : 0) + (mine === 1 ? 1 : 0),
          dislikes: item.dislikes - (item.mine === -1 ? 1 : 0) + (mine === -1 ? 1 : 0),
          mine,
        },
      }
    })
  }

  return (
    <>
      <section className="relative bg-[#d4cdc3] text-[#241f1b]">
        {hot.length > 0 && (
          <>
            <button
              type="button"
              aria-label={t('prev')}
              onClick={() => setIndex((value) => (value - 1 + hot.length) % hot.length)}
              className="pointer absolute top-1/2 left-4 z-10 -translate-y-1/2 p-2 lg:left-8"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 5 L8 12 L15 19" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t('next')}
              onClick={() => setIndex((value) => (value + 1) % hot.length)}
              className="pointer absolute top-1/2 right-4 z-10 -translate-y-1/2 p-2 lg:right-8"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5 L16 12 L9 19" />
              </svg>
            </button>
          </>
        )}
        <article className="mx-auto flex h-96 max-w-6xl flex-col px-16 py-10 lg:px-24">
          <p className="text-xs tracking-[0.28em] text-[#6f675f]">{t('hot')}</p>
          {slide ? (
            <>
              <h2 className="mt-6 line-clamp-2 font-serif text-4xl tracking-tight">{slide.filename}</h2>
              {slide.summary && <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#4a453f]">{slide.summary}</p>}
              <p className="mt-6 text-sm">{slide.username}</p>
              <div className="mt-auto flex items-center gap-2">
                {hot.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.filename}
                    onClick={() => setIndex(itemIndex)}
                    className={
                      itemIndex === index
                        ? 'pointer h-2.5 w-2.5 rounded-full bg-[#241f1b]'
                        : 'pointer h-2.5 w-2.5 rounded-full bg-[#241f1b]/35'
                    }
                  />
                ))}
              </div>
            </>
          ) : (
            <Empty className="mt-8" icon={<FileIcon />} />
          )}
        </article>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <section>
          <h2 className="font-serif text-3xl tracking-tight">{t('public')}</h2>
          <p className="mt-3 text-sm leading-6 text-[#6f675f]">{t('public_hint')}</p>
          <div className="mt-8">
            <p className="text-xs text-[#8a8178]">{t('topic')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((key) => (
                <span key={key} className="rounded-full bg-white px-4 py-2 text-sm shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
                  {t(key)}
                </span>
              ))}
            </div>
          </div>
          {docs.length === 0 ? (
            <Empty className="mt-8" icon={<FileIcon />} />
          ) : (
            <>
              <article onClick={() => onOpen(featured.id)} className="pointer mt-4 rounded-2xl bg-white p-8 shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
                <h3 className="font-serif text-4xl tracking-tight">{featured.filename}</h3>
                {featured.summary && <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-7 text-[#6f675f]">{featured.summary}</p>}
                <p className="mt-8 text-sm text-[#8a8178]">{featured.username}</p>
              </article>
              {rest.length > 0 && (
                <ul className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
                  {[...rest]
                    .sort((a, b) => score[b.id].likes - score[a.id].likes)
                    .map((doc) => (
                      <li key={doc.id} className="flex items-center gap-6 border-b border-[#e4dcd0] px-6 py-4 last:border-b-0">
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-3">
                            <span className="truncate font-serif text-lg">{doc.filename}</span>
                            <span className="shrink-0 text-sm text-[#8a8178]">{doc.username}</span>
                          </span>
                          {doc.summary && <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#8a8178]">{doc.summary}</p>}
                        </span>
                        <span className="flex shrink-0 items-center gap-4 text-sm">
                          <button
                            type="button"
                            aria-label={t('like')}
                            onClick={() => vote(doc.id, 1)}
                            className={`pointer flex items-center gap-1.5 ${score[doc.id].mine === 1 ? 'text-[#241f1b]' : 'text-[#8a8178]'}`}
                          >
                            <LikeIcon />
                            {score[doc.id].likes}
                          </button>
                          <button
                            type="button"
                            aria-label={t('dislike')}
                            onClick={() => vote(doc.id, -1)}
                            className={`pointer flex items-center gap-1.5 ${score[doc.id].mine === -1 ? 'text-[#241f1b]' : 'text-[#8a8178]'}`}
                          >
                            <span className="inline-flex rotate-180">
                              <LikeIcon />
                            </span>
                            {score[doc.id].dislikes}
                          </button>
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}
