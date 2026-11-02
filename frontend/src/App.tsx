import { useEffect, useState } from 'react'

import { useAuth } from '@/components/auth'
import { SiteHeader } from '@/components/header'
import { useI18n } from '@/components/i18n'
import { Notice } from '@/components/notice'
import { AccountPage } from '@/pages/account/AccountPage'
import { DetailPage } from '@/pages/detail/DetailPage'
import { HomePage } from '@/pages/home/HomePage'
import { LoginPage } from '@/pages/login/LoginPage'
import { RegisterPage } from '@/pages/login/RegisterPage'

const signInPath = '/login/sign-in'
const registerPath = '/login/register'
const accountPath = '/me'

function go(path: string, replace = false) {
  if (location.pathname === path) return
  if (replace) history.replaceState(null, '', path)
  else history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const { lang, t } = useI18n()
  const { token } = useAuth()
  const [path, setPath] = useState(location.pathname)

  useEffect(() => {
    const sync = () => setPath(location.pathname)
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    if (!token && path !== signInPath && path !== registerPath) go(signInPath, true)
  }, [token, path])

  useEffect(() => {
    const title = path === registerPath ? 'register' : path === signInPath || !token ? 'login' : path === accountPath ? 'center' : 'home'
    document.title = `${t(title)} · Personal KB`
  }, [path, token, lang, t])

  const docId = /^\/doc\/(\d+)$/.exec(path)?.[1]
  const page =
    path === registerPath ? (
      <RegisterPage onLogin={() => go(signInPath)} />
    ) : path === signInPath ? (
      <LoginPage onRegister={() => go(registerPath)} onSuccess={() => go('/')} />
    ) : token ? (
      <div className="flex h-full flex-col overflow-hidden bg-[#f3efe6] text-[#1c1915]">
        <SiteHeader onHome={() => go('/')} onAccount={() => go(accountPath)} />
        <div className={`${docId ? '' : 'scroll-none '}min-h-0 flex-1 overflow-y-auto`}>
          {docId ? (
            <DetailPage id={Number(docId)} onBack={() => go('/')} />
          ) : path === accountPath ? (
            <AccountPage onHome={() => go('/')} />
          ) : (
            <HomePage onOpen={(id) => go(`/doc/${id}`)} />
          )}
        </div>
      </div>
    ) : null

  return (
    <>
      <Notice />
      {page}
    </>
  )
}

export default App
