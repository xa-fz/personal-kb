import { useEffect, useRef, useState } from 'react'

import { Empty } from '@/components/empty'
import { DeleteIcon, FileIcon, FileTypeIcon, UploadIcon } from '@/components/icons'
import { documentFile, listDocuments, updateDocument, uploadDocument } from '@/components/http/api'
import { noticeText, useI18n } from '@/components/i18n'
import { fieldClass } from '@/components/LibraryShell'
import { Modal } from '@/components/modal'
import { FilePreview } from '@/components/preview'
import { showNotice } from '@/components/notice'

const categories = ['study', 'life', 'entertainment', 'travel', 'motorcycle', 'music', 'other'] as const

function FileDrop({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  const { t } = useI18n()
  const [over, setOver] = useState(false)
  const [folded, setFolded] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  function write(next: File[]) {
    const el = input.current
    if (!el) return
    const data = new DataTransfer()
    next.forEach((file) => data.items.add(file))
    el.files = data.files
    onChange(next)
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
      {files.length > 3 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-[#6f675f]">
            {t('chosen')} {files.length}
          </span>
          <button type="button" onClick={() => setFolded((value) => !value)} className="pointer text-[#241f1b]">
            {folded ? t('expand') : t('collapse')}
          </button>
        </div>
      )}
      {files.length > 0 && (files.length <= 3 || !folded) && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 bg-white px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{file.name}</span>
              <button
                type="button"
                title={t('delete')}
                aria-label={t('delete')}
                onClick={() => write(files.filter((_, item) => item !== index))}
                className="pointer shrink-0"
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

export function AccountPage({ onHome }: { onHome: () => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')
  const [mine, setMine] = useState<Awaited<ReturnType<typeof listDocuments>>>([])
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<{ filename: string; url: string } | null>(null)
  const [edit, setEdit] = useState<(typeof mine)[number] | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const sending = useRef(false)
  useEffect(() => {
    listDocuments().then(setMine).catch(() => {})
  }, [])
  const summary = [
    { key: 'all' as const, label: t('all'), count: mine.length },
    { key: 'public' as const, label: t('visible'), count: mine.filter((item) => item.is_public).length },
    { key: 'private' as const, label: t('private'), count: mine.filter((item) => !item.is_public).length },
  ]
  const shown = mine.filter((item) => (filter === 'public' ? item.is_public : filter === 'private' ? !item.is_public : true))

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
      {shown.length === 0 && <Empty className="mt-4" icon={<FileIcon />} />}
      {shown.length > 0 && (
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((item) => (
          <li key={item.id} className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(36,31,27,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                <FileTypeIcon filename={item.filename} />
                <span className="truncate text-sm text-[#6f675f]">{(categories as readonly string[]).includes(item.category) ? t(item.category as (typeof categories)[number]) : item.category}</span>
              </span>
              <span className={item.is_public ? 'shrink-0 rounded-full bg-[#241f1b] px-3 py-1 text-xs text-[#f3efe6]' : 'shrink-0 rounded-full bg-[#f3efe6] px-3 py-1 text-xs text-[#6f675f]'}>
                {item.is_public ? t('visible') : t('private')}
              </span>
            </div>
            <p className="mt-5 font-serif text-2xl tracking-tight">{item.filename}</p>
            {item.summary && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#8a8178]">{item.summary}</p>}
            <div className="mt-auto flex gap-2 pt-6">
              <button
                type="button"
                title={t('view')}
                aria-label={t('view')}
                onClick={() => {
                  documentFile(item.id).then((blob) => {
                    const url = URL.createObjectURL(blob)
                    setPreview((current) => {
                      if (current) URL.revokeObjectURL(current.url)
                      return { filename: item.filename, url }
                    })
                  }).catch(() => {})
                }}
                className="pointer rounded-full p-1.5 hover:bg-[#f3efe6]"
              >
                <img src="/kb/view.svg" alt="" className="h-5 w-5" />
              </button>
              <button type="button" title={t('edit')} aria-label={t('edit')} onClick={() => setEdit(item)} className="pointer rounded-full p-1.5 hover:bg-[#f3efe6]">
                <img src="/kb/edit.svg" alt="" className="h-5 w-5" />
              </button>
              <button type="button" title={t('delete')} aria-label={t('delete')} className="pointer rounded-full p-1.5 hover:bg-[#f3efe6]">
                <DeleteIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
      )}
      {preview && (
        <Modal
          wide
          title={preview.filename}
          onClose={() => {
            URL.revokeObjectURL(preview.url)
            setPreview(null)
          }}
        >
          <FilePreview filename={preview.filename} url={preview.url} />
        </Modal>
      )}
      {edit && (
        <Modal title={`${t('edit')} ${edit.filename}`} hint={edit.filename} onClose={() => setEdit(null)}>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={async (event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              try {
                await updateDocument(edit.id, String(data.get('category') ?? ''), data.get('visible') === '1', String(data.get('summary') ?? ''))
                setMine(await listDocuments())
                setEdit(null)
              } catch {
                return
              }
            }}
          >
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <fieldset>
                <legend className="text-sm">{t('is_public')}</legend>
                <div className="mt-3 flex gap-6 text-sm">
                  <label className="pointer flex items-center gap-2">
                    <input type="radio" name="visible" value="0" defaultChecked={!edit.is_public} />
                    {t('private')}
                  </label>
                  <label className="pointer flex items-center gap-2">
                    <input type="radio" name="visible" value="1" defaultChecked={edit.is_public} />
                    {t('visible')}
                  </label>
                </div>
              </fieldset>
              <label className="mt-8 block text-sm" htmlFor="edit-category">
                {t('category')}
              </label>
              <select id="edit-category" name="category" required defaultValue={(categories as readonly string[]).includes(edit.category) ? edit.category : ''} className={fieldClass}>
                <option value="" disabled>
                  {t('choose')}
                </option>
                {categories.map((key) => (
                  <option key={key} value={key}>
                    {t(key)}
                  </option>
                ))}
              </select>
              <label className="mt-8 block text-sm" htmlFor="edit-summary">
                {t('summary')}
              </label>
              <textarea id="edit-summary" name="summary" rows={4} defaultValue={edit.summary} className={fieldClass} />
            </div>
            <div className="mt-6 flex shrink-0 gap-3">
              <button type="button" onClick={() => setEdit(null)} className="pointer flex-1 border border-[#241f1b] py-3 text-sm">
                {t('cancel')}
              </button>
              <button type="submit" className="pointer flex-1 bg-[#241f1b] py-3 text-sm text-[#f3efe6]">
                {t('submit')}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {open && (
        <Modal
          title={t('upload')}
          onClose={() => {
            if (progress !== null) return
            setOpen(false)
            setFiles([])
          }}
        >
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={async (event) => {
              event.preventDefault()
              if (!files.length || sending.current) return
              sending.current = true
              const data = new FormData(event.currentTarget)
              const category = String(data.get('category') ?? '')
              const isPublic = data.get('visible') === '1'
              const summary = String(data.get('summary') ?? '')
              const total = files.reduce((sum, file) => sum + file.size, 0) || 1
              let sent = 0
              setProgress(0)
              try {
                for (const file of files) {
                  await uploadDocument(file, category, isPublic, summary, (loaded) => {
                    setProgress(Math.min(100, Math.round(((sent + loaded) / total) * 100)))
                  })
                  sent += file.size
                  setFiles((current) => current.filter((item) => item !== file))
                }
                showNotice('success', noticeText(true, 'POST', 'upload'))
                setMine(await listDocuments())
                setOpen(false)
                setFiles([])
              } catch {
                listDocuments().then(setMine).catch(() => {})
              } finally {
                sending.current = false
                setProgress(null)
              }
            }}
          >
            <div className={`min-h-0 flex-1 overflow-y-auto pr-1 ${progress !== null ? 'pointer-events-none opacity-60' : ''}`}>
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
            <label className="mt-8 block text-sm" htmlFor="summary">
              {t('summary')}
            </label>
            <textarea id="summary" name="summary" rows={4} className={fieldClass} />
            <p className="mt-8 text-sm">{t('file')}</p>
            <FileDrop files={files} onChange={setFiles} />
            </div>
            {progress !== null && (
              <div className="mt-6">
                <div className="h-1 bg-[#e7e1d6]">
                  <div className="h-1 bg-[#241f1b]" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-center text-xs text-[#6f675f]">{progress}%</p>
              </div>
            )}
            <div className="mt-6 flex shrink-0 gap-3">
              <button
                type="button"
                disabled={progress !== null}
                onClick={() => {
                  setOpen(false)
                  setFiles([])
                }}
                className="pointer flex-1 border border-[#241f1b] py-3 text-sm disabled:opacity-40"
              >
                {t('cancel')}
              </button>
              <button type="submit" disabled={progress !== null} className="pointer flex-1 bg-[#241f1b] py-3 text-sm text-[#f3efe6] disabled:opacity-40">
                {t('upload')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  )
}
