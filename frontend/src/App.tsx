import { useEffect, useState } from 'react'

import { useI18n } from '@/components/i18n'
import { Notice } from '@/components/notice'
import { LoginPage } from '@/pages/login/LoginPage'
import { RegisterPage } from '@/pages/login/RegisterPage'

function App() {
  const { lang, t } = useI18n()
  const [page, setPage] = useState<'login' | 'register'>('login')

  useEffect(() => {
    document.title = `${t(page === 'login' ? 'login' : 'register')} · Personal KB`
  }, [page, lang, t])

  return (
    <>
      <Notice />
      {page === 'register' ? (
        <RegisterPage onLogin={() => setPage('login')} />
      ) : (
        <LoginPage onRegister={() => setPage('register')} />
      )}
    </>
  )
}

export default App
