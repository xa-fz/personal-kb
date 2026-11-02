import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerSrc

function Page({ pdf, num, width, onDone }: { pdf: PDFDocumentProxy; num: number; width: number; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const node = canvas.current
    if (!node) return
    let gone = false
    let task: RenderTask | undefined
    pdf.getPage(num).then((page) => {
      if (gone) return
      const base = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: width / base.width })
      node.width = viewport.width
      node.height = viewport.height
      task = page.render({ canvas: node, viewport })
      task.promise.then(() => { if (!gone) done.current() }).catch(() => { if (!gone) done.current() })
    }).catch(() => { if (!gone) done.current() })
    return () => {
      gone = true
      task?.cancel()
    }
  }, [pdf, num, width])

  return <canvas ref={canvas} className="w-full bg-white" />
}

export function PdfPreview({ url, flow }: { url: string; flow?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [width, setWidth] = useState(0)
  const [shown, setShown] = useState(1)

  useEffect(() => {
    setShown(1)
    if (!flow) return
    let gone = false
    const task = getDocument({ url, disableAutoFetch: true })
    task.promise.then((doc) => {
      if (!gone) setPdf(doc)
    }).catch(() => {})
    return () => {
      gone = true
      task.destroy()
    }
  }, [url, flow])

  useEffect(() => {
    if (box.current) setWidth(box.current.clientWidth)
  }, [flow])

  if (!flow) return <iframe title="pdf" src={url} className="h-full w-full bg-white" />

  return (
    <div className="bg-[#525659] p-4">
      <div ref={box} className="space-y-4">
        {pdf && width > 0 && Array.from({ length: Math.min(shown, pdf.numPages) }, (_, index) => (
          <Page key={index} pdf={pdf} num={index + 1} width={width} onDone={() => setShown((n) => n + 1)} />
        ))}
      </div>
    </div>
  )
}
