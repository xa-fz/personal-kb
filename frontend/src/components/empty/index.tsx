import type { ReactNode } from 'react'

import { useI18n } from '@/components/i18n'
import { cn } from '@/lib/utils'

export function Empty({ icon, description, className }: { icon: ReactNode; description?: string; className?: string }) {
  const { t } = useI18n()

  return (
    <div className={cn('flex flex-col items-center py-8 text-center', className)}>
      <span className="text-[#241f1b] [&_svg]:h-12! [&_svg]:w-12!">{icon}</span>
      <p className="mt-4 font-serif text-2xl tracking-tight">{t('empty')}</p>
      {description && <p className="mt-2 max-w-sm text-sm leading-6 text-[#6f675f]">{description}</p>}
    </div>
  )
}
