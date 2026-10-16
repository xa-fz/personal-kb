import { useEffect, useState } from 'react'

const fieldClass =
  'mt-2 w-full border-b border-[#cfc6ba] bg-transparent py-2 outline-none focus:border-[#241f1b]'

function LibraryShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-full bg-[#f3efe6] text-[#1c1915] lg:grid-cols-[1.15fr_0.85fr]">
      <section className="flex flex-col bg-[#241f1b] px-8 py-10 text-[#f3efe6] lg:px-14 lg:py-14">
        <p className="text-xs tracking-[0.32em] text-[#c4b8a8]">个人文档库</p>
        <div className="py-16 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-0">
          <h1 className="font-serif text-5xl tracking-tight lg:text-6xl">Personal KB</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#d9d0c4]">
            笔记、资料和摘录放在同一处。
            <br />
            登录之后，只能看到自己的文档。
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-16 lg:px-16">{children}</section>
    </main>
  )
}

function App() {
  const [page, setPage] = useState<'login' | 'register'>('login')
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  useEffect(() => {
    document.title = page === 'login' ? '登录 · Personal KB' : '注册 · Personal KB'
  }, [page])

  function onLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function onRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPasswordMismatch(data.get('password') !== data.get('confirm'))
  }

  if (page === 'register') {
    return (
      <LibraryShell>
        <form key="register" onSubmit={onRegister} className="w-full max-w-sm">
          <h2 className="font-serif text-3xl tracking-tight">注册</h2>
          <p className="mt-3 text-sm leading-6 text-[#6f675f]">创建一个账号，用来存放你自己的文档。</p>

          <label className="mt-10 block text-sm" htmlFor="username">
            用户名
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
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={fieldClass}
          />

          <label className="mt-8 block text-sm" htmlFor="confirm">
            确认密码
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            className={fieldClass}
          />
          {passwordMismatch && (
            <p className="mt-3 text-sm text-[#8c3a2f]">两次输入的密码不一致。</p>
          )}

          <button
            type="submit"
            className="mt-10 w-full bg-[#241f1b] py-3 text-sm tracking-widest text-[#f3efe6]"
          >
            创建账号
          </button>
          <button
            type="button"
            onClick={() => {
              setPasswordMismatch(false)
              setPage('login')
            }}
            className="mt-4 w-full border border-[#241f1b] py-3 text-sm tracking-widest"
          >
            返回登录
          </button>
        </form>
      </LibraryShell>
    )
  }

  return (
    <LibraryShell>
      <form key="login" onSubmit={onLogin} className="w-full max-w-sm">
        <h2 className="font-serif text-3xl tracking-tight">登录</h2>
        <p className="mt-3 text-sm leading-6 text-[#6f675f]">使用你的账号进入文档库。</p>

        <label className="mt-10 block text-sm" htmlFor="username">
          用户名
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
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />

        <button
          type="submit"
          className="mt-10 w-full bg-[#241f1b] py-3 text-sm tracking-widest text-[#f3efe6]"
        >
          进入文档库
        </button>
        <button
          type="button"
          onClick={() => {
            setPasswordMismatch(false)
            setPage('register')
          }}
          className="mt-4 w-full border border-[#241f1b] py-3 text-sm tracking-widest"
        >
          注册
        </button>
      </form>
    </LibraryShell>
  )
}

export default App
