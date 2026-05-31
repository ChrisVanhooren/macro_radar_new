'use client'

import { useState } from 'react'

export default function GenerateButton() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle')

  async function generate() {
    setState('running')
    try {
      const res = await fetch('/api/generate', { method: 'POST' })
      if (!res.ok) throw new Error('failed')
      setState('done')
      setTimeout(() => window.location.reload(), 800)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const label = {
    idle: 'Generate Brief',
    running: 'Running…',
    done: 'Done — reloading',
    error: 'Failed — retry?',
  }[state]

  return (
    <button
      onClick={generate}
      disabled={state === 'running' || state === 'done'}
      className="text-xs tracking-widest uppercase transition-opacity hover:opacity-70 disabled:opacity-40"
      style={{ color: state === 'error' ? '#ef4444' : 'var(--accent)' }}
    >
      {state === 'running' && (
        <span className="inline-block animate-spin mr-1">⟳</span>
      )}
      {label}
    </button>
  )
}
