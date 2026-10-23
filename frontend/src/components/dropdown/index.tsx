import { useEffect, useRef, useState } from 'react'

export function Dropdown({
  label,
  trigger,
  header,
  items,
}: {
  label: string
  trigger: React.ReactNode
  header?: string
  items: { label: string; onClick: () => void }[]
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className="relative" ref={root}>
      <button type="button" aria-label={label} onClick={() => setOpen((value) => !value)} className="pointer">
        {trigger}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-3 min-w-36 bg-[#f3efe6] text-[#1c1915]">
          {header && <p className="border-b border-[#e4dcd0] px-4 py-3 text-sm whitespace-nowrap">{header}</p>}
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false)
                item.onClick()
              }}
              className="pointer block w-full px-4 py-2 text-left text-sm hover:bg-[#e7e1d6]"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
