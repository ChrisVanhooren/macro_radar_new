import { type SearchParams } from 'next/dist/server/request/search-params'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-full max-w-sm"
        style={{ borderTop: '1px solid var(--accent)', paddingTop: '2rem' }}
      >
        <div className="mb-8">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-inter)' }}
          >
            Macro Intelligence
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Sign in
          </h1>
        </div>

        {hasError && (
          <p
            className="text-sm mb-6 px-3 py-2 rounded"
            style={{
              color: '#f87171',
              backgroundColor: 'rgba(248, 113, 113, 0.08)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
            }}
          >
            Invalid credentials. Try again.
          </p>
        )}

        <form action="/api/auth/login" method="POST" className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs tracking-widest uppercase mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full px-3 py-2.5 text-sm rounded-none outline-none transition-colors"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs tracking-widest uppercase mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 text-sm rounded-none outline-none"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-80 mt-2"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#0a0a0a',
            }}
          >
            Access Brief
          </button>
        </form>
      </div>
    </div>
  )
}
