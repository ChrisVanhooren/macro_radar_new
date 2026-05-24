import ExpandableSection from './ExpandableSection'
import type { UnderTheSurface as UnderTheSurfaceType } from '@/lib/types'

interface UnderTheSurfaceProps {
  data: UnderTheSurfaceType
  briefDate: string
}

export default function UnderTheSurface({ data, briefDate }: UnderTheSurfaceProps) {
  return (
    <section className="mb-10">
      <p
        className="text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
      >
        Under the Surface
      </p>

      <ExpandableSection
        title="The early signal most aren't watching"
        sectionKey="under_the_surface"
        sectionContent={data}
        briefDate={briefDate}
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            {data.summary}
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                What to Watch
              </p>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{data.what_to_watch}</p>
            </div>
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Time Horizon
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--accent)' }}
              >
                {data.time_horizon}
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
    </section>
  )
}
