import Link from 'next/link'
import type { ArchiveSummary } from '@/lib/types'

interface ArchiveListProps {
  items: ArchiveSummary[]
}

export default function ArchiveList({ items }: ArchiveListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        No briefs yet.
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {items.map((item) => {
        const formatted = new Date(item.date + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        return (
          <Link
            key={item.date}
            href={`/brief/${item.date}`}
            className="flex items-start gap-6 py-5 group transition-opacity hover:opacity-70"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span
              className="text-xs tracking-widest uppercase shrink-0 pt-0.5 w-36"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}
            >
              {formatted}
            </span>
            <span
              className="text-sm leading-snug font-medium"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
            >
              {item.headline}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
