'use client'

import { useState, useRef } from 'react'
import DrillDown from './DrillDown'

interface ExpandableSectionProps {
  title: string
  label?: string
  children: React.ReactNode
  sectionKey: string
  sectionContent: unknown
  briefDate: string
}

export default function ExpandableSection({
  title,
  label,
  children,
  sectionKey,
  sectionContent,
  briefDate,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [drillDownText, setDrillDownText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [question, setQuestion] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function stream(question?: string) {
    if (isStreaming) return
    setDrillDownText('')
    setIsStreaming(true)

    try {
      const response = await fetch('/api/drilldown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, sectionContent, briefDate, question }),
      })

      if (!response.ok || !response.body) {
        setDrillDownText('Analysis unavailable. Please try again.')
        setIsStreaming(false)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const { text } = JSON.parse(data) as { text: string }
            setDrillDownText((prev) => prev + text)
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch {
      setDrillDownText('Analysis unavailable. Please try again.')
    } finally {
      setIsStreaming(false)
    }
  }

  function handleFollowUp() {
    const q = question.trim()
    if (!q) return
    setQuestion('')
    stream(q)
  }

  return (
    <div
      className="mb-6"
      style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}
    >
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full text-left group flex items-start justify-between gap-4 py-1"
      >
        <div className="flex items-start gap-3 flex-1">
          {label && (
            <span
              className="text-xs tracking-widest uppercase px-2 py-0.5 mt-0.5 shrink-0"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-inter)',
              }}
            >
              {label}
            </span>
          )}
          <h2
            className="text-base md:text-lg font-semibold leading-snug transition-colors group-hover:opacity-80"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            {title}
          </h2>
        </div>
        <span
          className="text-lg mt-0.5 shrink-0 transition-transform duration-200"
          style={{
            color: 'var(--text-muted)',
            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4">
          {children}

          <div className="mt-4">
            {!drillDownText && !isStreaming ? (
              <button
                onClick={() => stream()}
                className="text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
                style={{ color: 'var(--accent)' }}
              >
                Go Deeper →
              </button>
            ) : (
              <>
                <DrillDown text={drillDownText} isStreaming={isStreaming} />

                {!isStreaming && (
                  <div
                    className="mt-5 flex gap-2 items-center"
                    style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                      placeholder="Ask a follow-up about this…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                      style={{
                        color: 'var(--text)',
                        fontFamily: 'var(--font-inter)',
                        caretColor: 'var(--accent)',
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleFollowUp}
                      disabled={!question.trim()}
                      className="text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70 disabled:opacity-20 shrink-0"
                      style={{ color: 'var(--accent)' }}
                    >
                      Ask →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
