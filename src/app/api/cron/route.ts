import { NextRequest, NextResponse } from 'next/server'
import { runDailyAgent } from '@/lib/agent'
import { storeBrief } from '@/lib/db'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`

  if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get('date')
  const date = dateParam ?? new Date().toISOString().split('T')[0]

  try {
    console.log(`[cron] Running daily agent for ${date}`)
    const brief = await runDailyAgent(date)
    await storeBrief(brief, date)
    console.log(`[cron] Stored brief for ${date}: ${brief.headline}`)

    return NextResponse.json({ ok: true, date, headline: brief.headline })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[cron] Failed for ${date}:`, message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
