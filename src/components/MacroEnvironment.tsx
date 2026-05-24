import ExpandableSection from './ExpandableSection'
import type { MacroEnvironment as MacroEnvType } from '@/lib/types'

interface MacroEnvironmentProps {
  data: MacroEnvType
  briefDate: string
}

export default function MacroEnvironment({ data, briefDate }: MacroEnvironmentProps) {
  return (
    <ExpandableSection
      title="Macro Environment"
      sectionKey="macro_environment"
      sectionContent={data}
      briefDate={briefDate}
    >
      <div className="space-y-4">
        <div
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text)', whiteSpace: 'pre-line' }}
        >
          {data.summary}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
              Cycle Position
            </p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{data.cycle_position}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
              Dominant Force
            </p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{data.dominant_force}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
              Dollar Dynamics
            </p>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{data.dollar_dynamics}</p>
          </div>
        </div>
      </div>
    </ExpandableSection>
  )
}
