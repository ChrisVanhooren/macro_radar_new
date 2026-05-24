import ExpandableSection from './ExpandableSection'
import type { WhatHappenedItem } from '@/lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  RATES: '#7dd3fc',
  FX: '#86efac',
  GEOPOLITICS: '#fca5a5',
  SUPPLY_CHAIN: '#fdba74',
  ENERGY: '#fde68a',
  CENTRAL_BANKS: '#c4b5fd',
  SOVEREIGN_DEBT: '#f9a8d4',
  STRUCTURAL: '#a3a3a3',
}

interface WhatHappenedProps {
  items: WhatHappenedItem[]
  briefDate: string
}

export default function WhatHappened({ items, briefDate }: WhatHappenedProps) {
  return (
    <section className="mb-10">
      <p
        className="text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
      >
        What Happened
      </p>

      {items.map((item, i) => (
        <ExpandableSection
          key={i}
          title={item.title}
          label={item.category}
          sectionKey={`what_happened_${i}`}
          sectionContent={item}
          briefDate={briefDate}
        >
          <div className="space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              {item.summary}
            </p>

            <div
              className="pt-4"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Mechanism
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {item.mechanism}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-xs tracking-widest uppercase px-2 py-0.5 font-medium"
                style={{
                  color: item.signal_or_noise === 'SIGNAL' ? 'var(--signal)' : 'var(--noise)',
                  border: `1px solid ${item.signal_or_noise === 'SIGNAL' ? 'var(--signal)' : 'var(--border)'}`,
                }}
              >
                {item.signal_or_noise}
              </span>
              <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                {item.signal_reason}
              </p>
            </div>
          </div>
        </ExpandableSection>
      ))}
    </section>
  )
}

export { CATEGORY_COLORS }
