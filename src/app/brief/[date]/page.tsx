import { notFound } from 'next/navigation'
import { getBriefByDate } from '@/lib/db'
import Nav from '@/components/Nav'
import BriefHeader from '@/components/BriefHeader'
import MacroEnvironment from '@/components/MacroEnvironment'
import WhatHappened from '@/components/WhatHappened'
import UnderTheSurface from '@/components/UnderTheSurface'
import WatchList from '@/components/WatchList'
import YieldCurve from '@/components/YieldCurve'

export const revalidate = 0

export default async function BriefPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const brief = await getBriefByDate(date)

  if (!brief) notFound()

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <BriefHeader
          headline={brief.headline}
          oneLine={brief.raw_json.one_line_summary}
          date={brief.date}
        />

        <MacroEnvironment data={brief.macro_environment} briefDate={brief.date} />

        <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          <WhatHappened items={brief.what_happened} briefDate={brief.date} />
        </section>

        <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          <UnderTheSurface data={brief.under_the_surface} briefDate={brief.date} />
        </section>

        <section className="mb-10" style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          <WatchList items={brief.watch_list} briefDate={brief.date} />
        </section>

        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          <YieldCurve data={brief.raw_json.yield_curve} briefDate={brief.date} />
        </section>
      </main>
    </>
  )
}
