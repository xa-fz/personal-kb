export function AudioPreview({ url }: { url: string }) {
  return <audio src={url} controls className="w-full" />
}
