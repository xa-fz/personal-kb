export function ImagePreview({ url }: { url: string }) {
  return <img src={url} alt="" className="mx-auto max-h-full max-w-full object-contain" />
}
