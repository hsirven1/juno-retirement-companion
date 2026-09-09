import { getMentorById } from '../../data/mentors'
import { cn } from '../../lib/cn'

const palette = [
  { bg: '#F6E4DF', ink: '#B93A26' },
  { bg: '#E1EFE4', ink: '#216245' },
  { bg: '#E3EAF8', ink: '#24499C' },
  { bg: '#EDE4FA', ink: '#5B3FA8' },
  { bg: '#F7EBD8', ink: '#8A5D0A' },
]

function paletteFor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % palette.length
  }
  return palette[hash] ?? palette[0]
}

/** Mentor portrait when available; otherwise a tasteful initials fallback. */
export function MentorAvatar({
  id,
  firstName,
  size = 64,
  className,
  photoUrl,
}: {
  id: string
  firstName: string
  size?: number
  className?: string
  photoUrl?: string
}) {
  const colors = paletteFor(id)
  const initial = (firstName.trim()[0] ?? 'M').toUpperCase()
  const resolvedPhoto = photoUrl ?? getMentorById(id)?.photoUrl

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold',
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.bg,
        color: colors.ink,
        fontSize: Math.max(14, Math.round(size * 0.36)),
      }}
    >
      {resolvedPhoto ? (
        <img
          src={resolvedPhoto}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <>
          <span
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.9), transparent 55%)`,
            }}
          />
          <span className="relative">{initial}</span>
        </>
      )}
    </span>
  )
}
