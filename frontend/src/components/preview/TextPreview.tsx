import { useEffect, useState } from 'react'

export function TextPreview({ url }: { url: string }) {
  const [text, setText] = useState('')

  useEffect(() => {
    let gone = false
    fetch(url)
      .then((res) => res.text())
      .then((value) => {
        if (!gone) setText(value)
      })
    return () => {
      gone = true
    }
  }, [url])

  return <pre className="h-full overflow-auto whitespace-pre-wrap bg-white p-4 text-sm">{text}</pre>
}
