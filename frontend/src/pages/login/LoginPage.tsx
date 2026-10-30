import { useAuth } from '@/components/auth'
import { useI18n } from '@/components/i18n'
import { loginUser } from '@/components/http/api'
import { fieldClass, LibraryShell } from '@/components/LibraryShell'
import { PasswordField } from '@/pages/login/PasswordField'

export function LoginPage({ onRegister, onSuccess }: { onRegister: () => void; onSuccess: () => void }) {
  const { t } = useI18n()
  const { setToken } = useAuth()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = String(data.get('username') ?? '')
    const password = String(data.get('password') ?? '')
    try {
      const body = await loginUser(username, password)
      setToken(body.access_token, username)
      onSuccess()
    } catch {
      return
    }
  }

  return (
    <LibraryShell>
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <h2 className="font-serif text-3xl tracking-tight">{t('login')}</h2>
        <p className="mt-3 text-sm leading-6 text-[#6f675f]">{t('login_hint')}</p>

        <label className="mt-10 block text-sm" htmlFor="username">
          {t('username')}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className={fieldClass}
        />

        <label className="mt-8 block text-sm" htmlFor="password">
          {t('password')}
        </label>
        <PasswordField id="password" name="password" autoComplete="current-password" />

        <button
          type="submit"
          className="pointer mt-10 w-full bg-[#241f1b] py-3 text-sm tracking-widest text-[#f3efe6]"
        >
          {t('enter_library')}
        </button>
        <button
          type="button"
          onClick={onRegister}
          className="pointer mt-4 w-full border border-[#241f1b] py-3 text-sm tracking-widest"
        >
          {t('register')}
        </button>
      </form>
    </LibraryShell>
  )
}
