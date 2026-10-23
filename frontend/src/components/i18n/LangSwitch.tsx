import { setLang, useI18n } from '@/components/i18n'

export function LangSwitch() {
  const { lang } = useI18n()
  const en = lang === 'en'

  return (
    <div className="flex items-center rounded-full bg-[#3a342e] p-0.5 text-xs">
      <button
        type="button"
        onClick={() => setLang('zh-CN')}
        className={en ? 'pointer rounded-full px-2.5 py-1 text-[#8a8178]' : 'pointer rounded-full bg-[#f3efe6] px-2.5 py-1 text-[#241f1b]'}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={en ? 'pointer rounded-full bg-[#f3efe6] px-2.5 py-1 text-[#241f1b]' : 'pointer rounded-full px-2.5 py-1 text-[#8a8178]'}
      >
        EN
      </button>
    </div>
  )
}
