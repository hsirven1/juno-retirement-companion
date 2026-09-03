import { cn } from '../lib/cn'

export function JunoAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClass =
    size === 'sm'
      ? 'size-8'
      : size === 'lg'
        ? 'size-11'
        : 'size-9'

  return (
    <img
      src="/juno-avatar.png"
      alt=""
      className={cn('shrink-0 rounded-full object-cover', sizeClass, className)}
      aria-hidden="true"
    />
  )
}
