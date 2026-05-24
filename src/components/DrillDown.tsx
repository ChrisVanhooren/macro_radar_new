'use client'

interface DrillDownProps {
  text: string
  isStreaming: boolean
}

export default function DrillDown({ text, isStreaming }: DrillDownProps) {
  if (!text && !isStreaming) return null

  return (
    <div
      className="mt-6 pt-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <p
        className="text-xs tracking-[0.25em] uppercase mb-4"
        style={{ color: 'var(--accent)' }}
      >
        Deep Analysis
      </p>
      <div
        className="prose prose-sm max-w-none text-sm leading-relaxed"
        style={{ color: 'var(--text)' }}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {text}
          {isStreaming && (
            <span
              className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          )}
        </p>
      </div>
    </div>
  )
}
