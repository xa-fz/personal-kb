import { createContext, useContext, useState } from 'react'

const KEY = 'token'
const NAME = 'username'

const AuthContext = createContext<{
  token: string
  username: string
  setToken: (token: string, username?: string) => void
} | null>(null)

export function getToken() {
  return localStorage.getItem(KEY) ?? ''
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState(getToken)
  const [username, setUsername] = useState(() => localStorage.getItem(NAME) ?? '')

  function setToken(next: string, name?: string) {
    if (!next) {
      localStorage.removeItem(KEY)
      localStorage.removeItem(NAME)
      setTokenState('')
      setUsername('')
      return
    }
    localStorage.setItem(KEY, next)
    if (name) localStorage.setItem(NAME, name)
    setTokenState(next)
    if (name) setUsername(name)
  }

  return <AuthContext.Provider value={{ token, username, setToken }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider missing')
  return value
}
