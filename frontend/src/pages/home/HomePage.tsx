import { useEffect, useState } from 'react'

import { LikeIcon } from '@/components/icons'
import { useI18n } from '@/components/i18n'

const topics = ['guitar', 'fitness', 'astronomy', 'program', 'literature'] as const

const quote = {
  text: '读完只留三句话：作者的主张、一个让你改主意的例子、一个你仍不同意的地方。',
  author: '苏晚',
}

const shared = [
  {
    title: '如何做阅读笔记',
    author: '林夏',
    excerpt: '先写下自己的问题，再摘下原文里真正回答了这个问题的句子。笔记不是抄书，是留下下次还能用的判断。',
    likes: 31,
    dislikes: 2,
  },
  {
    title: '一篇说明文的结构',
    author: '周宁',
    excerpt: '开头给结论，中间用例子把结论撑住，结尾只收回这一件事。',
    likes: 18,
    dislikes: 2,
  },
  {
    title: '公共文档怎么写才好读',
    author: '陈舟',
    excerpt: '默认读者没有上下文。第一段说清这篇解决什么，后面每一节只推进一步。术语第一次出现时用一句人话解释。',
    likes: 26,
    dislikes: 1,
  },
  {
    title: '收集资料的四个格子',
    author: '林夏',
    excerpt: '事实、例子、反例、还没想清楚的问题，分开记。混在一条笔记里，下次就找不到。',
    likes: 9,
    dislikes: 3,
  },
  {
    title: '把一本书读薄',
    author: '苏晚',
    excerpt: '读完只留三句话：作者的主张、一个让你改主意的例子、一个你仍不同意的地方。',
    likes: 14,
    dislikes: 1,
  },
  {
    title: '分享前先问一句',
    author: '周宁',
    excerpt: '这篇拿出去，陌生人能不能只靠正文看懂？看不懂就还放在个人区。',
    likes: 7,
    dislikes: 4,
  },
]

export function HomePage() {
  const { t } = useI18n()
  const [score, setScore] = useState(() =>
    Object.fromEntries(shared.map((doc) => [doc.title, { likes: doc.likes, dislikes: doc.dislikes, mine: 0 as 0 | 1 | -1 }])),
  )
  const hot = shared.slice(0, 3)

  function vote(title: string, next: 1 | -1) {
    setScore((current) => {
      const item = current[title]
      const mine = item.mine === next ? 0 : next
      return {
        ...current,
        [title]: {
          likes: item.likes - (item.mine === 1 ? 1 : 0) + (mine === 1 ? 1 : 0),
          dislikes: item.dislikes - (item.mine === -1 ? 1 : 0) + (mine === -1 ? 1 : 0),
          mine,
        },
      }
    })
  }
  const [index, setIndex] = useState(0)
  const slide = hot[index]

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % hot.length), 5000)
    return () => clearInterval(timer)
  }, [hot.length])

  return (
    <>
      <section className="relative bg-[#d4cdc3] text-[#241f1b]">
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
        <article className="mx-auto flex h-96 max-w-6xl flex-col px-16 py-10 lg:px-24">
          <p className="text-xs tracking-[0.28em] text-[#6f675f]">{t('hot')}</p>
          <h2 className="mt-6 line-clamp-2 font-serif text-4xl tracking-tight">{slide.title}</h2>
          <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-7 text-[#4a453f]">{slide.excerpt}</p>
          <p className="mt-6 text-sm">{slide.author}</p>
          <div className="mt-auto flex items-center gap-2">
            {hot.map((item, itemIndex) => (
              <button
                key={item.title}
                type="button"
                aria-label={item.title}
                onClick={() => setIndex(itemIndex)}
                className={
                  itemIndex === index
                    ? 'pointer h-2.5 w-2.5 rounded-full bg-[#241f1b]'
                    : 'pointer h-2.5 w-2.5 rounded-full bg-[#241f1b]/35'
                }
              />
            ))}
          </div>
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
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-[0_8px_24px_rgba(36,31,27,0.06)] lg:col-span-2">
              <div>
                <h3 className="font-serif text-4xl tracking-tight">{shared[0].title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f675f]">{shared[0].excerpt}</p>
              </div>
              <p className="mt-8 text-sm text-[#8a8178]">{shared[0].author}</p>
            </article>
            <blockquote className="flex flex-col justify-between rounded-2xl bg-[#e7e1d6] p-8">
              <div>
                <p className="text-xs text-[#8a8178]">{t('excerpt')}</p>
                <p className="mt-4 font-serif text-2xl leading-snug tracking-tight">{quote.text}</p>
              </div>
              <p className="mt-8 text-sm text-[#6f675f]">{quote.author}</p>
            </blockquote>
          </div>
          <ul className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
            {[...shared.slice(1)]
              .sort((a, b) => score[b.title].likes - score[a.title].likes)
              .map((doc) => (
                <li key={doc.title} className="flex items-center gap-6 border-b border-[#e4dcd0] px-6 py-4 last:border-b-0">
                  <span className="min-w-0 flex-1 font-serif text-lg">{doc.title}</span>
                  <span className="shrink-0 text-sm text-[#8a8178]">{doc.author}</span>
                  <span className="flex shrink-0 items-center gap-4 text-sm">
                    <button
                      type="button"
                      aria-label={t('like')}
                      onClick={() => vote(doc.title, 1)}
                      className={`pointer flex items-center gap-1.5 ${score[doc.title].mine === 1 ? 'text-[#241f1b]' : 'text-[#8a8178]'}`}
                    >
                      <LikeIcon />
                      {score[doc.title].likes}
                    </button>
                    <button
                      type="button"
                      aria-label={t('dislike')}
                      onClick={() => vote(doc.title, -1)}
                      className={`pointer flex items-center gap-1.5 ${score[doc.title].mine === -1 ? 'text-[#241f1b]' : 'text-[#8a8178]'}`}
                    >
                      <span className="inline-flex rotate-180">
                        <LikeIcon />
                      </span>
                      {score[doc.title].dislikes}
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  )
}
