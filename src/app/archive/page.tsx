import { getAllBriefDates } from '@/lib/db'
import Nav from '@/components/Nav'
import ArchiveList from '@/components/ArchiveList'

export const revalidate = 0

export default async function ArchivePage() {
  const items = await getAllBriefDates()

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
          >
            Archive
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Previous Briefs
          </h1>
        </header>

        <ArchiveList items={items} />
      </main>
    </>
  )
}
