import ExpandableSection from './ExpandableSection'
import type { YieldCurve as YieldCurveType } from '@/lib/types'

const SHAPE_COLORS: Record<string, string> = {
  Normal: '#4ade80',
  Steepening: '#86efac',
  Flat: '#fde68a',
  Flattening: '#fdba74',
  Inverted: '#fca5a5',
}

interface YieldCurveProps {
  data: YieldCurveType
  briefDate: string
}

export default function YieldCurve({ data, briefDate }: YieldCurveProps) {
  const shapeColor = SHAPE_COLORS[data.current_shape] ?? 'var(--text-muted)'

  return (
    <section className="mb-10">
      <p
        className="text-xs tracking-[0.3em] uppercase mb-6"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
      >
        Yield Curve
      </p>

      <ExpandableSection
        title="Yield Curve Dynamics"
        label={data.current_shape.toUpperCase()}
        sectionKey="yield_curve"
        sectionContent={data}
        briefDate={briefDate}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {data.commentary}
        </p>
      </ExpandableSection>
    </section>
  )
}
