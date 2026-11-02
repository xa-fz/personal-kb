import { useI18n } from '@/components/i18n'
import { AudioPreview } from '@/components/preview/AudioPreview'
import { ImagePreview } from '@/components/preview/ImagePreview'
import { PdfPreview } from '@/components/preview/PdfPreview'
import { TextPreview } from '@/components/preview/TextPreview'
import { VideoPreview } from '@/components/preview/VideoPreview'

const text = new Set(['txt', 'md', 'markdown', 'csv', 'json', 'xml', 'log', 'html', 'htm', 'css', 'js', 'ts'])
const image = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'])
const video = new Set(['mp4', 'webm', 'mov'])
const audio = new Set(['mp3', 'wav', 'm4a', 'ogg'])

export function FilePreview({ filename, url, flow }: { filename: string; url: string; flow?: boolean }) {
  const { t } = useI18n()
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return flow ? <PdfPreview url={url} flow /> : <div className="min-h-0 flex-1"><PdfPreview url={url} /></div>
  if (image.has(ext)) return <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto"><ImagePreview url={url} /></div>
  if (text.has(ext)) return <div className="min-h-0 flex-1"><TextPreview url={url} /></div>
  if (video.has(ext)) return <div className="flex min-h-0 flex-1 items-center justify-center"><VideoPreview url={url} /></div>
  if (audio.has(ext)) return <div className="flex min-h-0 flex-1 items-center"><AudioPreview url={url} /></div>
  return <p className="text-sm text-[#6f675f]">{t('preview_unsupported')}</p>
}
