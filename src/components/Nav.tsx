import Link from 'next/link'
import GenerateButton from './GenerateButton'

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link
        href="/"
        className="text-xs tracking-[0.3em] uppercase font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
      >
        Macro Intelligence
      </Link>

      <div className="flex items-center gap-6">
        <GenerateButton />

        <Link
          href="/archive"
          className="text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          Archive
        </Link>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  )
}
