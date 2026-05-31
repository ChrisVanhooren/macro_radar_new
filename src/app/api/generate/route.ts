import { NextResponse } from 'next/server'
import { runDailyAgent } from '@/lib/agent'
import { storeBrief } from '@/lib/db'

export async function POST() {
  const date = new Date().toISOString().split('T')[0]
  const brief = await runDailyAgent(date)
  await storeBrief(brief, date)
  return NextResponse.json({ ok: true, date, headline: brief.headline })
}
