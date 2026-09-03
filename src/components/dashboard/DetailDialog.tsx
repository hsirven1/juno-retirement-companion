import { useEffect } from 'react'
import { Button } from '../Button'
import { useCopy } from '../../i18n'
import type { ReactNode } from 'react'

export function DetailDialog({
  title,
  eyebrow,
  onClose,
  children,
  actions,
}: {
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
  actions?: ReactNode
}) {
  const copy = useCopy()

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/35 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        aria-label={copy.home.close}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-line bg-paper p-6 shadow-[0_24px_50px_-28px_rgba(36,31,26,0.45)] sm:p-8">
        {eyebrow ? (
          <p className="text-[12px] font-medium tracking-[0.16em] text-clay uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id="dialog-title"
          className="mt-2 font-display text-[1.7rem] leading-snug text-ink"
        >
          {title}
        </h2>
        <div className="mt-4">{children}</div>
        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        <div className="mt-5">
          <Button variant="ghost" className="min-h-11 px-4 text-[16px]" onClick={onClose}>
            {copy.home.close}
          </Button>
        </div>
      </div>
    </div>
  )
}
