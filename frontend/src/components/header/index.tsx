import { useAuth } from '@/components/auth'
import { Dropdown } from '@/components/dropdown'
import { logoutUser } from '@/components/http/api'
import { useI18n } from '@/components/i18n'
import { LangSwitch } from '@/components/i18n/LangSwitch'

export function SiteHeader({ onHome, onAccount }: { onHome: () => void; onAccount: () => void }) {
  const { t } = useI18n()
  const { username, setToken } = useAuth()
  const name = username || t('signed_in')

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 bg-[#241f1b] px-6 py-4 text-[#f3efe6] lg:px-10">
      <button type="button" onClick={onHome} className="pointer text-left">
        <p className="text-xs tracking-[0.32em] text-[#c4b8a8]">{t('brand')}</p>
        <p className="font-serif text-xl tracking-tight">Personal KB</p>
      </button>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={onAccount} className="pointer text-sm">
          {t('center')}
        </button>
        <Dropdown
          label={name}
          header={`Hi, ${name}`}
          trigger={
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3efe6] font-serif text-sm text-[#241f1b]">
              {name.slice(0, 1).toUpperCase()}
            </span>
          }
          items={[
            {
              label: t('logout'),
              onClick: async () => {
                try {
                  await logoutUser()
                  setToken('')
                } catch {
                  return
                }
              },
            },
          ]}
        />
        <LangSwitch />
      </div>
    </header>
  )
}
