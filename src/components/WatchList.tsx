import ExpandableSection from './ExpandableSection'
import type { WatchListItem } from '@/lib/types'

interface WatchListProps {
  items: WatchListItem[]
  briefDate: string
}

export default function WatchList({ items, briefDate }: WatchListProps) {
  return (
    <section className="mb-10">
      <p
        className="text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
      >
        Watch List
      </p>

      {items.map((item, i) => (
        <ExpandableSection
          key={i}
          title={item.item}
          sectionKey={`watch_list_${i}`}
          sectionContent={item}
          briefDate={briefDate}
        >
          <div className="space-y-3">
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Why Now
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {item.why}
              </p>
            </div>
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Trigger
              </p>
              <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
                {item.trigger}
              </p>
            </div>
          </div>
        </ExpandableSection>
      ))}
    </section>
  )
}
