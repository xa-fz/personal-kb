import { useState } from 'react'

import { useI18n } from '@/components/i18n'
import { registerUser } from '@/components/http/api'
import { fieldClass, LibraryShell } from '@/components/LibraryShell'
import { PasswordField } from '@/pages/login/PasswordField'

export function RegisterPage({ onLogin }: { onLogin: () => void }) {
  const { t } = useI18n()
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = String(data.get('username') ?? '')
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirm') ?? '')
    if (password !== confirm) {
      setPasswordMismatch(true)
      return
    }
    setPasswordMismatch(false)
    try {
      await registerUser(username, password)
    } catch {
      return
    }
  }

  return (
    <LibraryShell>
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <h2 className="font-serif text-3xl tracking-tight">{t('register')}</h2>
        <p className="mt-3 text-sm leading-6 text-[#6f675f]">{t('register_hint')}</p>

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
        <PasswordField id="password" name="password" autoComplete="new-password" minLength={6} />

        <label className="mt-8 block text-sm" htmlFor="confirm">
          {t('confirm_password')}
        </label>
        <PasswordField id="confirm" name="confirm" autoComplete="new-password" minLength={6} />
        {passwordMismatch && <p className="mt-3 text-sm text-[#8c3a2f]">{t('password_mismatch')}</p>}

        <button
          type="submit"
          className="pointer mt-10 w-full bg-[#241f1b] py-3 text-sm tracking-widest text-[#f3efe6]"
        >
          {t('create_account')}
        </button>
        <button
          type="button"
          onClick={onLogin}
          className="pointer mt-4 w-full border border-[#241f1b] py-3 text-sm tracking-widest"
        >
          {t('back_login')}
        </button>
      </form>
    </LibraryShell>
  )
}
