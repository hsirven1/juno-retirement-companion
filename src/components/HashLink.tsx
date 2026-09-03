import { cn } from '../lib/cn'

export function HashLink({
  href,
  children,
  className,
}: {
  href: string
  children: string
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'hidden cursor-pointer text-[16px] text-ink-muted transition-colors hover:text-ink sm:inline',
        className,
      )}
    >
      {children}
    </a>
  )
}
