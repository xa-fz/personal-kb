import { useState } from 'react'

import { EyeIcon, EyeOffIcon } from '@/components/icons'
import { useI18n } from '@/components/i18n'
import { fieldClass } from '@/components/LibraryShell'

export function PasswordField({
  id,
  name,
  autoComplete,
  minLength,
}: {
  id: string
  name: string
  autoComplete: string
  minLength?: number
}) {
  const { t } = useI18n()
  const [shown, setShown] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={shown ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        className={`${fieldClass} pr-8`}
      />
      <button
        type="button"
        aria-label={shown ? t('hide_password') : t('show_password')}
        onClick={() => setShown((value) => !value)}
        className="pointer absolute right-0 bottom-1.5 text-[#6f675f]"
      >
        {shown ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}
