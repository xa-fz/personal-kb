import { useRef, useState } from 'react'

import { DeleteIcon, FileIcon, UploadIcon } from '@/components/icons'
import { useI18n } from '@/components/i18n'
import { fieldClass } from '@/components/LibraryShell'
import { Modal } from '@/components/modal'

const categories = ['guitar', 'fitness', 'astronomy', 'program', 'literature'] as const

function FileDrop() {
  const { t } = useI18n()
  const [files, setFiles] = useState<File[]>([])
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  function write(next: File[]) {
    const el = input.current
    if (!el) return
    const data = new DataTransfer()
    next.forEach((file) => data.items.add(file))
    el.files = data.files
    setFiles(next)
  }

  return (
    <div>
      <label
        className={`pointer relative mt-2 flex h-40 flex-col items-center justify-center border border-dashed bg-[#e7e1d6] px-4 text-[#6f675f] ${over ? 'border-[#241f1b]' : 'border-[#cfc6ba]'}`}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)
          const picked = [...event.dataTransfer.files]
          if (picked.length) write([...files, ...picked])
        }}
      >
        <input
          ref={input}
          id="file"
          name="file"
          type="file"
          multiple
          required={files.length === 0}
          className="absolute size-px opacity-0"
          onChange={(event) => {
            const picked = [...(event.target.files ?? [])]
            event.target.value = ''
            if (picked.length) write([...files, ...picked])
          }}
        />
        <span className="pointer-events-none flex flex-col items-center">
          <UploadIcon />
          <span className="mt-3 text-sm">{t('drop_file')}</span>
        </span>
      </label>
      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 bg-white px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{file.name}</span>
              <button
                type="button"
                aria-label={t('delete')}
                onClick={() => write(files.filter((_, item) => item !== index))}
                className="pointer shrink-0 text-[#8a8178]"
              >
                <DeleteIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const mine = [
  { title: '如何做阅读笔记', visible: true },
  { title: '本周会议记录', visible: false },
  { title: '项目名词表', visible: false },
  { title: '一篇说明文的结构', visible: true },
]

export function AccountPage({ onHome }: { onHome: () => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')
  const summary = [
    { key: 'all' as const, label: t('all'), count: mine.length },
    { key: 'public' as const, label: t('visible'), count: mine.filter((item) => item.visible).length },
    { key: 'private' as const, label: t('private'), count: mine.filter((item) => !item.visible).length },
  ]
  const shown = mine.filter((item) => (filter === 'public' ? item.visible : filter === 'private' ? !item.visible : true))

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <button type="button" onClick={onHome} className="pointer text-sm text-[#6f675f]">
            ← {t('back_home')}
          </button>
          <h2 className="mt-4 font-serif text-4xl tracking-tight">{t('center')}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#6f675f]">{t('personal_hint')}</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="pointer rounded-full bg-[#241f1b] px-5 py-2.5 text-sm text-[#f3efe6]">
          {t('upload')}
        </button>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {summary.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={filter === item.key}
            onClick={() => setFilter(item.key)}
            className={`pointer min-w-28 rounded-2xl px-5 py-4 text-left shadow-[0_8px_24px_rgba(36,31,27,0.06)] ${filter === item.key ? 'bg-[#241f1b] text-[#f3efe6]' : 'bg-white'}`}
          >
            <p className="font-serif text-3xl tracking-tight">{item.count}</p>
            <p className={`mt-1 text-xs ${filter === item.key ? 'text-[#c4b8a8]' : 'text-[#8a8178]'}`}>{item.label}</p>
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((item) => (
          <li key={item.title} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3efe6] text-[#241f1b]">
                <FileIcon />
              </span>
              <span className={item.visible ? 'rounded-full bg-[#241f1b] px-3 py-1 text-xs text-[#f3efe6]' : 'rounded-full bg-[#f3efe6] px-3 py-1 text-xs text-[#6f675f]'}>
                {item.visible ? t('visible') : t('private')}
              </span>
            </div>
            <p className="mt-5 font-serif text-2xl tracking-tight">{item.title}</p>
            <div className="mt-6 flex gap-2">
              <button type="button" className="pointer rounded-full bg-[#f3efe6] px-4 py-1.5 text-sm">
                {t('view')}
              </button>
              <button type="button" className="pointer rounded-full px-4 py-1.5 text-sm text-[#8a8178] hover:bg-[#f3efe6]">
                {t('delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {open && (
        <Modal title={t('upload')} onClose={() => setOpen(false)}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setOpen(false)
            }}
          >
            <fieldset>
              <legend className="text-sm">{t('is_public')}</legend>
              <div className="mt-3 flex gap-6 text-sm">
                <label className="pointer flex items-center gap-2">
                  <input type="radio" name="visible" value="0" defaultChecked />
                  {t('private')}
                </label>
                <label className="pointer flex items-center gap-2">
                  <input type="radio" name="visible" value="1" />
                  {t('visible')}
                </label>
              </div>
            </fieldset>
            <label className="mt-8 block text-sm" htmlFor="category">
              {t('category')}
            </label>
            <select id="category" name="category" required defaultValue="" className={fieldClass}>
              <option value="" disabled>
                {t('choose')}
              </option>
              {categories.map((key) => (
                <option key={key} value={key}>
                  {t(key)}
                </option>
              ))}
            </select>
            <p className="mt-8 text-sm">{t('file')}</p>
            <FileDrop />
            <div className="mt-10 flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="pointer flex-1 border border-[#241f1b] py-3 text-sm">
                {t('cancel')}
              </button>
              <button type="submit" className="pointer flex-1 bg-[#241f1b] py-3 text-sm text-[#f3efe6]">
                {t('upload')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
