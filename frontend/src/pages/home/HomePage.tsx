import { useEffect, useState } from 'react'

import { useAuth } from '@/components/auth'
import { Dropdown } from '@/components/dropdown'
import { useI18n } from '@/components/i18n'
import { LangSwitch } from '@/components/i18n/LangSwitch'

const shared = [
  {
    title: '如何做阅读笔记',
    author: '林夏',
    excerpt: '先写下自己的问题，再摘下原文里真正回答了这个问题的句子。笔记不是抄书，是留下下次还能用的判断。',
  },
  {
    title: '一篇说明文的结构',
    author: '周宁',
    excerpt: '开头给结论，中间用例子把结论撑住，结尾只收回这一件事。',
  },
  {
    title: '公共文档怎么写才好读',
    author: '陈舟',
    excerpt: '默认读者没有上下文。第一段说清这篇解决什么，后面每一节只推进一步。术语第一次出现时用一句人话解释。',
  },
  {
    title: '收集资料的四个格子',
    author: '林夏',
    excerpt: '事实、例子、反例、还没想清楚的问题，分开记。混在一条笔记里，下次就找不到。',
  },
  {
    title: '把一本书读薄',
    author: '苏晚',
    excerpt: '读完只留三句话：作者的主张、一个让你改主意的例子、一个你仍不同意的地方。',
  },
  {
    title: '分享前先问一句',
    author: '周宁',
    excerpt: '这篇拿出去，陌生人能不能只靠正文看懂？看不懂就还放在个人区。',
  },
]

const mine = [
  { title: '如何做阅读笔记', visible: true },
  { title: '本周会议记录', visible: false },
  { title: '项目名词表', visible: false },
  { title: '一篇说明文的结构', visible: true },
]

export function HomePage() {
  const { t } = useI18n()
  const { username, setToken } = useAuth()
  const name = username || t('signed_in')
  const hot = shared.slice(0, 3)
  const [index, setIndex] = useState(0)
  const slide = hot[index]

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % hot.length), 5000)
    return () => clearInterval(timer)
  }, [hot.length])

  return (
    <div className="h-full overflow-y-auto bg-[#f3efe6] text-[#1c1915]">
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 bg-[#241f1b] px-6 py-4 text-[#f3efe6] lg:px-10">
        <div>
          <p className="text-xs tracking-[0.32em] text-[#c4b8a8]">{t('brand')}</p>
          <p className="font-serif text-xl tracking-tight">Personal KB</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Dropdown
            label={name}
            header={`Hi, ${name}`}
            trigger={
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3efe6] font-serif text-sm text-[#241f1b]">
                {name.slice(0, 1).toUpperCase()}
              </span>
            }
            items={[{ label: t('logout'), onClick: () => setToken('') }]}
          />
          <LangSwitch />
        </div>
      </header>

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
          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {shared.map((doc) => (
              <article key={doc.title} className="mb-5 break-inside-avoid bg-white px-5 py-6">
                <h3 className="font-serif text-2xl tracking-tight">{doc.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6f675f]">{doc.excerpt}</p>
                <p className="mt-6 text-xs tracking-[0.18em] text-[#8a8178]">{doc.author}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 pb-10">
          <h2 className="font-serif text-3xl tracking-tight">{t('personal')}</h2>
          <p className="mt-3 text-sm leading-6 text-[#6f675f]">{t('personal_hint')}</p>
          <ul className="mt-8 border-y border-[#e4dcd0]">
            {mine.map((item) => (
              <li key={item.title} className="flex items-center justify-between gap-4 border-b border-[#e4dcd0] py-4 last:border-b-0">
                <span className="font-serif text-lg">{item.title}</span>
                <span className="shrink-0 text-xs tracking-[0.18em] text-[#8a8178]">
                  {item.visible ? t('visible') : t('private')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
