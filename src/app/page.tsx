import { getLatestBrief } from '@/lib/db'
import Nav from '@/components/Nav'
import BriefHeader from '@/components/BriefHeader'
import MacroEnvironment from '@/components/MacroEnvironment'
import WhatHappened from '@/components/WhatHappened'
import UnderTheSurface from '@/components/UnderTheSurface'
import WatchList from '@/components/WatchList'
import YieldCurve from '@/components/YieldCurve'

export const revalidate = 0

export default async function HomePage() {
  const brief = await getLatestBrief()

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        {!brief ? (
          <div className="py-24 text-center">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              No Brief Available
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              The first brief will appear after the daily agent runs.
            </p>
            <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
              To generate a brief now, POST to <code style={{ color: 'var(--accent)' }}>/api/cron</code> with your{' '}
              <code style={{ color: 'var(--accent)' }}>CRON_SECRET</code>.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </>
  )
}
