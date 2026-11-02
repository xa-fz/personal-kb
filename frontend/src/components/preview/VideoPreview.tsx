export function VideoPreview({ url }: { url: string }) {
  return <video src={url} controls className="max-h-full max-w-full" />
}
