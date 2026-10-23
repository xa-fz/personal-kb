import { setLang, useI18n, type Lang } from '@/components/i18n'

const langs: { id: Lang; label: string }[] = [
  { id: 'zh-CN', label: '简体' },
  { id: 'zh-TW', label: '繁體' },
  { id: 'en', label: 'EN' },
]

export const fieldClass =
  'mt-2 w-full border-b border-[#cfc6ba] bg-transparent py-2 outline-none focus:border-[#241f1b]'

export function LibraryShell({ children }: { children: React.ReactNode }) {
  const { lang, t } = useI18n()

  return (
    <main className="grid min-h-full bg-[#f3efe6] text-[#1c1915] lg:grid-cols-[1.15fr_0.85fr]">
      <section className="flex flex-col bg-[#241f1b] px-8 py-10 text-[#f3efe6] lg:px-14 lg:py-14">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs tracking-[0.32em] text-[#c4b8a8]">{t('brand')}</p>
          <div className="flex shrink-0 divide-x divide-[#c4b8a8]/50 border border-[#c4b8a8]/70 text-[11px] tracking-[0.18em]">
            {langs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLang(item.id)}
                className={
                  item.id === lang
                    ? 'pointer bg-[#f3efe6] px-3 py-1.5 text-[#241f1b]'
                    : 'pointer px-3 py-1.5 text-[#c4b8a8]'
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="py-16 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-0">
          <h1 className="font-serif text-5xl tracking-tight lg:text-6xl">Personal KB</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#d9d0c4]">
            {t('intro_1')}
            <br />
            {t('intro_2')}
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-16 lg:px-16">{children}</section>
    </main>
  )
}
